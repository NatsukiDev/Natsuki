const Discord = require('discord.js');

const {Tag} = require("../../util/tag");
const {TagFilter} = require("../../util/tagfilter");

module.exports = {
    name: "softban",
    aliases: ['falseban', 'sfb'],
    meta: {
        category: 'Moderation',
        description: "Bans a user from the server, deletes their messages, then unbans them",
        syntax: '`softban <@user|userID> [reason]`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> SoftBan")
        .setDescription("Bans a user from the server and deletes their messages, then unbans them. This is a great way to kick a member from the server while getting the message delete effect of a ban.")
        .addField("Syntax", "`softban <@user|userID> [reason]`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}softban <@user|userID> [reason]\``);}

        if (!message.member.permissions.has("BAN_MEMBERS")) {return message.channel.send("You don't have permissions to do that!");}
        if (!message.guild.me.permissions.has("BAN_MEMBERS")) {return message.channel.send("I don't have permissions to ban members in your server.");}
        let user = message.guild.members.cache.get(args[0]) || message.mentions.members.first();

        if (!user) {return message.channel.send("You must mention a user to softban, or provide their ID.");}
        if (user.roles.highest.position >= message.member.roles.highest.position) {return message.channel.send("You don't have permissions to softban that member as they are above you in the roles list.");}
        if (user.roles.highest.position >= message.guild.me.roles.highest.position) {return message.channel.send("I can't ban that member as their highest role is above mine! (Or the same as mine, too)");}
        if (!user.bannable) {return message.channel.send("Hmm, it seems like I can't ban that member. This is probably a permissions issue. Or maybe they were already banned? In that case, just use `unban`");}

        let options = new TagFilter([
            new Tag(['r', 'reason'], 'reason', 'append'),
            new Tag(['n', 'notes'], 'notes', 'append'),
            new Tag(['d', 'days', 'm', 'messages'], 'days', 'append')
        ]).test(args.join(" "));
        let reason; let days;
        if (options.reason && options.reason.length) {reason = options.reason;}
        if (options.days && options.days.length) {
            if (isNaN(Number(options.days)) || Number(options.days) < 1 || Number(options.days) > 7 || options.days.includes('.')) {return message.channel.send("The `days` option must be a whole number between 1 and 7.");}
            days = Number(options.days);
        } else {days = 7;}
        if (options.notes && options.notes.length > 250) {return message.channel.send("I mean I get it, they pissed you off, but do you really need to give me that much info on why you're softbanning them? I can't keep track of all that!");}
        else {if (args[1] && !options.days /*&& (!options.notes || !options.notes.length)*/ && (!options.reason || !options.reason.length)) {args.shift(); reason = args.join(" ");}}
        if (reason && reason.length > 250) {return message.channel.send("I mean I get it, they pissed you off, but do you really need to give me that much info on why you're softbanning them? I can't keep track of all that!");}

        return user.ban({reason: reason, days: days})
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

                return message.guild.members.unban(user.id, reason)
                    .then(async () => {return message.channel.send("That user has been softbanned, and can now be re-invited to the server.");})
                    .catch(() => {return message.channel.send("Something went wrong while trying to unban that user! This means that the member has been banned, but not unbanned afterward, so you'll need to unban them using the `unban` command or by doing it manually. If the problem persists, contact my devs.");});
            })
            .catch(() => {return message.channel.send("Something went wrong while trying to ban that user! If the problem persists, contact my devs.");});
    }
};