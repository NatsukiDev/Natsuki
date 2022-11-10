const chalk = require('chalk');

module.exports = e => {
    console.log(`#######################################\n\n${chalk.grey('[NATS]')} >> ${chalk.hex('#78d9f8')("Well this is awkward.")}\n`);
    console.log(`${chalk.bold.redBright.underline("There was an error that killed Natsuki's process.")}\n${chalk.redBright("See available stack trace and error information below.")}\n`);
    console.error(e);
    console.log(`\n#######################################\n\n${chalk.grey('[NATS]')} >> ${chalk.hex('#78d9f8')("Back to sleepies...")}`);
};