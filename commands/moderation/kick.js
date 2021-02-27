const Discord = require('discord.js');

const Mod = require('../../models/mod');

const {Tag} = require('../../util/tag');
const {TagFilter} = require('../../util/tagfilter');

module.exports = {
    name: "kick",
    aliases: ['kicc', 'k'],
    meta: {
        category: 'Moderation',
        description: "Kicks a user from the server!",
        syntax: '`kick <@user|userID> [reason]`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Kick")
        .setDescription("Kicks a user from the server!")
        .addField("Syntax", "`kick <@user|userID> [reason]`")
        .addField("Notice", "This command requires you to have `kick` permissions in the server."),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}kick <@user|userID> [reason]\``);}

        if (!message.member.permissions.has("KICK_MEMBERS")) {return message.channel.send("You don't have permissions to do that!");}
        if (!message.guild.me.permissions.has("KICK_MEMBERS")) {return message.channel.send("I don't have permissions to kick members in your server.");}
        let user = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if (!user) {return message.channel.send("You must mention a user to kick, or provide their ID.");}

        if (user.roles.highest.position >= message.member.roles.highest.position) {return message.channel.send("You don't have permissions to kick that member as they are above you in the roles list.");}
        if (user.roles.highest.position >= message.guild.me.roles.highest.position) {return message.channel.send("I can't kick that member as their highest role is above mine! (Or the same as mine, too)");}
        if (!user.kickable) {return message.channel.send("For some reason, I can't kick that user!");}

        let options = new TagFilter([
            new Tag(['r', 'reason'], 'reason', 'append')/*,
            new Tag(['n', 'notes'], 'notes', 'append')*/
        ]).test(args.join(" "));
        let reason;
        if (options.reason && options.reason.length) {reason = options.reason;}
        //if (options.notes && options.notes.length > 250) {return message.channel.send("Hey, listen, let's not write an essay on why you're kicking that member!");}
        else {if (args[1]) {args.shift(); reason = args.join(" ");}}
        if (reason && reason.length > 250) {return message.channel.send("Hey, listen, let's not write an essay on why you're kicking that member!");}

        return user.kick(reason)
            .then(async () => {
                /*let mh = await Mod.findOne({gid: message.guild.id}) || new Mod({gid: message.guild.id});
                let mhcases = mh.cases;

                mhcases.push({
                    members: [user.id],
                    punishment: "Kicked",
                    reason: reason ? reason : "",
                    status: "Closed",
                    moderators: [message.author.id],
                    notes: options.notes,
                    history: [`${new Date().toISOString()} - ${message.author.username} - Created case`, `${new Date().toISOString()} - ${message.author.username} - Kicked ${client.users.cache.get(user.id).username}`],
                    issued: new Date().toUTCString()
                });

                mh.cases = mhcases;
                mh.save();*/

                return message.channel.send(`I got em outta here!${reason ? ` Reason for kicking: ${reason}` : ''}`);
            })
            .catch(() => {return message.channel.send("Something went wrong while trying to kick that user! If the problem persists, contact my devs.");});
    }
};