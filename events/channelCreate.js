const Discord = require('discord.js');

module.exports = (client, channel) => {
    if (channel.guild) {
        let ts = client.guildconfig.logs.has(channel.guild.id) && client.guildconfig.logs.get(channel.guild.id).has('ch') ? client.guildconfig.logs.get(channel.guild.id).get('ch') : null;
        if (ts) {if (channel.guild.channels.cache.has(ts) && channel.guild.channels.cache.get(ts).permissionsFor(client.user.id).has("SEND_MESSAGES")) {
            channel.guild.channels.cache.get(ts).send({embeds: [new Discord.MessageEmbed()
                .setTitle("New Channel")
                .setDescription(`<#${channel.id}> || **#${channel.name}**${channel.parent && channel.parent.name ? `\nCategory: **${channel.parent.name}**` : ''}`)
                .setColor('936b30')
                .setFooter("Natsuki", client.user.avatarURL())
                .setTimestamp()
            ]});
        }}
    }
};