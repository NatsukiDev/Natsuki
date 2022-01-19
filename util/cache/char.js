const Discord = require('discord.js');
const chalk = require('chalk');

const CharData = require('../../models/char');

module.exports = async (client, spinner) => {
    return new Promise(async resolve => {
        const st = new Date().getTime();

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
                let hasNull = false;
                char.images.forEach((image, index) => {
                    if (image === null) {char.images.splice(index, 1); hasNull = true;}
                });
                if (hasNull) {char.markModified('images'); await char.save();}
                spinner.update({text: `${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${amount}`)} ${chalk.blueBright(`characters into lookup registry.`)} ${chalk.gray(`(${client.misc.cache.chars.size} // NN)`)}`});
                amount++;
            }
        }

        const cacheTime = new Date().getTime() - st;
        spinner.update({text: `${spinner.options.text.slice(0, 19).trim()} ${chalk.gray(`${cacheTime}ms >>`.padStart(8, '0').padStart(7, '0'))} ${spinner.options.text.slice(19).trim()}`});
        spinner.status('non-spinnable');

        resolve(0);
    });
}