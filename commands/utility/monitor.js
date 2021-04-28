const Discord = require('discord.js');

const GuildData = require('../../models/guild');
const Monitors = require('../../models/monitor');

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

        }

        if (['s', 'setup', 'config', 'configure'].includes(args[0].toLowerCase())) {
            let tg = await GuildData.findOne({gid: message.guild.id});
            if ((tg && tg.staffrole && tg.staffrole.length && !message.member.roles.cache.has(tg.staffrole)) && !message.member.permissions.has("ADMINISTRATOR")) {return message.channel.send("You must be an administrator or have the staff role in your server in order to use this command!");}
            if (tm) {return message.channel.send("You already have an activity monitor set up!");}
            tm = new Monitors({gid: message.guild.id});
            tm.save();
            client.misc.cache.monit[message.guild.id] = {messages: {channels: {}, members: {}, total: 0}, voice: {channels: {}, members: {}, total: 0}, expiry: new Date()};
            client.misc.cache.monitEnabled.push(message.guild.id);
            return message.channel.send("Your server activity monitor has been set up successfully!");
        }

        else {return message.channel.send(`Syntax: \`${prefix}monitor <setup|view|disable>\``);}
    }
};