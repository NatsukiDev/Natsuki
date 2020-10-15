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
    botData.servers_all += 1;
    botData.save();

    client.guilds.cache.get('762707532417335296').channels.cache.get('766031709866557471').send(new Discord.MessageEmbed()
        .setAuthor('New Guild Added', guild.owner.avatarURL())
        .setTitle(guild.name)
        .setThumbnail(guild.iconURL({size: 2048}))
        .addField('Owner', guild.owner.tag, true)
        .addField('Members', guild.members.cache.size)
        .addField('Position', `Server #${client.guilds.cache.size}`)
        .setColor('55ff7f')
        .setFooter('Natsuki')
        .setTimestamp()
    );
};