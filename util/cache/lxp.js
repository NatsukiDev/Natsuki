const LXP = require('../../models/localxp');
const chalk = require('chalk');

module.exports = async (client, spinner) => {
    return new Promise(async resolve => {
        client.misc.cache.lxp.enabled = [];
        client.misc.cache.lxp.disabledChannels = new Map();
        client.misc.cache.chests.enabled = new Map();
        let amount = 0;

        for await (const xp of LXP.find()) {
            client.misc.cache.lxp.enabled.push(xp.gid);
            if (xp.noGains && xp.noGains.length) {client.misc.cache.lxp.disabledChannels.set(xp.gid, xp.noGains);}
            spinner.update({text: `${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${amount}`)} ${chalk.blueBright(`guilds with XP enabled.`)}`});
            amount++;
        }

        spinner.status('non-spinnable');
        resolve(0);
    });
};