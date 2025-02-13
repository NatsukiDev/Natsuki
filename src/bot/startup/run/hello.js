const moment = require("moment");
const chalk = require('chalk');
const os = require('os');
const gs = require('gradient-string');

module.exports = client => {
    client.log(`Logged in as ${gs.instagram(client.user.username)}. ${chalk.greenBright(`[${chalk.grey(client.user.id)}]`)}`);
    client.log(`Time: ${chalk.blueBright(moment().format('MMMM d, YYYY - HH:MM:SS'))}`);
    client.log(`This ${chalk.blue('heap')} has ${chalk.blueBright((process.memoryUsage().heapTotal / (1024 ** 2)).toFixed(2))}MB allocated; The ${chalk.blue('machine')} has ${chalk.blueBright((os.totalmem() / (1024 ** 3)).toFixed(2))}GB (${chalk.blueBright((os.freemem() / (1024 ** 3)).toFixed(2))}GB free)`);
    client.log(`Running on ${chalk.blueBright(client.guilds.cache.size)} ${chalk.blue("servers")} and interacting with about ${chalk.blueBright(client.users.cache.size)} ${chalk.blue("users")}.`);
    client.log(`Listening for prefix ${chalk.greenBright(client.basePrefix)} || ${chalk.greenBright(`${client.basePrefix}help`)} to get started!`);
};