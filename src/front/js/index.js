const CONFIG = window.exports.CONFIG;
const dataSearchFilters = window.exports.dataSearchFilters;
const adSearchFilters = window.exports.adSearchFilters;

const pageName = document.body.dataset.pagename;
window.exports.pageName = pageName;
window.exports.data = {};

if(pageName === 'printers' || pageName === 'phones') {
	const xhr = window.exports.xhr;
	xhr.getRequest(`http://${CONFIG.hostName}:3004/VSE-${pageName}`, 'application/json', (data) => {
		window.exports.data['VSE'] = JSON.parse(data);
		xhr.getRequest(`http://${CONFIG.hostName}:3004/KOM-${pageName}`, 'application/json', (data) => {
			window.exports.data['KOM'] = JSON.parse(data);
			xhr.getRequest(`http://${CONFIG.hostName}:3004/MOS-${pageName}`, 'application/json', (data) => {
				window.exports.data['MOS'] = JSON.parse(data);
				dataSearchFilters.init(pageName);
			}).send();
		}).send();
	}).send();
}

if(pageName === 'accounts') {
	adSearchFilters.init('account-by-ldap');
}

if(pageName === 'computers') {
	adSearchFilters.init('computer-by-owner');
}