const Discord = require('discord.js');
const chalk = require('chalk');

const RPC = require('../../models/rpconfig');

module.exports = async (client, spinner) => {
    return new Promise(async resolve => {
        const st = new Date().getTime();

        client.misc.cache.rp = new Map();
        let amount = 0;

        for await (const rp of RPC.find()) {
            client.misc.cache.rp.set(rp.gid, rp.channels);
            spinner.update({text: `${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${amount}`)} ${chalk.blueBright(`guilds with RP enabled.`)}`});
            amount++;
        }

        const cacheTime = new Date().getTime() - st;
        spinner.update({text: `${spinner.options.text.slice(0, 19).trim()} ${chalk.gray(`${cacheTime}ms >>`.padStart(8, '0').padStart(7, '0'))} ${spinner.options.text.slice(19).trim()}`});
        spinner.status('non-spinnable');

        resolve(0);
    });
}