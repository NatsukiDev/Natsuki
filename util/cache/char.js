const Discord = require('discord.js');
const chalk = require('chalk');

const CharData = require('../../models/char');

module.exports = async (client, spinner) => {
    return new Promise(async resolve => {
        client.misc.cache.chars = new Discord.Collection();
        client.misc.cache.charsID = new Discord.Collection();
        client.misc.cache.charsLove = new Discord.Collection();
        client.misc.cache.charsNum = 0;
        let amount = 0;

        for await (const char of CharData.find()) {
            if (char.queued !== true) {
                client.misc.cache.chars.set(char.name, char.id);
                char.nicknames.forEach(nn => client.misc.cache.chars.set(nn, char.id));
                client.misc.cache.charsID.set(char.id, char.name);
                client.misc.cache.charsNum++;
                client.misc.cache.charsLove.set(char.id, char.loved);
                spinner.update({text: `${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${amount}`)} ${chalk.blueBright(`characters into lookup registry.`)} ${chalk.gray(`(${client.misc.cache.chars.size} // NN)`)}`});
                amount++;
            }
        }

        spinner.status('non-spinnable');

        resolve(0);
    });
}