const Discord = require("discord.js");

const GuildData = require('../models/guild');
const LogData = require('../models/log');


const ObjLogTypes = {
    mdelete: ['md', 'messagedelete', 'deletemessage', 'deletemsg', 'msgdelete'],
    medit: ['me', 'messageedit', 'editmessage', 'msgedit', 'editmsg'],
    chnew: ['chn', 'chc', 'newch', 'newchannel', 'chcreate', 'channelcreate'],
    //chedit: ['channeledit'],
    chdelete: ['chd', 'channeldelete', 'deletechannel', 'deletech', 'chdelete'],
    //vcjoin: [],
    //vcleave: [],
    //servervcmute: [],
    //servervcdeafen: [],
    //kick: [],
    //ban: [],
    //mute: [],
    //warn: [],
    //giverole: [],
    //takerole: [],
    //addrole: [],
    //editrole: [],
    //deleterole: [],
    //serverjoin: [],
    //serverleave: [],
    //nickname: [],
    //username: [],
    //avatar: []
}; const LogTypes = new Map();

let keys = Object.keys(ObjLogTypes);
let key; for (key of keys) {let vs = ObjLogTypes[key]; let v; for (v of vs) {LogTypes.set(v, key);}}


module.exports = {
    name: "logs",
    aliases: ["log", "l", "modlog", "modlogs"],
    help: new Discord.MessageEmbed()
    .setTitle("Help -> Server Logs")
    .setDescription("Configure your server's log settings.\n\nLogs will update you on events in your server that have the potential to require moderator intervention, like someone deleting a hateful message before you can see it or a misbehaving moderator kicking/banning a member when they aren't supposed to.")
    .addField("Syntax", "`log <set|list|view|clear> [logType] [#channel]`")
    .addField("Notice", "You must be an admin or have the specified staff role in order to use this command."),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.reply("This command is server-only!");}
        let tg = await GuildData.findOne({gid: message.guild.id});
        if ((!message.member.permissions.has("ADMINISTRATOR")) && (!tg || !tg.staffrole || !tg.staffrole.length || !message.member.roles.cache.has(tg.staffrole))) {return message.reply("You must be an administrator or have the specified staff role in this server in order to edit or view log settings.");}
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}log <set|list|view|clear> [logType] [#channel]\``);}

        if (['s', 'set'].includes(args[0].toLowerCase())) {
            if (args.length < 3) {return message.channel.send(`You must specify the log type and the channel to send the log to. Use \`${prefix}log list\` to see a list of valid log types.`);}
            if (!LogTypes.has(args[1].toLowerCase())) {return message.channel.send("That's not a valid log type. Use \`${prefix}log list\` to see a list of valid log types.");}
            let lt = LogTypes.get(args[1].toLowerCase());
            let ch = args[2].match(/<\#(?:\d+)>/m) && message.guild.channels.cache.has(message.mentions.channels.first().id) ? message.mentions.channels.first() : message.guild.channels.cache.has(args[2]) ? message.guild.channels.cache.get(args[2]) : null;
            if (!ch) {return message.channel.send("I can't find that channel! Make sure that you've mentioned one, or that the ID you provided is correct, and that I can see it.");}
            if (!ch.permissionsFor(client.user.id).has("SEND_MESSAGES")) {return message.reply("I don't have permissions to send messages in that channel. Please give me access and try again.");}
            let tl = await LogData.findOne({gid: message.guild.id}) || new LogData({gid: message.guild.id});
            tl[lt] = ch.id;
            tl.save();
            if (!client.guildconfig.logs.has(message.guild.id)) {client.guildconfig.logs.set(message.guild.id, new Map());}
            client.guildconfig.logs.get(message.guild.id).set(lt, ch.id);
            return message.channel.send("Log settings updated!");
        }

        if (['l', 'list'].includes(args[0].toLowerCase())) {}

        if (['v', 'view'].includes(args[0].toLowerCase())) {}

        if (['c', 'clear'].includes(args[0].toLowerCase())) {}
    }
};