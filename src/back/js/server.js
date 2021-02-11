const fs = require('fs');
const path = require('path');
const http = require('http');
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
const exportToExcel = require('./utils/excel.js');

const env = JSON.parse(fs.readFileSync('../.env.json', 'utf8'));
const hostName = require('os').hostname();
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
	if (mode === 'accounts-by-ldap') return {filter: `(&${LDAP_FILTER.users}${query})`};
	if (mode === 'accounts-by-name') return {filter: `(&${LDAP_FILTER.users}(cn=*${query}*))`};
	if (mode === 'accounts-by-mail') return {filter: `(&${LDAP_FILTER.users}(mail=${query}))`};
	if (mode === 'computers-by-name') return {filter: `(&${LDAP_FILTER.computers}(cn=*${query}*))`};
	if (mode === 'computers-by-owner') return {filter: `(&${LDAP_FILTER.computers}(description=*${query}*))`};
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
					res.render('page-user', { user, rusonly, utilsFunc: { validator, uacDecoder, managerParser, converter, cnParser } });
				} else {
					res.render('page-users', { users, rusonly, title: `Список аккаунтов по запросу '${query}'` });
				}
			}
			log(`AD users query: ${query}`);
		});
	});
	server.get('/ad-users-expired', (req, res) => {
		const {query, site} = req.query;
		const after = query;
		if (!/^\d+$/.test(after)) res.render('page-error', { error: 'Input should be an integer number!' });
		const rusonly = 'on';
		const scope = (rusonly) ? 'rus' : 'group';
		const ad = getADinstance(scope);
		const filter = defineLdapFilter('accounts-by-ldap', `(extensionAttribute15=${site})`);
		ad.findUsers(filter, (error, users) => {
			if (error) {
				res.render('page-error', { error });
			} else if (!users) {
				res.render('page-error', { error: 'Nothing was found' });
			} else {
				const expiredUsers = users.filter(user => {
					const password = validator.password(user);
					if (password.isExpired) return true;
					if (password.daysToExpire <= after) return true;
					return false;
				});
				res.render('page-users', { users: expiredUsers, rusonly, title: `${site}: пароль просрочен или будет просрочен через ${after} дн.` });

			}
			log(`Expired AD users query: ${site}`);
		});
	});
	server.get('/ad-users-locked', (req, res) => {
		const {site} = req.query;
		const rusonly = 'on';
		const scope = (rusonly) ? 'rus' : 'group';
		const ad = getADinstance(scope);
		const filter = defineLdapFilter('accounts-by-ldap', `(extensionAttribute15=${site})`);
		ad.findUsers(filter, (error, users) => {
			if (error) {
				res.render('page-error', { error });
			} else if (!users) {
				res.render('page-error', { error: 'Nothing was found' });
			} else {
				const lockedUsers = users.filter(user => validator.account(user).isLocked);
				res.render('page-users', { users: lockedUsers, rusonly, title: `Залоченные аккаунты ${site}` });
			}
			log(`Locked AD users query: ${site}`);
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
				res.render('page-user', { user, rusonly, utilsFunc: { validator, uacDecoder, managerParser, converter, cnParser } });
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
				res.render('page-groups', { query, rusonly, groups });
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
				res.render('page-users', { users, rusonly, title: `Состав группы ${query} (в т.ч. из вложенных групп)` });
			}
			log(`AD group query: ${query}`);
		});
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
				res.render('page-computers', { computers: results.other, utilsFunc: { converter }, rusonly, query, mode });
			}
		});
		log(`Computers query: ${query}`);
	});
	server.get('/computers/excel', (req, res) => {
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
				exportToExcel(results.other, query, res, null, ['cn', 'description', 'whenCreated']);
			}
		});
		log(`Computers export to excel query: ${query}`);
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
	// по следующему запросу сервер отдает телефонный справочник в excel формате
	// http://ru-kom1-w171:3000/phones/excel
	server.get('/phones/excel', (req, res) => {
		const {q} = req.query;
		const url = `http://${hostName}:3004/phones${q ? `?q=${q}` : ''}`;
		const request = http.get(url);
		let jsonStr = '';
		request.once('response', (response) => {
			if (response.statusCode === 200) {
				response.on('data', (chunk) => { jsonStr += chunk; });
				response.on('end', () => {
					exportToExcel(JSON.parse(jsonStr), q, res, 'Отдел');
				});
			} else {
				log(`Caught exception\nExcel export query status code: ${response.statusCode}\nExcel export query status msg: ${response.statusMessage}`, true, true);
			}
		});
		request.on('error', (error) => {
			log(`Caught exception\nExcel export query error: ${error}`, true, true);
		});
		request.end();
		log('Phones export to excel query');
	});
	server.listen(env.PORT);
	log(`Server running at http://${ip}:${env.PORT}`);
	log('===============================================================', false);
}

process.on('uncaughtException', (error) => {
	log(`Caught exception\nErr msg: ${error.message}\nErr name: ${error.name}\nErr stack: ${error.stack}`, true, true);
	log('===============================================================', false, true);
});

// запуск сервера
serverRun();