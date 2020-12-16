(function(){ // модуль активации эл-тов на стр phones
	const CONFIG = window.exports.CONFIG;
	const utils = window.exports.utils;
	const xhr = window.exports.xhr;
	const render = window.exports.render;
	const nodes = window.exports.nodes;

	let pageName = undefined;

	const retrieveResults = () => {
		const dataToSearch = nodes.searchValueInput.value.toLowerCase();
		xhr.getRequest(`http://${CONFIG.hostName}:3004/${pageName}${dataToSearch ? `?q=${encodeURIComponent(dataToSearch)}` : ''}`, 'application/json', (data) => {
			const results = JSON.parse(data);
			results.length ? render.printResults(results, pageName) : render.showEmptyMsg();
		}).send();
	};

	const onSearchBtnClick = () => {
		render.showLoadingMsg();
		utils.debounce(retrieveResults)();
	};

	const init = () => {
		pageName = window.exports.pageName;

		nodes.searchBtn.addEventListener('click', onSearchBtnClick);
		window.addEventListener('keydown', (evt) => {
			if(evt.key === 'Enter') onSearchBtnClick();
		});
		nodes.searchValueInput.addEventListener('input', () => {
			if (!nodes.searchValueInput.value) {
				render.removeResults(pageName);
			}
		});
		nodes.searchValueInput.focus();
	};

	window.exports.phones = { init }; 
})();