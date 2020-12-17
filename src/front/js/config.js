'use strict';

(function() {
	const CONFIG = {
		id: {
			hint: 'hint',
			hintInstruction: 'hint-instruction',
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
			resultsContainer: 'results-container',
			exportBtn: 'btn-export'
		},
		class: {
			hint: 'hint',
			hintImg: 'hint__img',
			link: 'link',
			loader: 'loader',
			results: 'results',
			resultsItem: 'results__item',
			item: 'item',
			itemHead: 'item__head',
			property: 'item__property',
			qrLink: 'item__qrlink'
		},
		modeToText: {
			'account-by-name':  {header: 'Поиск по имени (cn)', placeholder: 'cn (можно только часть)'},
			'account-by-mail': {header: 'Поиск по почте (mail)', placeholder: 'mail (полностью)'},
			'account-by-ldap': {header: 'Расширенный поиск (LDAP фильтр)', placeholder: '(givenName=*)(sn=*)'},
			'computer-by-name':  {header: 'Поиск по имени (cn)', placeholder: 'cn (можно только часть)'},
			'computer-by-owner': {header: 'Поиск по владельцу (description)', placeholder: 'sAMAccountName (можно только часть)'}

		},
		dataFieldNames: {
			phones: {
				plant: 'Завод',
				dept: 'Отдел',
				fio: 'ФИО',
				description: 'Описание',
				internal: 'Внутренний стационарный',
				external: 'Городской',
				mobFull: 'Полный мобильный',
				mobShort: 'Короткий мобильный',
				dect: 'DECT/CISCO',
				fax: 'Факс'
			},
			printers: {
				ip: 'IP',
				name: 'Имя',
				model: 'Модель',
				area: 'Расположение',
				isColor: 'Цветной'
			}
		},
		hostName: 'ru-kom1-w171',
		qrSize: 500,
		faceSad: '&#128557',
		debounceInterval: 500,
		searchTimeout: 250,
		xhrTimeout: 5000,
		xhrStatus: { ok: 200 },
		xhrMsg: {
			fail: 'Something went wrong...',
			error: 'Network related problem occured',
			timeout: 'Request exceeded the maximum time limit'
		}
	};

	// namespace для экспорта модулей
	window.exports = { CONFIG }; 
})();