const Discord = require('discord.js');

const GuildData = require('../../models/guild');
const Monitors = require('../../models/monitor');

const ask = require('../../util/ask');

module.exports = {
    name: "monitor",
    aliases: ['serverstats', 'monit'],
    meta: {
        category: 'Utility',
        description: "Monitors your server's messaging and voice activity",
        syntax: '`monitor <setup|view|disable>`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
    .setTitle("Help -> Server Stats Monitoring")
    .setDescription("Monitor and track your members' activity such as their message counts and voice hours.")
    .addField("Syntax", "`monitor <setup|view|disable>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let tm = await Monitors.findOne({gid: message.guild.id});

        if (!args.length || (args.length && ['v', 'view', 'stats'].includes(args[0].toLowerCase()))) {
            if (!tm) {return message.channel.send("Your server doesn't have monitoring enabled. If it's something you actually think you'll use, feel free to run `setup` on this command to enable it!");}

            if (!Object.keys(tm.messages.members).length && !Object.keys(tm.voice.members).length) {return message.channel.send("Your server doesn't have any monitoring data available yet. Send some messages or hop in a VC, wait a few minutes, and try again.");}

            let ch; let chs; let u; let us;
            let vch; let vchs; let vu; let vus;
            let thm = false; let tv = false;
            
            if (Object.keys(tm.messages.members).length) {
                thm = true;
                ch = Object.keys(tm.messages.channels).sort((a, b) => {return tm.messages.channels[a] - tm.messages.channels[b];}).reverse().slice(0, Object.keys(tm.messages.channels).length >= 5 ? 5 : Object.keys(tm.messages.channels).length);
                chs = ``;
                let i; for (i=0; i<ch.length; i++) {chs += `${i+1}. <#${ch[i]}> -> **${tm.messages.channels[ch[i]]} Messages**\n`;}

                u = Object.keys(tm.messages.members).sort((a, b) => {return tm.messages.members[a] - tm.messages.members[b];}).reverse().slice(0, Object.keys(tm.messages.members).length >= 5 ? 5 : Object.keys(tm.messages.members).length);
                us = ``;
                let i2; for (i2=0; i2<u.length; i2++) {us += `${i2+1}. <@${u[i2]}> -> **${tm.messages.members[u[i2]]} Messages**\n`;}
            }

            if (Object.keys(tm.voice.members).length) {
                tv = true;
                vch = Object.keys(tm.voice.channels).sort((a, b) => {return tm.voice.channels[a] - tm.voice.channels[b];}).reverse().slice(0, Object.keys(tm.voice.channels).length >= 5 ? 5 : Object.keys(tm.voice.channels).length);
                vchs = ``;
                let i; for (i=0; i<vch.length; i++) {vchs += `${i+1}. ${message.guild.channels.cache.get(vch[i]).name} -> **${(tm.voice.channels[vch[i]] / 60).toFixed(1)} Hours**\n`;}

                vu = Object.keys(tm.voice.members).sort((a, b) => {return tm.voice.members[a] - tm.voice.members[b];}).reverse().slice(0, Object.keys(tm.voice.members).length >= 5 ? 5 : Object.keys(tm.voice.members).length);
                vus = ``;
                let i2; for (i2=0; i2<vu.length; i2++) {vus += `${i2+1}. <@${vu[i2]}> -> **${(tm.voice.members[vu[i2]] / 60).toFixed(1)} Hours**\n`;}
            }
            
            let emb = new Discord.MessageEmbed()
            .setTitle(`Activity stats for ${message.guild.name}`)
            .setThumbnail(message.guild.iconURL({size: 1024}))
            .setDescription("*These statistics have an accuracy of about 10 minutes.*")
            .setColor('c375f0')
            .setFooter("Natsuki", client.user.avatarURL())
            .setTimestamp();

            if (thm) {emb.addField("Top Channels", chs).addField("Top Members", us);}
            if (tv) {emb.addField("Top Voice Channels", vchs).addField("Top VC Members", vus);}

            if (thm) {emb.addField("Total Messages", tm.messages.total, true);}
            if (tv) {emb.addField("Total Voice Hours", (tm.voice.total / 60).toFixed(1), true);}
            
            return message.channel.send({embeds: [emb]});
        }

        if (['s', 'setup', 'config', 'configure', 'enable', 'e'].includes(args[0].toLowerCase())) {
            let tg = await GuildData.findOne({gid: message.guild.id});
            if ((tg && tg.staffrole && tg.staffrole.length && !message.member.roles.cache.has(tg.staffrole)) && !message.member.permissions.has("ADMINISTRATOR")) {return message.channel.send("You must be an administrator or have the staff role in your server in order to use this command!");}
            if (tm) {return message.channel.send("You already have an activity monitor set up!");}
            tm = new Monitors({gid: message.guild.id});
            tm.save();
            client.misc.cache.monit[message.guild.id] = {messages: {channels: {}, members: {}, total: 0}, voice: {channels: {}, members: {}, total: 0}, expiry: new Date()};
            client.misc.cache.monitEnabled.push(message.guild.id);
            return message.channel.send("Your server activity monitor has been set up successfully!");
        }

        if (['d', 'disable'].includes(args[0].toLowerCase())) {
            let tg = await GuildData.findOne({gid: message.guild.id});
            if ((tg && tg.staffrole && tg.staffrole.length && !message.member.roles.cache.has(tg.staffrole)) && !message.member.permissions.has("ADMINISTRATOR")) {return message.channel.send("You must be an administrator or have the staff role in your server in order to use this command!");}
            let conf = await ask(message, "Are you sure you want to disable monitors for this server? This will delete all monitoring data.", 60000);
            if (!conf || !['yes', 'y'].includes(conf.toLowerCase().trim())) {return message.channel.send("Okay. I won't delete or disable anything.");}
            delete client.misc.cache.monit[message.guild.id];
            client.misc.cache.monitEnabled.splice(client.misc.cache.monitEnabled.indexOf(message.guild.id), 1);
            await Monitors.deleteOne({gid: message.guild.id});
            return message.channel.send("Monitors for this server have been disabled.");
        }

        else {return message.channel.send(`Syntax: \`${prefix}monitor <setup|view|disable>\``);}
    }
};