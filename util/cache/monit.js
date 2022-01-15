const Monitor = require('../../models/monitor');
const chalk = require('chalk');

module.exports = async (client, spinner) => {
    return new Promise(async resolve => {
        const st = new Date().getTime();

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

        const cacheTime = new Date().getTime() - st;
        spinner.update({text: `${spinner.options.text.slice(0, 19).trim()} ${chalk.gray(`${cacheTime}ms >>`.padStart(8, '0').padStart(7, '0'))} ${spinner.options.text.slice(19).trim()}`});
        spinner.status('non-spinnable');

        resolve(0);
    });
}