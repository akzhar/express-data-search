const fs = require('fs');
const env = JSON.parse(fs.readFileSync('../.env.json', 'utf8'));
const userAttr = 
[
	'cn',
	'sAMAccountName',
	'whenCreated',
	'pwdLastSet',
	'extensionAttribute1', // account type
	'department',
	'mail',
	'userAccountControl',
	'description',
	'title',
	'manager',
	'lockoutTime',
	'whenChanged',
	'extensionAttribute15', // site code
	'telephoneNumber',
	'accountExpires'
];
const userAttrLimited = ['sAMAccountName', 'mail'];
const groupAttr = ['cn', 'description'];

function Config(baseDN, user = userAttr, group = groupAttr) { 
	this.url = env.LDAP_URL;
	this.baseDN = baseDN;
	this.username =  env.USER_NAME;
	this.password = env.PASSWORD;
	this.attributes = {
		user: user,
		group: group
	};
}

const group = new Config(env.BASE_DN_GROUP);
const rus = new Config(env.BASE_DN_RUS);
const groupLimited = new Config(env.BASE_DN_GROUP, userAttrLimited);
const rusLimited = new Config(env.BASE_DN_RUS, userAttrLimited);

module.exports = {group, rus, groupLimited, rusLimited};