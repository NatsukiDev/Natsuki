module.exports = (log) => { return {
    error: (message, options, newLine, spacer) => log(message, {
        color: 'redBright',
        source: 'err!',
        sourceColor: 'red',
        level: 0
    }, newLine, spacer),
    warn: (message, options, newLine, spacer) => log(message, {
        color: 'yellowBright',
        source: 'warn',
        sourceColor: 'yellow',
        level: 1
    }, newLine, spacer),
    success: (message, options, newLine, spacer) => log(message, {
        color: 'greenBright',
        source: 'proc' || options && options.source,
        sourceColor: 'green',
        level: options && typeof options.level !== 'undefined' ? options.level : 0
    }, newLine, spacer)
}};