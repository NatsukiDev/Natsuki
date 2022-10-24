const chalk = require('chalk');

let defaultOptions = {
    color: "white",
    source: "USER",
    sourceColor: "gray",
    level: 1,
    suffix: " >> "
};

module.exports = (client) => (message = "Test Log", options = {}, newLine = false, spacer = false) => {
    let opt = {};
    opt.color = options.color || defaultOptions.color;
    opt.level = ['string', 'number'].includes(typeof options.level) ? options.level : defaultOptions.level;
    opt.suffix = typeof options.suffix === 'string' ? options.suffix : defaultOptions.suffix;
    opt.source = options.source || defaultOptions.source;
    opt.sourceColor = options.sourceColor || defaultOptions.sourceColor;
    console.log(`${spacer ? '\n' : ''}${chalk[opt.sourceColor](`[${opt.source.toUpperCase()}]`)}${opt.suffix}${options.nc || options.noColor ? message : chalk[opt.color](message)}${newLine ? '\n' : ''}`);
};