const GuildData = require('../../models/guild');
const UserData = require('../../models/user');
const chalk = require('chalk');

module.exports = async (client, spinner, spinner2) => {
    return new Promise(async resolve => {
        client.misc.cache.bl = {
            guild: [],
            user: []
        };
        let amount = 0;
        let amount2 = 0;

        for await (const guild of GuildData.find()) {
            if (guild.blacklisted) {client.misc.cache.bl.guild.push(guild.gid); amount++;}
            spinner.update({text: `${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${amount}`)} ${chalk.blueBright(`guild blacklists.`)}`});
        }

        spinner.update({text: `${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${amount}`)} ${chalk.blueBright(`guild blacklists.`)}`});
        spinner.status('non-spinnable');

        for await (const user of UserData.find()) {
            if (user.blackisted) {client.misc.cache.bl.user.push(user.uid); amount2++;}
            spinner2.update({text: `${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${amount2}`)} ${chalk.blueBright(`user blacklists.`)}`});
        }

        spinner2.update({text: `${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${amount2}`)} ${chalk.blueBright(`user blacklists.`)}`});
        spinner2.status('non-spinnable');

        resolve(0);
    });
};