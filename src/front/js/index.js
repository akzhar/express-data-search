const printers = window.exports.printers;
const phones = window.exports.phones;
const ad = window.exports.ad;

const pageName = document.body.dataset.pagename;

if(pageName === 'printers') printers.init(); // данные грузятся 1 раз - далее js ищет в 1 поле (см utils.getFilteredData)

if(pageName === 'phones') phones.init(); // данные запрашиваются каждый раз у json-server

if(pageName === 'accounts') ad.init({ idModeToShowHint: 'accounts-mode-ldap'});

if(pageName === 'expired') ad.init();

if(pageName === 'computers') ad.init({ idModeToShowHint: 'computers-mode-owner'});