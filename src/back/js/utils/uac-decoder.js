// 31 бит
const UAC_PROPERTIES = [
    'RESERVED',
    'RESERVED',
    'RESERVED',
    'RESERVED',
    'RESERVED',
    'PARTIAL_SECRETS_ACCOUNT',
    'RESERVED',
    'TRUSTED_TO_AUTH_FOR_DELEGATION',
    'PASSWORD_EXPIRED',
    'DONT_REQ_PREAUTH',
    'USE_DES_KEY_ONLY',
    'NOT_DELEGATED',
    'TRUSTED_FOR_DELEGATION',
    'SMARTCARD_REQUIRED',
    'MNS_LOGON_ACCOUNT',
    'DONT_EXPIRE_PASSWORD',
    'RESERVED',
    'RESERVED',
    'SERVER_TRUST_ACCOUNT',
    'WORKSTATION_TRUST_ACCOUNT',
    'INTERDOMAIN_TRUST_ACCOUNT',
    'RESERVED',
    'NORMAL_ACCOUNT',
    'TEMP_DUPLICATE_ACCOUNT',
    'ENCRYPTED_TEXT_PWD_ALLOWED',
    'PASSWD_CANT_CHANGE',
    'PASSWD_NOTREQD',
    'LOCKOUT',
    'HOMEDIR_REQUIRED',
    'RESERVED',
    'ACCOUNTDISABLE',
    'SCRIPT',
];

// эти значения будут отдельно выделены
const ALERT_VALUES = ['LOCKOUT', 'PASSWORD_EXPIRED', 'ACCOUNTDISABLE', 'DONT_EXPIRE_PASSWORD'];

// ф-ция принимает десятичное число
// ф-ция возвращает двоичное число - 31 разряд
function toBase2(base10) {
    let value = parseInt(base10, 10);
    let string = '';
    for (let i = 1; i < UAC_PROPERTIES.length; i++) {
        string = `${value % 2}${string}`;
        value = Math.trunc(value / 2);
    }
    return string;
}

// ф-ция принимает значение userAccountControl (десятичное число)
// ф-ция возвращает его человекочитаемое значение
function uacDecoder(UACvalue) {
    const symbols = toBase2(UACvalue).split('');
    let result = '';
    symbols.forEach((symbol, index) => {
        if (symbol === '1') {
            let value = UAC_PROPERTIES[index + 1];
            value =  (ALERT_VALUES.includes(value)) ? `<b style="color: darkred;">${value}</b>` : value;
            result += `${value}; `;
        }
    });
    return result;
}

module.exports = uacDecoder;