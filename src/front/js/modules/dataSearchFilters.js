(function(){
	const CONFIG = window.exports.CONFIG;
	const utils = window.exports.utils;

	let pageName = undefined;
	let data = undefined;

	let getResultsCard = undefined;

	let plantSelect = undefined;
	let searchParamSelect = undefined;
	let searchValueDatalist = undefined;
	let searchValueInput = undefined;
	let searchBtn = undefined;
	let resultsHeader = undefined;
	let hint = undefined;
	let loader = undefined;
	let sectionHints = undefined;
	let resultsContainer = undefined;

	const getFilteredData = (plantName, fieldName, dataToSearch) => { // ф-ция фильтрует список выбранного 'plantName': ищет 'dataToSearch' в поле 'fieldName'
		return data[plantName].filter(item => {
			const dataField = item[fieldName];
			if (Array.isArray(dataField)) {
				return dataField.some(item => item.toLowerCase().includes(dataToSearch));
			} else {
				return dataField.toLowerCase().includes(dataToSearch);
			}
		});
	};

	const retrieveResults = () => { // ф-ция делает запрос результата в массив данных
		const plantName = plantSelect.value;
		const fieldName = searchParamSelect.value;
		const dataToSearch = searchValueInput.value.toLowerCase();
		const results = getFilteredData(plantName, fieldName, dataToSearch);
		results.length ? printResults(results) : showEmptyMsg();
	};

	const printResults = (results) => { // ф-ция выводит результаты поиска
		window.setTimeout(() => {
			loader.classList.remove(`${CONFIG.class.loader}--show`);
			results.forEach((item, index) => {
				const resultsСard = getResultsCard(item, index);
				resultsContainer.appendChild(resultsСard);
			});
			resultsContainer.classList.add(`${CONFIG.class.results}--show`);
			resultsHeader.innerHTML = `Результаты поиска - [ ${results.length} ]`;
			if (pageName === 'printers') {
				sectionHints.innerHTML = `<a href="${CONFIG.url.instruction}" class="link link--img" target="blank" title="Открыть инструкцию"><span>Как подключить</span><svg width="14" height="14"><use xlink:href="#printer"></use></svg?</a>`;
			}
		}, CONFIG.searchTimeout);
	};

	const showEmptyMsg = () => { // ф-ция показывает пустое сбщ, если результатов нет
		window.setTimeout(function () {
			loader.classList.remove(`${CONFIG.class.loader}--show`);
			resultsHeader.textContent = 'Результаты поиска';
			hint.innerHTML = `${CONFIG.faceSad} Ничего не найдено... Попробуйте переформулировать Ваш запрос.`;
			hint.classList.add(`${CONFIG.class.hint}--show`);
		}, CONFIG.searchTimeout);
	};

	const addOption = (value) => { // ф-ция добавляет option в datalist
		if (value) {
			const text = value.toString().trim();
			const option = document.createElement('option');
			option.value = text;
			option.textContent = text;
			searchValueDatalist.appendChild(option);
		}
	};

	const addSearchValueDatalistOptions = () => { // ф-ция подгружает выпадающий список опций в datalist, расположенный в 'searchValueContainer'
		utils.removeChilds(searchValueDatalist);
		const fieldName = searchParamSelect.value;
		const plantName = plantSelect.value;
		if (fieldName === 'Цветной') { // true/false столбцы
			addOption('Да');
			addOption('Нет');
		} else {
			const items = utils.getUniqArrayByFieldname(data[plantName], fieldName);
			items.forEach(item => {
				if (Array.isArray(item[fieldName])) {
					item[fieldName].forEach(item => addOption(item));
				} else {
					addOption(item[fieldName]);
				}
			});
		}
	};

	const removeResults = () => { // ф-ция очищает результаты предыдущего поиска
		resultsContainer.classList.remove(`${CONFIG.class.results}--show`);
		resultsHeader.textContent = 'Результаты поиска';
		hint.innerHTML = 'Выставь фильтры и нажми кнопку <svg class="hint__img" width="14" height="14"><use xlink:href="#search"></use></svg> или Enter';
		hint.classList.add(`${CONFIG.class.hint}--show`);
		sectionHints.innerHTML = '';
		searchValueInput.value = '';
		addSearchValueDatalistOptions();
		searchValueInput.focus();
	};

	const getProperty = (HTMLcontent) => { // ф-ция возвращает свойство (строку в карточку результата)
		const p = document.createElement('p');
		p.classList.add('item__property');
		p.innerHTML = HTMLcontent;
		return p;
	};

	const getPrinterCard = (printer, index) => { // ф-ция добавляет карточку принтера в окно результатов
		const item = document.createElement('li');
		item.classList.add('results__item');
		item.classList.add('item');
		const ip = document.createElement('a');
		ip.classList.add('item__link');
		ip.classList.add('link');
		ip.textContent = printer['Имя'];
		ip.href = `http://${printer['IP']}`;
		ip.title = 'Статус, тонер и т.д. Откроется, если у принтера имеется web консоль';
		ip.target = 'blank';
		const no = document.createElement('span');
		no.textContent = `${index + 1}. `;
		const head = document.createElement('h3');
		head.classList.add('item__head');
		head.appendChild(no);
		head.appendChild(ip);
		item.appendChild(head);
		let p = getProperty(`<b>Расположение:</b> ${printer['Расположение']}`);
		item.appendChild(p);
		p = getProperty(`<b>Модель:</b> <a href="https://www.google.com/search?q=${printer['Модель']}&tbm=isch" class="link" target="blank" title='Фото'>${printer['Модель']}</a>`);
		item.appendChild(p);
		p = getProperty(`<b>Цветной:</b> ${printer['Цветной']}`);
		item.appendChild(p);
        
		return item;
	};

	const getContactCard = (contact, index) => { // ф-ция добавляет карточку контакта в окно результатов
		const item = document.createElement('li');
		item.classList.add('results__item');
		item.classList.add('item');
		const description = document.createElement('span');
		description.textContent = `${contact['Описание']} ${contact['ФИО'] ? ' - ' + contact['ФИО'] : ''}`;
		const no = document.createElement('span');
		no.textContent = `${index + 1}. `;
		const head = document.createElement('h3');
		head.classList.add('item__head');
		head.appendChild(no);
		head.appendChild(description);
		item.appendChild(head);
		let p = getProperty(`<b>Отдел:</b> ${contact['Отдел']}`);
		item.appendChild(p);
		p = getProperty(`<b>Стационарный:</b> ${utils.formatDataField(contact['Стационарный'])} ${contact['Короткий стационарный'] ? `(короткий ${utils.formatDataField(contact['Короткий стационарный'])})` : ''}`);
		item.appendChild(p);
		p = getProperty(`<b>Мобильный:</b> ${utils.formatMobNoField(contact['Мобильный'])} ${contact['Короткий мобильный'] ? `(короткий ${utils.formatDataField(contact['Короткий мобильный'])})` : ''}`);
		item.appendChild(p);
		p = getProperty(`<b>Факс:</b> ${utils.formatDataField(contact['Факс'])}`);
		item.appendChild(p);
		p = getProperty(`<b>DECT / CISCO:</b> ${utils.formatDataField(contact['DECT/CISCO'])}`);
		item.appendChild(p);
        
		return item;
	};

	const onSelectChange = () => removeResults(); // ф-ция-обработчик изменения select

	const onSearchBtnClick = () => { // ф-ция-обработчик клика на кнопку поиска
		resultsContainer.classList.remove(`${CONFIG.class.results}--show`);
		hint.classList.remove(`${CONFIG.class.hint}--show`);
		utils.removeChilds(resultsContainer);
		resultsHeader.textContent = 'Подождите...';
		loader.classList.add(`${CONFIG.class.loader}--show`);
		utils.debounce(retrieveResults)();
	};

	const init = () => {
		data = window.exports.data;
		pageName = window.exports.pageName;

		// определеяется ф-ция создания карточки
		getResultsCard = (pageName === 'printers') ? getPrinterCard : getContactCard;

		plantSelect = document.querySelector(`#${CONFIG.id.plantSelect}`);
		searchParamSelect = document.querySelector(`#${CONFIG.id.searchParamSelect}`);
		searchValueDatalist = document.querySelector(`#${CONFIG.id.searchValueDatalist}`);
		searchValueInput = document.querySelector(`#${CONFIG.id.searchValueInput}`);
		searchBtn = document.querySelector(`#${CONFIG.id.searchBtn}`);
		resultsHeader = document.querySelector(`#${CONFIG.id.resultsHeader}`);
		hint = document.querySelector(`#${CONFIG.id.hint}`);
		loader = document.querySelector(`#${CONFIG.id.loader}`);
		sectionHints = document.querySelector(`#${CONFIG.id.sectionHints}`);
		resultsContainer = document.querySelector(`#${CONFIG.id.resultsContainer}`);

		plantSelect.addEventListener('change', onSelectChange);
		searchParamSelect.addEventListener('change', onSelectChange);
		searchBtn.addEventListener('click', onSearchBtnClick);
		addSearchValueDatalistOptions();
		window.addEventListener('keydown', (evt) => {
			if(evt.key === 'Enter') onSearchBtnClick();
		});
	};

	window.exports.dataSearchFilters = { init }; 
})();