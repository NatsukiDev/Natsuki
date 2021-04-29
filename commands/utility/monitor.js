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
            
            let ch = Object.keys(tm.messages.channels).sort((a, b) => {tm.messages.channels[a] - tm.messages.channels[b];}).slice(0, Object.keys(tm.messages.channels).length >= 5 ? 5 : Object.keys(tm.messages.channels).length);
            let chs = ``;
            let i; for (i=0; i<ch.length; i++) {chs += `${i+1}. <#${ch[i]}> -> **${tm.messages.channels[ch[i]]} Messages**\n`;}

            let u = Object.keys(tm.messages.members).sort((a, b) => {tm.messages.members[a] - tm.messages.members[b];}).slice(0, Object.keys(tm.messages.members).length >= 5 ? 5 : Object.keys(tm.messages.members).length);
            let us = ``;
            let i2; for (i2=0; i2<u.length; i2++) {us += `${i2+1}. <@${u[i2]}> -> **${tm.messages.members[u[i2]]} Messages**\n`;}

            return message.channel.send(new Discord.MessageEmbed()
                .setTitle(`Activity stats for ${message.guild.name}`)
                .setThumbnail(message.guild.iconURL({size: 1024}))
                .setDescription("*These statistics have an accuracy of about 10 minutes.*")
                .addField("Top Channels", chs)
                .addField("Top Members", us)
                .addField("Total Messages in Server", tm.messages.total)
                .setColor('c375f0')
                .setFooter("Natsuki", client.user.avatarURL())
                .setTimestamp()
            );
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