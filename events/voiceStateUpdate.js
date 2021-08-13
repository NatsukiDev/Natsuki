const Discord = require("discord.js");

const Monitor = require('../models/monitor');

module.exports = async (client, oldState, voice) => {
    let ts = client.guildconfig.logs.has(voice.guild.id) && client.guildconfig.logs.get(voice.guild.id).has('vc') ? client.guildconfig.logs.get(voice.guild.id).get('vc') : null;
    if (ts) {if (voice.guild.channels.cache.has(ts) && voice.guild.channels.cache.get(ts).permissionsFor(client.user.id).has("SEND_MESSAGES")) {
        if (oldState.channelId && voice.channelId) {
            voice.guild.channels.cache.get(ts).send({embeds: [new Discord.MessageEmbed()
                .setTitle(`Member Switched VCs`)
                .setThumbnail(client.users.cache.get(oldState.member.id).avatarURL({size: 2048, dynamic: true}))
                .setDescription(`Old Channel: **${oldState.channel.name}**\nNew Channel: **${voice.channel.name}**`)
                .setColor('e86b8f').setFooter("Natsuki", client.user.avatarURL()).setTimestamp()
            ]}).catch(() => {});
        } else {
            voice.guild.channels.cache.get(ts).send({embeds: [new Discord.MessageEmbed()
                .setTitle(`Member ${voice.channelId ? 'Joined' : 'Left'} VC`)
                .setThumbnail(client.users.cache.get(oldState.member.id).avatarURL({size: 2048, dynamic: true}))
                .setDescription(`Channel: **${voice.channelId ? voice.channel.name : oldState.channel.name}**`)
                .setColor('e86b8f').setFooter("Natsuki", client.user.avatarURL()).setTimestamp()
            ]}).catch(() => {});
        }
    }}

    if (client.users.cache.get(voice.member.id).bot) {return;}
    if (voice.guild && client.misc.cache.monitEnabled.includes(voice.guild.id)) {
        if (voice.channelId) {
            client.misc.cache.VCG[voice.member.id] = voice.guild.id;
            if (!client.misc.cache.inVC.includes(voice.member.id)) {client.misc.cache.inVC.push(voice.member.id);}
            if (!client.misc.cache.activeVC.includes(voice.channelId)) {client.misc.cache.activeVC.push(voice.channelId);}
        } else {
            if (!client.misc.cache.inVC.includes(voice.member.id)) {return;}
            client.misc.cache.inVC.splice(client.misc.cache.inVC.indexOf(voice.member.id), 1);
            if (oldState.channel && !oldState.channel.members.size && client.misc.cache.activeVC.includes(oldState.channelId)) {client.misc.cache.activeVC.splice(client.misc.cache.activeVC.indexOf(oldState.channelId), 1);}
            if (Object.keys(client.misc.cache.VCG).includes(voice.member.id)) {delete client.misc.cache.VCG[voice.member.id];}
        }
    }
};