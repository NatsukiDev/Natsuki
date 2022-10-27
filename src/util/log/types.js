module.exports = (log) => { return {
    error: (message, options, prenl, postnl, ...multcons) => log(message, {
        color: 'redBright',
        source: 'err!',
        sourceColor: 'red',
        level: 0
    }, prenl, postnl, ...multcons),
    warn: (message, options, prenl, postnl, ...multcons) => log(message, {
        color: 'yellowBright',
        source: 'warn',
        sourceColor: 'yellow',
        level: 1
    }, prenl, postnl, ...multcons),
    success: (message, options, prenl, postnl, ...multcons) => log(message, {
        color: 'greenBright',
        source: 'proc' || options && options.source,
        sourceColor: 'green',
        level: options && typeof options.level !== 'undefined' ? options.level : 0
    }, prenl, postnl, ...multcons)
}};