const converter = require('./converter.js');
const fs = require('fs');
const env = JSON.parse(fs.readFileSync('../.env.json', 'utf8'));

const makeItRed = (txt) => {
	return `<b style="color: darkred;">${txt}</b>`;
};

// ф-ция принимает объект AD пользователя
// ф-ция возвращает bool истек ли пароль, сбщ истек ли пароль и время последнего изменения аккаунта
const password = (user) => {
	const EXCEPTION_ACCOUNT_TYPES = ['Service Account', 'Generic Account', 'Shared Mailbox'];
	if (EXCEPTION_ACCOUNT_TYPES.includes(user.extensionAttribute1)) return { isExpired: false, daysToExpire: Infinity, expiredMsg: 'N/A', lastSet: 'N/A' };
	const pwdLastSet = converter.fileTimeToDate(user.pwdLastSet);
	const pwdLastSetDaysAgo = Math.floor((new Date() - pwdLastSet) / 1000 / 60 / 60 / 24);
	const msgIfExpired = `${makeItRed('ДА')} (пароль изменен ${pwdLastSetDaysAgo} дн. назад, просрочен ${pwdLastSetDaysAgo - env.PASSWORD_MAX_AGE} дн.)`;
	const isExpired = pwdLastSetDaysAgo >= env.PASSWORD_MAX_AGE;
	const daysToExpire = isExpired ? 0 : env.PASSWORD_MAX_AGE - pwdLastSetDaysAgo;
	const msgIfNotExpired = `нет (будет просрочен через ${daysToExpire} дн.)`;
	const expiredMsg = (isExpired) ? msgIfExpired : msgIfNotExpired; 
	const lastSet = `${converter.dateToString(pwdLastSet)} (${pwdLastSetDaysAgo} дн. назад)`;
	return { isExpired, daysToExpire, expiredMsg, lastSet };
};

// ф-ция принимает объект AD пользователя
// ф-ция возващает сбщ залочен ли аккаунт (неверно введенный пароль 6 раз)
const account = (user) => {
	if (!user.lockoutTime || user.lockoutTime == 0) return { isLocked: false, lockedMsg: 'нет' };
	const lockoutTime = converter.dateToString(converter.fileTimeToDate(user.lockoutTime));
	return { isLocked: true, lockedMsg: `${makeItRed('ДА')} (дата и время блокировки ${lockoutTime})` };
};

// ф-ция принимает объект AD пользователя
// ф-ция возващает дату просрочки аккаунта (только для 3rd party)
const isUserExpired = (user) => {
	if (user.extensionAttribute1 === 'End User - External') {
		const whenExpired = converter.fileTimeToDate(user.accountExpires);
		const whenExpiredDaysAgo = Math.floor((new Date() - whenExpired) / 1000 / 60 / 60 / 24);
		const whenExpiredString = converter.dateToString(whenExpired);
		return `(действует до: ${(whenExpiredDaysAgo >= 0) ? makeItRed(whenExpiredString) : whenExpiredString})`;
	}
	return '';
};

module.exports = {password, account, isUserExpired};