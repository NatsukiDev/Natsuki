const Chests = require('../../models/chests');
const chalk = require('chalk');

module.exports = async (client, spinner) => {
    return new Promise(async resolve => {
        client.misc.cache.chests.enabled = [];
        let amount = 0;

        for await (const chest of Chests.find()) {
            client.misc.cache.chests.enabled.push(chest.gid);
            spinner.update({text: `${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${amount}`)} ${chalk.blueBright(`guilds that spawn chests.`)}`});
            amount++;
        }

        spinner.status('non-spinnable');
        resolve(0);
    });
};