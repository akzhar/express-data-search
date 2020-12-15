const CONFIG = window.exports.CONFIG;
const xhr = window.exports.xhr;
const printers = window.exports.printers;
const phones = window.exports.phones;
const ad = window.exports.ad;

const pageName = document.body.dataset.pagename;
window.exports.pageName = pageName;
window.exports.data = {};

if(pageName === 'printers') {
	xhr.getRequest(`http://${CONFIG.hostName}:3004/${pageName}`, 'application/json', (data) => {
		window.exports.data[pageName] = JSON.parse(data);
		printers.init();
	}).send();
}

if(pageName === 'phones') phones.init();

if(pageName === 'accounts') ad.init({ hintMode: 'account-by-ldap'});

if(pageName === 'computers') ad.init({ hintMode: 'computer-by-owner'});