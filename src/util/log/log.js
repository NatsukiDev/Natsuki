const chalk = require('chalk');

const getLevel = require('./getlevel');

const config = require('../../json/config.json');

let defaultOptions = {
    color: "white",
    source: "USER",
    sourceColor: "gray",
    level: typeof config.log.defaultLevel === 'number' ? config.log.defaultLevel : 1,
    suffix: " >> "
};

module.exports = (client) => {
    return (message = "Test Log", options = {}, newLine = false, spacer = false) => {
        let opt = {};
        opt.color = options.color || defaultOptions.color;
        opt.level = ['string', 'number'].includes(typeof options.level) ? options.level : defaultOptions.level;
        opt.suffix = typeof options.suffix === 'string' ? options.suffix : defaultOptions.suffix;
        opt.source = options.source || defaultOptions.source;
        opt.sourceColor = options.sourceColor || defaultOptions.sourceColor;
        try {if (client.config.logLevel < opt.level) {return;}}
        catch {
            client.config.logLevel = getLevel(client.config.logLevel);
            if (client.config.logLevel < opt.level) {return;}
        }
        console.log(`${spacer ? '\n' : ''}${(opt.sourceColor.startsWith('#') ? chalk.hex(opt.sourceColor) : chalk[opt.sourceColor])(`[${opt.source.toUpperCase()}]`)}${opt.suffix}${options.nc || options.noColor ? message : (opt.color.startsWith('#') ? chalk.hex(opt.color) : chalk[opt.color])(message)}${newLine ? '\n' : ''}`);
    };
};