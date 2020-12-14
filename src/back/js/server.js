const fs = require('fs');
const path = require('path');
const express = require('express');
const server = express();
server.set('views', '../views');
server.set('view engine', 'pug');
const ActiveDirectory = require('activedirectory');

const validator = require('./utils/validator.js');
const uacDecoder = require('./utils/uac-decoder.js');
const managerParser = require('./utils/manager-parser.js');
const converter = require('./utils/converter.js');
const cnParser = require('./utils/cn-parser.js');
const adConfig = require('./utils/ad-config.js');
const log = require('./utils/log.js');
const ip = require('./utils/ip.js');

const {HOST_NAME: hostName, PORT: port} = JSON.parse(fs.readFileSync('../.env.json', 'utf8'));
const FRONT_FILES_PATH = '../../front';
const LDAP_FILTER = {
	users: '(|(objectClass=user)(objectClass=person))',
	computers: '(objectClass=computer)'
};

// ф-ция определяет какой экземпляр AD использовать (область поиска)
function getADinstance(scope) {
	if (scope === 'group') return new ActiveDirectory(adConfig.group);
	if (scope === 'rus') return new ActiveDirectory(adConfig.rus);
	if (scope === 'group-limited') return new ActiveDirectory(adConfig.groupLimited); 
	if (scope === 'rus-limited') return new ActiveDirectory(adConfig.rusLimited);
}

// ф-ция определяет ldap фильтр для поиска в зависимости от режима (mode)
function defineLdapFilter(mode, query) { 
	if (mode === 'account-by-ldap') return {filter: `(&${LDAP_FILTER.users}${query})`};
	if (mode === 'account-by-name') return {filter: `(&${LDAP_FILTER.users}(cn=*${query}*))`};
	if (mode === 'account-by-mail') return {filter: `(&${LDAP_FILTER.users}(mail=${query}))`};
	if (mode === 'computer-by-name') return {filter: `(&${LDAP_FILTER.computers}(cn=*${query}*))`};
	if (mode === 'computer-by-owner') return {filter: `(&${LDAP_FILTER.computers}(description=*${query}*))`};
}

function serverRun() {
	server.use(express.static(path.resolve(__dirname, FRONT_FILES_PATH)));
	server.get('/ad-users', (req, res) => {
		const {query, mode, rusonly} = req.query;
		const scope = (rusonly) ? 'rus' : 'group';
		const ad = getADinstance(scope);
		const filter = defineLdapFilter(mode, query);
		ad.findUsers(filter, (error, users) => {
			if (error) {
				res.render('page-error', { error });
			} else if (!users) {
				res.render('page-error', { error: 'Nothing was found' });
			} else {
				if (users.length === 1) {
					const user = users[0];
					res.render('page-user', { user, rusonly, hostName, utilsFunc: { validator, uacDecoder, managerParser, converter, cnParser } });
				} else {
					res.render('page-users', { users, rusonly, hostName, title: `Список аккаунтов по запросу '${query}'` });
				}
			}
			log(`AD users query: ${query}`);
		});
	});
	server.get('/ad-user', (req, res) => {
		const {query, rusonly} = req.query;
		const scope = (rusonly) ? 'rus' : 'group';
		const ad = getADinstance(scope);
		ad.findUser(query, (error, user) => {     
			if (error) {
				res.render('page-error', { error });
			} else if (!user) {
				res.render('page-error', { error: 'Nothing was found' });
			} else {
				res.render('page-user', { user, rusonly, hostName, utilsFunc: { validator, uacDecoder, managerParser, converter, cnParser } });
			}
			log(`AD user query: ${query}`);
		});
	});
	server.get('/ad-groups', (req, res) => {
		const {query, rusonly} = req.query;
		const scope = (rusonly) ? 'rus' : 'group';
		const ad = getADinstance(scope);
		ad.getGroupMembershipForUser(query, (error, groups) => {
			if (error) {
				res.render('page-error', { error });
			} else {
				res.render('page-groups', { query, rusonly, groups, hostName });
			}
		});
		log(`AD groups query: ${query}`);
	});
	server.get('/ad-group', (req, res) => {
		const {query, rusonly} = req.query;
		const scope = (rusonly) ? 'rus' : 'group';
		const ad = getADinstance(`${scope}-limited`); // limited - только имя и почта
		ad.getUsersForGroup(query, (error, users) => {
			if (error) {
				res.render('page-error', { error });
			} else if (!users) {
				res.render('page-error', { error: 'Nothing was found' });
			} else {
				res.render('page-users', { users, rusonly, hostName, title: `Состав группы ${query} (в т.ч. из вложенных групп)` });
			}
			log(`AD group query: ${query}`);
		});
	});
	server.get('/qr-contact', (req, res) => {
		const {query, rusonly} = req.query;
		const scope = (rusonly) ? 'rus' : 'group';
		const ad = getADinstance(scope);
		// const filter = defineLdapFilter(mode, query);
		ad.findUser(query, (error, user) => {
			if (error) {
				res.render('page-error', { error });
			} else {
				res.render('page-qr', { user, hostName, utilsFunc: { cnParser } });
			}            
		});
		log(`QR contact query: ${query}`);
	});
	server.get('/computers', (req, res) => {
		const {query, mode, rusonly} = req.query;
		const scope = (rusonly) ? 'rus' : 'group';
		const ad = getADinstance(scope);
		const filter = defineLdapFilter(mode, query);
		ad.find(filter, (error, results) => {
			if (error) {
				res.render('page-error', { error });
			} else if (!results) {
				res.render('page-error', { error: 'Nothing was found' });
			} else {
				res.render('page-computers', { computers: results.other, hostName, utilsFunc: { converter } });
			}
		});
		log(`Computers query: ${query}`);
	});
	// по следующему запросу сервер отдает список пользователей в json формате (используется в 1С)
	// http://ru-kom1-w171:3000/ad-users/json?scope=rus-limited
	server.get('/ad-users/json', (req, res) => {
		const {scope} = req.query;
		const ad = getADinstance(scope);
		const mode = 'account-by-mail'; // все у кого есть mail
		const query = '*';
		const filter = defineLdapFilter(mode, query);
		ad.findUsers(filter, (error, users) => {
			if (error) {
				res.render('page-error', { error });
			} else if (!users) {
				res.render('page-error', { error: 'Nothing was found' });
			} else {
				res.send(users);
			}
		});
		log(`1C users query: ${query}`);
	});
	server.listen(port);
	log(`Server running at http://${ip}:${port}`);
	log('===============================================================', false);
}

process.on('uncaughtException', (error) => {
	log(`Caught exception\nErr msg: ${error.message}\nErr name: ${error.name}\nErr stack: ${error.stack}`, true, true);
	log('===============================================================', false, true);
});

// запуск сервера
serverRun();