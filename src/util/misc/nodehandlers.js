const errorhandler = require("../log/errorhandler");
const chalk = require('chalk');

module.exports = client => {
    process.on('unhandledRejection', (e, p) => { //nested promise rejections like to be icky so this should catch them all
        errorhandler(client, e, p);
        return process.exit(1); //i guess this handler does keep the event loop running but i'll adopt a zero-tolerance policy for unhandled rejections
    }); // gotta catch 'em all
    process.on('exit', code => {
        client.log("Back to sleepies...", {color: "#78d9f8", source: client.config.bot.consoleName}, true);
        return console.log(chalk.grey(`Exit code ${chalk.white(code)}`));
    });
};