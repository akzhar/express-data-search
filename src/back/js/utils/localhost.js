const ifaces = require('os').networkInterfaces();

// ф-ция возвращает ip адрес текущей машины
module.exports = Object.keys(ifaces).reduce((host, ifname) => {
    let iface = ifaces[ifname].find(iface => !('IPv4' !== iface.family || iface.internal !== false));
    return iface? iface.address : host;
}, '127.0.0.1');