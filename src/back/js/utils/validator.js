const converter = require('./converter.js');
const fs = require('fs');
const env = JSON.parse(fs.readFileSync('../.env.json', 'utf8'));

function makeItRed(txt) {
    return `<b style="color: darkred;">${txt}</b>`;
}

// ф-ция принимает объект AD пользователя
// ф-ция возвращает сбщ истек ли пароль и время последнего изменения аккаунта
function password(user) {
    const PASSWORD_MAX_AGE = env.PASSWORD_MAX_AGE;
    const EXCEPTION_ACCOUNT_TYPES = ['Service Account', 'Generic Account'];
    if (EXCEPTION_ACCOUNT_TYPES.includes(user.extensionAttribute1)) return {isExpired: 'N/A', whenChanged: 'N/A'};
    const pwdLastSet = converter.fileTimeToDate(user.pwdLastSet);
    const pwdLastSetDaysAgo = Math.floor((new Date() - pwdLastSet) / 1000 / 60 / 60 / 24);
    const msgIfExpired = `${makeItRed('ДА')} (пароль изменен ${pwdLastSetDaysAgo} дн. назад, просрочен ${pwdLastSetDaysAgo - PASSWORD_MAX_AGE} дн.)`;
    const msgIfNotExpired = `нет (будет просрочен через ${PASSWORD_MAX_AGE - pwdLastSetDaysAgo} дн.)`;
    const isExpired = (pwdLastSetDaysAgo >= PASSWORD_MAX_AGE) ? msgIfExpired : msgIfNotExpired; 
    const whenChanged = `${converter.dateToString(pwdLastSet)} (${pwdLastSetDaysAgo} дн. назад)`;
    return {isExpired, whenChanged};
}

// ф-ция принимает объект AD пользователя
// ф-ция возващает сбщ залочен ли аккаунт (неверно введенный пароль 6 раз)
function isUserLocked(user) {
    if (!user.lockoutTime || user.lockoutTime == 0) return 'нет';
    const lockoutTime = converter.dateToString(converter.fileTimeToDate(user.lockoutTime));
    return `${makeItRed('ДА')} (дата и время блокировки ${lockoutTime})`;
}

module.exports = {password, isUserLocked};