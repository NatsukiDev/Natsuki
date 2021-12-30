const Discord = require('discord.js');

const AniData = require('../../models/anime');

module.exports = async client => {
    client.misc.cache.anime = new Discord.Collection();
    client.misc.cache.animeID = new Discord.Collection();
    client.misc.cache.animeLove = new Discord.Collection();
    client.misc.cache.animeNum = 0;

    for await (const ani of AniData.find()) {
        if (ani.queued !== true) {
            client.misc.cache.anime.set(ani.japname, ani.id);
            client.misc.cache.anime.set(ani.name, ani.id);
            if (ani.altNames) {ani.altNames.forEach(altName => client.misc.cache.anime.set(altName, ani.id));}
            client.misc.cache.animeID.set(ani.id, ani.name);
            client.misc.cache.animeLove.set(ani.id, ani.watchers);
            client.misc.cache.animeNum++;
        }
    }
}