const Discord = require('discord.js');
const chalk = require('chalk');

const AniData = require('../../models/anime');

module.exports = async (client, spinner) => {
    return new Promise(async resolve => {
        const st = new Date().getTime();

        client.misc.cache.anime = new Discord.Collection();
        client.misc.cache.animeID = new Discord.Collection();
        client.misc.cache.animeLove = new Discord.Collection();
        client.misc.cache.animeNum = 0;
        let amount = 0;

        for await (const ani of AniData.find()) {
            if (ani.queued !== true) {
                client.misc.cache.anime.set(ani.japname, ani.id);
                client.misc.cache.anime.set(ani.name, ani.id);
                if (ani.altNames) {ani.altNames.forEach(altName => client.misc.cache.anime.set(altName, ani.id));}
                client.misc.cache.animeID.set(ani.id, ani.name);
                client.misc.cache.animeLove.set(ani.id, ani.watchers);
                client.misc.cache.animeNum++;
                spinner.update({text: `${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${amount}`)} ${chalk.blueBright(`animes into lookup registry.`)}`});
                amount++;
            }
        }

        const cacheTime = new Date().getTime() - st;
        spinner.update({text: `${spinner.options.text.slice(0, 19).trim()} ${chalk.gray(`${cacheTime}ms >>`.padStart(8, '0').padStart(7, '0'))} ${spinner.options.text.slice(19).trim()}`});
        spinner.status('non-spinnable');

        resolve(0);
    });
}