(function(){ // модуль активации эл-тов на стр printers
	const utils = window.exports.utils;
	const xhr = window.exports.xhr;
	const render = window.exports.render;
	const nodes = window.exports.nodes;

	let pageName = undefined;
	let printers = undefined;
	let dataByPlant = undefined;

	const retrieveResults = () => { // ф-ция делает запрос результата в массив данных
		const fieldName = nodes.searchParamSelect.value;
		const dataToSearch = nodes.searchValueInput.value.toLowerCase();
		const results = utils.getFilteredData(dataByPlant, fieldName, dataToSearch);
		results.length ? render.printResults(results, pageName) : render.showEmptyMsg();
		nodes.searchBtn.disabled = false;
	};

	const addOption = (select, value) => { // ф-ция добавляет option в select
		if (value) {
			const text = value.toString().trim();
			const option = document.createElement('option');
			option.value = text;
			option.textContent = text;
			select.appendChild(option);
		}
	};

	const addPlantSelectOptions = () => { // ф-ция подгружает выпадающий список опций в select выбора завода
		utils.removeChilds(nodes.plantSelect);
		const fieldName = 'Завод';
		const items = utils.getUniqArrayByFieldname(printers, fieldName);
		items.forEach(item => {
			addOption(nodes.plantSelect, item[fieldName]);
		});
	};

	const addSearchValueDatalistOptions = () => { // ф-ция подгружает выпадающий список опций в datalist, расположенный в 'searchValueContainer'
		utils.removeChilds(nodes.searchValueDatalist);
		const fieldName = nodes.searchParamSelect.value;
		if (fieldName === 'Цветной') { // true/false столбцы
			addOption(nodes.searchValueDatalist, 'Да');
			addOption(nodes.searchValueDatalist, 'Нет');
		} else {
			const items = utils.getUniqArrayByFieldname(dataByPlant, fieldName);
			items.forEach(item => {
				if (Array.isArray(item[fieldName])) {
					item[fieldName].forEach(item => addOption(nodes.searchValueDatalist, item));
				} else {
					addOption(nodes.searchValueDatalist, item[fieldName]);
				}
			});
		}
	};

	const filterDataByPlant = () => { // ф-ция фильтрует данные по выбранному заводу
		const plantName = nodes.plantSelect.value;
		dataByPlant = printers.filter(elem => elem['Завод'] === plantName);
	};

	const onPlantSelectChange = () => { // ф-ция-обработчик изменения select выбора завода
		filterDataByPlant();
		render.removeResults(pageName);
		addSearchValueDatalistOptions();
	};

	const onParamSelectChange = () => { // ф-ция-обработчик изменения select выбора параметра
		render.removeResults(pageName);
		addSearchValueDatalistOptions();
	};

	const onSearchBtnClick = () => {
		nodes.searchBtn.disabled = true;
		render.showLoadingMsg();
		utils.debounce(retrieveResults)();
	};

	const init = () => {
		pageName = document.body.dataset.pagename;

		xhr.getRequest(`http://${window.location.hostname}:3004/${pageName}`, 'application/json', (data) => {
			printers = JSON.parse(data);

			nodes.plantSelect.addEventListener('change', onPlantSelectChange);
			nodes.searchParamSelect.addEventListener('change', onParamSelectChange);
			nodes.searchBtn.addEventListener('click', onSearchBtnClick);
			window.addEventListener('keydown', (evt) => {
				if(evt.key === 'Enter') onSearchBtnClick();
			});
			addPlantSelectOptions();
			filterDataByPlant();
			addSearchValueDatalistOptions();
			nodes.searchValueInput.focus();
		}).send();
	};

	window.exports.printers = { init }; 
})();