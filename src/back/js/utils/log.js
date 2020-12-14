const fs = require('fs');
const getTimeStamp = require('./timestamp.js');
const FILE = {
    log: '../logs/log.txt',
    error: '../logs/error.txt'
};

// ф-ция логирует действия и ошибки в файлы FILE.log и FILE.error соответственно
function log(msg, isTimeStampNeeded = true, isError = false) {
    const newLine = `${(isTimeStampNeeded) ? getTimeStamp() + ' - ' : ''}${msg}\n`;
    fs.appendFile((isError) ? FILE.error : FILE.log, newLine, (err) => {
        if (err) throw err;
    });
}

module.exports = log;