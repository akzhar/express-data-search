(function(){ // модуль активации эл-тов на страницах поиска в AD
	const CONFIG = window.exports.CONFIG;
	const nodes = window.exports.nodes;

	let searchValueInput = undefined;

	const setMode = (options) => {
		const mode = Array.prototype.filter.call(nodes.modeRadioBtns, (radio) => radio.checked)[0].value;
		nodes.searchValueHeader.textContent = CONFIG.modeToText[mode].header;
		searchValueInput.placeholder = CONFIG.modeToText[mode].placeholder;
		if (mode === options.hintMode) {
			nodes.hint.classList.add(`${CONFIG.class.hint}--show`);
		} else {
			nodes.hint.classList.remove(`${CONFIG.class.hint}--show`);
		}
		searchValueInput.value = '';
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