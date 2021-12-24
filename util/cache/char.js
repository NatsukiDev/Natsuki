const Discord = require('discord.js');

const CharData = require('../../models/char');

module.exports = async client => {
    client.misc.cache.chars = new Discord.Collection();
    client.misc.cache.charsID = new Discord.Collection();
    client.misc.cache.charsNum = 0;

    for await (const char of CharData.find()) {
        if (char.queued !== true) {
            client.misc.cache.chars.set(char.name, char.id);
            char.nicknames.forEach(nn => client.misc.cache.chars.set(nn, char.id));
            client.misc.cache.charsID.set(char.id, char.name);
            client.misc.cache.charsNum++;
        }
    }
}