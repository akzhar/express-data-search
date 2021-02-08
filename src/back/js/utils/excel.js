const xl = require('excel4node');
const converter = require('./converter.js');

// ф-ция создает Excel файл с данными objects (JSON) и отдает его в качестве ответа res
function exportToExcel(objects, query, res, colsToExport = []) {
	const wb = new xl.Workbook();
	const wsOptions = {
		pageSetup: {
			orientation: 'landscape'
		}
	};
	const ws = wb.addWorksheet(`${query ? query : 'all'}`, wsOptions);
	const headerStyle = wb.createStyle({
		font: {
			bold: true,
			color: '#ffffff',
			size: 14,
		},
		fill: {
			type: 'pattern',
			patternType: 'solid',
			bgColor: '#257CC1',
			fgColor: '#257CC1'
		},
		alignment: {
			horizontal: 'center',
			vertical: 'center'
		}	
	});
	const cellsStyle = wb.createStyle({
		alignment: {
			vertical: 'center',
			wrapText: true
		}		
	});
	
	let col = 1;
	let row = 2;
	for (let obj of objects) {
		col = 1;
		for (let key in obj) {
			if (colsToExport.length === 0 || colsToExport.indexOf(key) !== -1) {
				if (row === 2) ws.cell(1, col).string(key).style(headerStyle);
				let cellValue = obj[key].toString();
				if (key === 'whenCreated') {
					cellValue = converter.dateToString(converter.timeStampToDate(cellValue));
				}
				ws.cell(row, col).string(cellValue).style(cellsStyle);
				ws.column(col).setWidth(20);
				col++;
			}
		}
		row++;
	}
	ws.setPrintArea(1, 1, row-1, col-1);
	wb.write(`${query ? query : 'all'}.xlsx`, res);
}

module.exports = exportToExcel;