const Monitor = require('../../models/monitor');
const chalk = require('chalk');

module.exports = async (client, spinner) => {
    return new Promise(async resolve => {
        client.misc.cache.monit = {};
        client.misc.cache.monitEnabled = [];
        let amount = 0;

        for await (const tm of Monitor.find()) {
            client.misc.cache.monit[tm.gid] = {
                messages: tm.messages,
                voice: tm.voice,
                expiry: new Date()
            };
            client.misc.cache.monitEnabled.push(tm.gid);
            spinner.update({text: `${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${amount}`)} ${chalk.blueBright(`guilds with Monitors enabled.`)}`});
            amount++;
        }

        spinner.status('non-spinnable');

        resolve(0);
    });
}