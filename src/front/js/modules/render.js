
(function(){
	const CONFIG = window.exports.CONFIG;
	const nodes = window.exports.nodes;
	const utils = window.exports.utils;

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
		description.textContent = `${contact['Завод']} - ${contact['Описание']}`;
		const no = document.createElement('span');
		no.textContent = `${index + 1}. `;
		const head = document.createElement('h3');
		head.classList.add('item__head');
		head.appendChild(no);
		head.appendChild(description);
		item.appendChild(head);
		let p = getProperty(`<b>ФИО:</b> ${contact['ФИО']}`);
		item.appendChild(p);
		p = getProperty(`<b>Отдел:</b> ${contact['Отдел']}`);
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

	const showLoadingMsg = () => { // ф-ция-обработчик клика на кнопку поиска
		nodes.resultsContainer.classList.remove(`${CONFIG.class.results}--show`);
		nodes.hint.classList.remove(`${CONFIG.class.hint}--show`);
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
				nodes.sectionHints.innerHTML = `<a href="${CONFIG.url.instruction}" class="link link--img" target="blank" title="Открыть инструкцию"><span>Как подключить</span><svg width="14" height="14"><use xlink:href="#printer"></use></svg?</a>`;
			}
		}, CONFIG.searchTimeout);
	};

	const removeResults = (pageName) => { // ф-ция очищает результаты предыдущего поиска
		nodes.resultsContainer.classList.remove(`${CONFIG.class.results}--show`);
		nodes.resultsHeader.textContent = 'Результаты поиска';
		nodes.hint.innerHTML = 'Выставь фильтры и нажми кнопку <svg class="hint__img" width="14" height="14"><use xlink:href="#search"></use></svg> или Enter';
		nodes.hint.classList.add(`${CONFIG.class.hint}--show`);
		nodes.sectionHints.innerHTML = '';
		if (pageName === 'printers') {
			nodes.searchValueInput.value = '';
		}
		nodes.searchValueInput.focus();
	};

	const getProperty = (HTMLcontent) => { // ф-ция возвращает свойство (строку в карточке результата)
		const p = document.createElement('p');
		p.classList.add(CONFIG.class.property);
		p.innerHTML = HTMLcontent;
		return p;
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
