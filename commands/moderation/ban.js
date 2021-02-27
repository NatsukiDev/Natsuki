const Discord = require('discord.js');

const Mod = require('../../models/mod');

const {Tag} = require('../../util/tag');
const {TagFilter} = require('../../util/tagfilter');

module.exports = {
    name: "ban",
    aliases: [],
    meta: {
        category: 'Moderation',
        description: "Bans a member from the server!",
        syntax: '`ban <@member|memberID> [reason]`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
    .setTitle("Help -> Member Banning")
    .setDescription("This command bans a member from the server permanently, making it so they cannot rejoin. *Yikes*")
    .addField("Syntax", "`ban <@member|memberID> [reason]`")
    .addField("Permissions", "You'll want to have the `ban members` permission in your server or be an administrator to do this!"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}ban <@member|memberID> [reason]\``);}

        if (!message.member.permissions.has("BAN_MEMBERS")) {return message.channel.send("You don't have permissions to do that!");}
        if (!message.guild.me.permissions.has("BAN_MEMBERS")) {return message.channel.send("I don't have permissions to ban members in your server.");}
        let user = message.guild.members.cache.get(args[0]) || message.mentions.members.first();

        if (!user) {return message.channel.send("You must mention a user to ban, or provide their ID.");}
        if (user.roles.highest.position >= message.member.roles.highest.position) {return message.channel.send("You don't have permissions to ban that member as they are above you in the roles list.");}
        if (user.roles.highest.position >= message.guild.me.roles.highest.position) {return message.channel.send("I can't ban that member as their highest role is above mine! (Or the same as mine, too)");}
        if (!user.bannable) {return message.channel.send("Hmm, it seems like I can't ban that member. This is probably a permissions issue. Or maybe they were already banned?");}

        let options = new TagFilter([
            new Tag(['r', 'reason'], 'reason', 'append'),
            new Tag(['n', 'notes'], 'notes', 'append'),
            new Tag(['d', 'days', 'm', 'messages'], 'days', 'append')
        ]).test(args.join(" "));
        let reason; let days;
        if (options.reason && options.reason.length) {reason = options.reason;}
        if (options.days && options.days.length) {
            if (isNaN(Number(options.days)) || Number(options.days) < 0 || Number(options.days) > 7 || options.days.includes('.')) {return message.channel.send("The `days` option must be a whole number between 0 and 7.");}
            days = Number(options.days);
        }
        if (options.notes && options.notes.length > 250) {return message.channel.send("I mean I get it, they pissed you off, but do you really need to give me that much info on why you're banning them? I can't keep track of all that!");}
        else {if (args[1] && !options.days /*&& (!options.notes || !options.notes.length)*/ && (!options.reason || !options.reason.length)) {args.shift(); reason = args.join(" ");}}
        if (reason && reason.length > 250) {return message.channel.send("I mean I get it, they pissed you off, but do you really need to give me that much info on why you're banning them? I can't keep track of all that!");}

        return user.ban({reason: reason, days: typeof days === "number" ? days : 0})
            .then(async () => {
                /*let mh = await Mod.findOne({gid: message.guild.id}) || new Mod({gid: message.guild.id});
                let mhcases = mh.cases;

                mhcases.push({
                    members: [user.id],
                    punishment: "Banned",
                    reason: reason ? reason : "",
                    status: "Closed",
                    moderators: [message.author.id],
                    notes: options.notes,
                    history: [`${new Date().toISOString()} - ${message.author.username} - Created case`, `${new Date().toISOString()} - ${message.author.username} - Banned ${client.users.cache.get(user.id).username}`],
                    issued: new Date().toUTCString()
                });

                mh.cases = mhcases;
                mh.save();*/

                return message.channel.send(`The hammer of justice has spoken!${reason ? ` Reason for banning: ${reason}` : ''}`);
            })
            .catch(() => {return message.channel.send("Something went wrong while trying to ban that user! If the problem persists, contact my devs.");});
    }
};