const Discord = require('discord.js');
const BotDataSchema = require('../models/bot');

module.exports = async (client, guild) => {

    /*
    * Top.gg API
    * GBL API never happening
    * Other APIs idk
    */

    let botData = await BotDataSchema.findOne({finder: 'lel'});
    botData.servers = client.guilds.cache.size;
    botData.save();

    client.guilds.cache.get('762707532417335296').channels.cache.get('766031709866557471').send({embeds: [new Discord.MessageEmbed()
        .setAuthor({name: 'Server Lost', iconURL: client.users.cache.get(guild.ownerId).avatarURL()})
        .setTitle(guild.name)
        .setThumbnail(guild.iconURL({size: 2048}))
        .addField('Owner', `${client.users.cache.get(guild.ownerId).tag}`, true)
        .addField('Members', `${guild.members.cache.size}`, true)
        .addField('Position', `Server #${client.guilds.cache.size + 1}`, true)
        .setColor('ff5d6a')
        .setFooter({text: "Natsuki"})
        .setTimestamp()
    ]});
};