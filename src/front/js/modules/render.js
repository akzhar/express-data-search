
(function(){
	const CONFIG = window.exports.CONFIG;
	const { plant, fio, description, dept, mobFull, mobShort, internal, external, fax } = CONFIG.dataFieldNames.phones;
	const { ip, name, model, area, isColor } = CONFIG.dataFieldNames.printers;
	const nodes = window.exports.nodes;
	const utils = window.exports.utils;
	const qr = window.exports.qr;

	const getPrinterCard = (printer, index) => { // ф-ция добавляет карточку принтера в окно результатов
		const item = document.createElement('li');
		item.classList.add(CONFIG.class.resultsItem);
		item.classList.add(CONFIG.class.item);

		const ipLink = document.createElement('a');
		ipLink.classList.add(CONFIG.class.link);
		ipLink.textContent = printer[name];
		ipLink.href = `http://${printer[ip]}`;
		ipLink.title = 'Статус, тонер и т.д. Откроется, если у принтера имеется web консоль';
		ipLink.target = '_blank';

		const head = document.createElement('h3');
		head.classList.add(CONFIG.class.itemHead);
		head.textContent = `${index + 1}. `;
		head.appendChild(ipLink);
		item.appendChild(head);

		const photoUrl = `<a href="https://www.google.com/search?q=${printer[model]}&tbm=isch" class="link" target="_blank" title='Фото данной модели'>${printer[model]}</a>`;
		addProperty('Расположение', printer[area], item);
		addProperty('Модель', photoUrl, item);
		addProperty('Цветной', printer[isColor], item);
        
		return item;
	};

	const getContactCard = (contact, index) => { // ф-ция добавляет карточку контакта в окно результатов
		const item = document.createElement('li');
		item.classList.add(CONFIG.class.resultsItem);
		item.classList.add(CONFIG.class.item);

		const head = document.createElement('h3');
		head.textContent = `${index + 1}. ${contact[description]}`;
		head.classList.add(CONFIG.class.itemHead);
		item.appendChild(head);

		if (contact[fio]) addProperty('ФИО', contact[fio], item);
		if (contact[plant]) addProperty('Площадка', contact[plant], item);
		if (contact[dept]) addProperty('Отдел', contact[dept], item);
		if (contact[mobFull]) addProperty('Корпоративный мобильный номер (полный)', utils.formatMobNoField(contact[mobFull]), item);
		if (contact[mobShort]) addProperty('Корпоративный мобильный номер (короткий)', utils.formatMobNoField(contact[mobShort]), item);
		if (contact[internal]) addProperty('Внутренний стационарный номер', utils.formatDataField(contact[internal]), item);
		if (contact[external]) addProperty('Городской стационарный номер', utils.formatDataField(contact[external]), item);
		if (contact[fax]) addProperty('Факс', utils.formatDataField(contact[fax]), item);

		if (contact[mobFull] || contact[mobShort]) {
			const qrLink = document.createElement('a');
			qrLink.href = qr.getQRurl(contact);
			qrLink.classList.add(CONFIG.class.link);
			qrLink.classList.add(CONFIG.class.qrLink);
			qrLink.target = '_blank';
			qrLink.title = 'Сохранить контакт в телефон';
			qrLink.innerHTML = '<svg width="50" height="50"><use xlink:href="#qrcode"></use></svg>';
			item.appendChild(qrLink);
		}
        
		return item;
	};

	const showLoadingMsg = () => { // ф-ция-обработчик клика на кнопку поиска
		nodes.resultsContainer.classList.remove(`${CONFIG.class.results}--show`);
		nodes.hint.classList.remove(`${CONFIG.class.hint}--show`);
		if (nodes.hintInstruction) nodes.hintInstruction.classList.remove(`${CONFIG.class.hint}--show`);
		utils.removeChilds(nodes.resultsContainer);
		nodes.resultsHeader.textContent = 'Подождите...';
		nodes.loader.classList.add(`${CONFIG.class.loader}--show`);
	};

	const printResults = (results, pageName) => { // ф-ция выводит результаты поиска
		window.setTimeout(() => {
			const getResultsCard = pageName === 'printers' ? getPrinterCard : getContactCard;
			nodes.loader.classList.remove(`${CONFIG.class.loader}--show`);
			results.forEach((item, index) => {
				const resultsСard = getResultsCard(item, index);
				nodes.resultsContainer.appendChild(resultsСard);
			});
			nodes.resultsContainer.classList.add(`${CONFIG.class.results}--show`);
			nodes.resultsHeader.innerHTML = `Результаты поиска - [ ${results.length} ]`;
			if (pageName === 'printers') {
				nodes.hintInstruction.classList.add(`${CONFIG.class.hint}--show`);
			}
		}, CONFIG.loaderTimeout);
	};

	const removeResults = (pageName) => { // ф-ция очищает результаты предыдущего поиска
		nodes.resultsContainer.classList.remove(`${CONFIG.class.results}--show`);
		nodes.resultsHeader.textContent = 'Результаты поиска';
		nodes.hint.innerHTML = `Выставь фильтры и нажми кнопку <svg class="${CONFIG.class.hintImg}" width="14" height="14" fill="green"><use xlink:href="#search"></use></svg> или Enter`;
		nodes.hint.classList.add(`${CONFIG.class.hint}--show`);
		if (nodes.hintInstruction) nodes.hintInstruction.classList.remove(`${CONFIG.class.hint}--show`);
		if (pageName === 'printers') {
			nodes.searchValueInput.value = '';
		}
		// nodes.searchValueInput.focus(); // bug in IE (showed old options)
	};

	const getProperty = (HTMLcontent) => { // ф-ция возвращает свойство (строку в карточке результата)
		const p = document.createElement('p');
		p.classList.add(CONFIG.class.property);
		p.innerHTML = HTMLcontent;
		return p;
	};

	const addProperty = (propertyName, data, item) => { // ф-ция инициирует создание свойства и вставляет его в элемент
		const p = getProperty(`<b>${propertyName}:</b> ${data}`);
		item.appendChild(p);
	};

	const showEmptyMsg = () => { // ф-ция показывает пустое сбщ, если результатов нет
		window.setTimeout(function () {
			nodes.loader.classList.remove(`${CONFIG.class.loader}--show`);
			nodes.resultsHeader.textContent = 'Результаты поиска';
			nodes.hint.innerHTML = `${CONFIG.faceSad} Ничего не найдено... Попробуйте переформулировать Ваш запрос.`;
			nodes.hint.classList.add(`${CONFIG.class.hint}--show`);
		}, CONFIG.searchTimeout);
	};

	window.exports.render = { getProperty, showEmptyMsg, showLoadingMsg, printResults, removeResults };
})();
