const Discord = require('discord.js');

const CharData = require('../../models/char');

module.exports = async client => {
    client.misc.cache.chars = new Discord.Collection();

    for await (const char of CharData.find()) {
        client.misc.cache.chars.set(char.name, char.id);
    }
}