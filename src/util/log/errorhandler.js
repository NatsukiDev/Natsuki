const chalk = require('chalk');

module.exports = (client, e, p) => {
    console.log(`#######################################\n\n[${chalk.grey(client.config.bot.consoleName)}] >> ${chalk.hex('#78d9f8')("Well this is awkward.")}\n`);
    console.log(`${chalk.bold.redBright.underline(`There was an error that killed ${client.utils.ps(client.config.bot.name)} process.`)}\n${chalk.redBright("See available stack trace and error information below.")}\n`);
    if (p) {
        client.log("This exception originates from an unhandled, uncaught promise rejection. Ya doofus.", 0, 0, 1);
    }
    console.error(e);
    console.log(`\n#######################################`);
};