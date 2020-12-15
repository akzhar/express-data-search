'use strict';

(function() {
	const CONFIG = {
		id: {
			hint: 'hint',
			loader: 'loader',
			searchValueHeader: 'search-value-header',
			modeSelector: 'mode-selector',
			plantSelect: 'plant-select',
			searchParamSelect: 'search-param-select',
			searchValueDatalist: 'search-value-datalist',
			searchValueInput: 'search-value-input',
			searchBtn: 'search-btn',
			resultsHeader: 'results-header',
			sectionHints: 'section-hints',
			resultsContainer: 'results-container'
		},
		class: {
			hint: 'hint',
			loader: 'loader',
			results: 'results',
			property: 'item__property'
		},
		modeToText: {
			'account-by-name':  {header: 'Поиск по имени (cn)', placeholder: 'cn (можно только часть)'},
			'account-by-mail': {header: 'Поиск по почте (mail)', placeholder: 'mail (полностью)'},
			'account-by-ldap': {header: 'Расширенный поиск (LDAP фильтр)', placeholder: '(givenName=*)(sn=*)'},
			'computer-by-name':  {header: 'Поиск по имени (cn)', placeholder: 'cn (можно только часть)'},
			'computer-by-owner': {header: 'Поиск по владельцу (description)', placeholder: 'sAMAccountName (можно только часть)'}
    
		},
		hostName: 'ru-kom1-w171',
		faceSad: '&#128557',
		debounceInterval: 500,
		searchTimeout: 250,
		xhrTimeout: 5000,
		xhrStatus: { ok: 200 },
		xhrMsg: {
			fail: 'Something went wrong...',
			error: 'Network related problem occured',
			timeout: 'Request exceeded the maximum time limit'
		},
		url: {
			instruction: 'http://collaboration.smurfitkappa.com/sites/RU-SK-Russia/_layouts/15/WopiFrame.aspx?sourcedoc=/sites/RU-SK-Russia/Shared%20Documents/IT%20department/%D0%98%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%86%D0%B8%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8F/%D0%9E%D1%80%D0%B3%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D0%BA%D0%B0/%D0%9A%D0%B0%D0%BA%20%D0%BF%D0%BE%D0%B4%D0%BA%D0%BB%D1%8E%D1%87%D0%B8%D1%82%D1%8C%20%D0%BF%D1%80%D0%B8%D0%BD%D1%82%D0%B5%D1%80.docx'
		}
	};

	// namespace для экспорта модулей
	window.exports = { CONFIG }; 
})();