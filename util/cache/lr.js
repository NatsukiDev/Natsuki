const LR = require('../../models/levelroles');
const chalk = require('chalk');

module.exports = async (client, spinner) => {
    return new Promise(async resolve => {
        client.misc.cache.lxp.hasLevelRoles = [];
        let amount = 0;

        for await (const lr of LR.find()) {
            client.misc.cache.lxp.hasLevelRoles.push(lr.gid);
            spinner.update({text: `${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${amount}`)} ${chalk.blueBright(`guilds with Level Roles enabled.`)}`});
            amount++;
        }

        spinner.status('non-spinnable');

        resolve(0);
    });
};