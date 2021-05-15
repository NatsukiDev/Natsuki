const Discord = require('discord.js');
const GuildSettings = require('../../models/guild');

module.exports = {
    name: "togglestatuses",
    aliases: ['ts', 'tsw', 'togglestatuswarnings', 'togglestatus', 'statustoggle', 'statusestoggle'],
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Server Status-Toggling")
        .setDescription("Disables or enables the warning that appears when you ping someone that has a status set.")
        .addField("Syntax", "`togglestatuses [c]` (add `c` to the end of the message if you want to check if they're enabled or not.)"),
    meta: {
        category: 'Moderation',
        description: "Toggle the warning I give members when they ping someone with a status. Some people find it annoying, but here's my mute button!",
        syntax: '`togglestatuses [c]`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.reply('You must be in a server to use this command.');}
        let tg = await GuildSettings.findOne({gid: message.guild.id});
        if ((!tg || !tg.staffrole || !tg.staffrole.length || !message.member.roles.cache.has(tg.staffrole)) && !message.member.permissions.has("ADMINISTRATOR")) {return message.channel.send("You must be a staff member of the server or have Administrator permissions in order to use this command.");}
        if (args[0] && ['c', 'check', 'v', 'view'].includes(args[0].toLowerCase())) {return message.channel.send(`I ${tg && !tg.nostatus ? 'will' : 'will not'} send a warning when pinging a member with a status.`);}
        if (!tg) {tg = new GuildSettings({gid: message.guild.id});}
        tg.nostatus = !tg.nostatus;
        tg.save();
        return message.channel.send(`I ${!tg.nostatus ? 'will' : 'will not'} send a warning when pinging a member with a status.`);
    }
};