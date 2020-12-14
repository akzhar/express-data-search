(function(){

	const CONFIG = window.exports.CONFIG;

	let searchValueInput = undefined;
	let modeSelector = undefined;
	let modeRadioBtns = undefined;
	let submitBtn = undefined;
	let searchValueHeader = undefined;
	let hint = undefined;

	const setMode = (hintMode) => {
		const mode = Array.prototype.filter.call(modeRadioBtns, (radio) => radio.checked)[0].value;
		searchValueHeader.textContent = CONFIG.modeToText[mode].header;
		searchValueInput.placeholder = CONFIG.modeToText[mode].placeholder;
		if (mode === hintMode) {
			hint.classList.add(`${CONFIG.class.hint}--show`);
		} else {
			hint.classList.remove(`${CONFIG.class.hint}--show`);
		}
	};

	const init = (hintMode) => {
		searchValueInput = document.getElementsByName('query')[0]; // по имени, т.к. только так можно менять placeholder (https://stackoverflow.com/questions/13506481/change-placeholder-text)
		modeSelector = document.querySelector(`#${CONFIG.id.modeSelector}`);
		modeRadioBtns = modeSelector.getElementsByTagName('input');
		submitBtn = document.querySelector('input[type="submit"]');
		searchValueHeader = document.querySelector(`#${CONFIG.id.searchValueHeader}`);
		hint = document.querySelector(`#${CONFIG.id.hint}`);

		searchValueInput.addEventListener('input', () => {
			submitBtn.disabled = (searchValueInput.value) ? false : true;
		});
		modeSelector.addEventListener('click', (evt) => {
			if (evt.target.tagName === 'INPUT') setMode(hintMode);
		});

		setMode(hintMode);
	};

	window.exports.adSearchFilters = { init }; 
})();