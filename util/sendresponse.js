const Discord = require('discord.js');

module.exports = async(channel, mode, client, options) => {
    if (!options) {return;}
    if (options.channel && options.channel.length) {channel = channel.guild.channels.cache.get(options.channel.slice(options.channel.search(/\d/), options.channel.search('>')));}
    try {
        if (mode === "welcome") {} else if (mode === "leave") {} else {
            if (options.embed) {
                var responseEmbed = new Discord.MessageEmbed().setTitle(options.title).setDescription(options.description);
                if (options.fieldnames && options.fieldnames.length) {let i; for (i=0;i<options.fieldnames.length;i++) {responseEmbed.addField(options.fieldnames[i], options.fieldtexts[i]);}}
                if (options.color) {responseEmbed.setColor(options.color);}
                if (options.image) {responseEmbed.setImage(options.image);}
                if (options.thumbnail) {responseEmbed.setThumbnail(options.thumbnail);}
            }
            if (channel.permissionsFor(client.user.id).has("SEND_MESSAGES")) {return channel.send(
                options.message ? options.text : responseEmbed
            );}
        }
    } catch {}
};