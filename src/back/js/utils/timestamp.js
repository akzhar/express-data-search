// ф-ция возвращает штамп текущего времени в формате д/м/гггг ч:м
function getTimeStamp() {
    const date = new Date();
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;	
}

module.exports = getTimeStamp;