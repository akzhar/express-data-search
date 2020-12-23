(function(){ // модуль сохраняет ссылки на узлы

	const CONFIG = window.exports.CONFIG;

	const nodes = {
		modeSelector: document.querySelector(`#${CONFIG.id.modeSelector}`),
		modeRadioBtns: document.querySelectorAll('input[type="radio"]'),
		searchValueHeader: document.querySelector(`#${CONFIG.id.searchValueHeader}`),
		submitBtn: document.querySelector('input[type="submit"]'),
		plantSelect: document.querySelector(`#${CONFIG.id.plantSelect}`),
		searchParamSelect: document.querySelector(`#${CONFIG.id.searchParamSelect}`),
		searchValueDatalist: document.querySelector(`#${CONFIG.id.searchValueDatalist}`),
		searchValueInput: document.querySelector(`#${CONFIG.id.searchValueInput}`),
		searchBtn: document.querySelector(`#${CONFIG.id.searchBtn}`),
		resultsHeader: document.querySelector(`#${CONFIG.id.resultsHeader}`),
		hint: document.querySelector(`#${CONFIG.id.hint}`),
		hintInstruction: document.querySelector(`#${CONFIG.id.hintInstruction}`),
		loader: document.querySelector(`#${CONFIG.id.loader}`),
		sectionHints: document.querySelector(`#${CONFIG.id.sectionHints}`),
		resultsContainer: document.querySelector(`#${CONFIG.id.resultsContainer}`),
		exportBtn: document.querySelector(`#${CONFIG.id.exportBtn}`)

	};

	window.exports.nodes = nodes;
})();