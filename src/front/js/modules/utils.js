(function() {
	const CONFIG = window.exports.CONFIG;

	let lastTimeout = undefined;

	const debounce = (cb) => {
		return () => {
			if (lastTimeout) window.clearTimeout(lastTimeout);
			lastTimeout = window.setTimeout(() => cb.apply(null, arguments), CONFIG.debounceInterval);
		};
	};

	const removeChilds = (block) => { // ф-ция удаляет все дочерние эл-ты у переданного родителя 'block'
		while (block.firstChild) {
			block.removeChild(block.firstChild);
		}
	};

	const getUniqArrayByFieldname = (arr, fieldName) => { // ф-ция возвращает массив уникальных значений, каждый эл-т переданного массива arr - объект, оценка уникальности по полю fieldName
		const obj = {};
		return arr.filter((el) => Object.prototype.hasOwnProperty.call(obj, el[fieldName]) ? false : obj[el[fieldName]] = true);
	};

	const getFilteredData = (data, fieldName, dataToSearch) => { // ф-ция фильтрует массив данных data: ищет dataToSearch в поле fieldName
		return data.filter(item => {
			const dataField = item[fieldName];
			if (Array.isArray(dataField)) {
				return dataField.some(item => item.toLowerCase().includes(dataToSearch));
			} else {
				return dataField.toLowerCase().includes(dataToSearch);
			}
		});
	};

	const formatMobNo = (mobNo) => { // ф-ция форматирует номер мобильного телефона для печати
		const tt = mobNo.split('');
		if(mobNo.length === 12) {
			tt.splice(2, '', ' (');
			tt.splice(6, '', ') ');
			tt.splice(10, '', '-');
			tt.splice(13, '', '-');
		} else if(mobNo.length === 11) {
			tt.splice(1, '', ' (');
			tt.splice(5, '', ') ');
			tt.splice(9, '', '-');
			tt.splice(12, '', '-');
		}
		return tt.join('');
	};

	const formatDataField = (dataField) => { // ф-ция форматирует значение / массив значений для печати
		return Array.isArray(dataField) ? dataField.toString().split(',').join(' , ') : dataField;
	};

	const formatMobNoField = (mobNoField) => { // ф-ция форматирует значение / массив значений мобильных номеров для печати
		return (Array.isArray(mobNoField)) ? mobNoField.map(mobNo => `<a href="tel:${mobNo}">${formatMobNo(mobNo)}</a>`).join(' , ') : `<a href="tel:${mobNoField}">${formatMobNo(mobNoField)}</a>`;
	};

	window.exports.utils = { debounce, removeChilds, getUniqArrayByFieldname, getFilteredData, formatDataField, formatMobNoField };
})();