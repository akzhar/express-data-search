// ф-ция принимает штамп времени в формате 20190722201646.0Z
// ф-ция возвращает объект даты
function timeStampToDate(timeStamp) {
	const year = timeStamp.slice(0, 4);
	const month = timeStamp.slice(4, 6);
	const day = timeStamp.slice(6, 8);
	const hours = timeStamp.slice(8, 10);
	const minutes = timeStamp.slice(10, 12);
	return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
}

// ф-ция принимает объект даты
// ф-ция возвращает строку в формате д.м.гггг ч.м
function dateToString(date) {
	return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}

// ф-ция принимает файловое время в формате 132497280497742902
// ф-ция возвращает объект даты
function fileTimeToDate(fileTime) { 
	return new Date (fileTime / 10000 - 11644473600000);
}

module.exports = {timeStampToDate, dateToString, fileTimeToDate};