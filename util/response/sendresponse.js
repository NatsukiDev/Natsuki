const Discord = require('discord.js');

const filterResponse = require('./filterresponse');

module.exports = async(member, channel, mode, client, options) => {
    if (!options) {return;}
    if (options.channel && options.channel.length) {channel = channel.guild.channels.cache.get(options.channel.slice(options.channel.search(/\d/), options.channel.search('>')));}
    try {
        if (options.embed) {
            var responseEmbed = new Discord.MessageEmbed().setTitle(options.title).setDescription(await filterResponse(member, client, options.description));
            if (options.fieldnames && options.fieldnames.length) {let i; for (i=0;i<options.fieldnames.length;i++) {responseEmbed.addField(options.fieldnames[i], await filterResponse(member, client, options.fieldtexts[i]));}}
            if (options.color) {responseEmbed.setColor(options.color);}
            if (options.image && !options.guildimage) {responseEmbed.setImage(options.image);}
            if (options.guildimage) {responseEmbed.setImage(channel.guild.iconURL({size: 2048}));}
            if (options.thumbnail && !options.guildthumb) {responseEmbed.setThumbnail(options.thumbnail);}
            if (options.guildthumb) {responseEmbed.setThumbnail(channel.guild.iconURL({size: 1024}));}
        }
        if (channel.permissionsFor(client.user.id).has("SEND_MESSAGES")) {return channel.send(
            options.message ? await filterResponse(member, client, options.text) : responseEmbed
        );}
    } catch {}
};