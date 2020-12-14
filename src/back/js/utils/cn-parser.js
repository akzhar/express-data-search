// ф-ция принимает строку cn
// ф-ция возвращает объект инициалов (имя и фамилия)
module.exports = function(cn) {
    const surname = cn.slice(0, cn.indexOf(','));
    const name = cn.slice(cn.indexOf(',') + 2, cn.length);
    return {name, surname};
};