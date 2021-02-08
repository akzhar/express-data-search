(function(){ // модуль активации эл-тов на стр phones
	const utils = window.exports.utils;
	const xhr = window.exports.xhr;
	const render = window.exports.render;
	const nodes = window.exports.nodes;

	let pageName = undefined;

	const retrieveResults = () => {
		const dataToSearch = nodes.searchValueInput.value.toLowerCase();
		xhr.getRequest(`http://${window.location.hostname}:3004/${pageName}${dataToSearch ? `?q=${encodeURIComponent(dataToSearch)}` : ''}`, 'application/json', (data) => {
			const results = JSON.parse(data);
			results.length ? render.printResults(results, pageName) : render.showEmptyMsg();
			nodes.searchBtn.disabled = false;
		}).send();
	};

	const onSearchBtnClick = () => {
		nodes.searchBtn.disabled = true;
		render.showLoadingMsg();
		utils.debounce(retrieveResults)();
		if (nodes.searchValueInput.value) {
			nodes.exportBtn.href = `/phones/excel?q=${nodes.searchValueInput.value}`;
			nodes.exportBtn.title = 'Экспорт в Excel: только результаты запроса';
		}
	};

	const init = () => {
		pageName = document.body.dataset.pagename;

		nodes.searchBtn.addEventListener('click', onSearchBtnClick);
		window.addEventListener('keydown', (evt) => {
			if(evt.key === 'Enter') onSearchBtnClick();
		});
		nodes.searchValueInput.addEventListener('input', () => {
			if (!nodes.searchValueInput.value) {
				render.removeResults(pageName);
				nodes.exportBtn.href = '/phones/excel';
				nodes.exportBtn.title = 'Экспорт в Excel: весь справочник';
			}
		});
		nodes.searchValueInput.focus();
	};

	window.exports.phones = { init }; 
})();