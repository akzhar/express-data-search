(function(){ // модуль активации эл-тов на страницах поиска в AD
	const CONFIG = window.exports.CONFIG;
	const nodes = window.exports.nodes;

	let searchValueInput = undefined;

	const setMode = (options) => {
		const modeId = Array.prototype.filter.call(nodes.modeRadioBtns, (radio) => radio.checked)[0].id;
		nodes.searchValueHeader.textContent = CONFIG.modeIdToText[modeId].header;
		searchValueInput.placeholder = CONFIG.modeIdToText[modeId].placeholder;
		if (options) {
			if (modeId === options.idModeToShowHint) {
				nodes.hint.classList.add(`${CONFIG.class.hint}--show`);
			} else {
				nodes.hint.classList.remove(`${CONFIG.class.hint}--show`);
			}
		}
		searchValueInput.value = '';
		nodes.submitBtn.disabled = true;
		searchValueInput.focus();
	};

	const init = (options) => {
		searchValueInput = document.getElementsByName('query')[0]; // по имени, т.к. только так можно менять placeholder (https://stackoverflow.com/questions/13506481/change-placeholder-text)
		
		searchValueInput.addEventListener('input', () => {
			nodes.submitBtn.disabled = (searchValueInput.value) ? false : true;
		});
		nodes.modeSelector.addEventListener('click', (evt) => {
			if (evt.target.tagName === 'INPUT') setMode(options);
		});

		setMode(options);
	};

	window.exports.ad = { init }; 
})();