// ф-ция принимает строку-объект менеджера
// ф-ция возвращает строку cn менеджера
module.exports = function(manager) {
    return manager.slice(manager.indexOf('CN=') + 3, manager.indexOf(',OU')).replace(/\\/, '');
};