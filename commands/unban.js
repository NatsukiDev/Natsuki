const Discord = require('discord.js');

module.exports = {
    name: "unban",
    aliases: ['ub'],
    meta: {
        category: 'Moderation',
        description: "Unban a user from the server",
        syntax: '`unban <userID|@user>`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Unban")
        .setDescription("Unbans a user from the server, allowing them to join again if they have an invite.")
        .addField("Syntax", "`unban <userID|@user>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}unban <userID|@user>\``);}

        if (!message.member.permissions.has("BAN_MEMBERS")) {return message.channel.send("You don't have permissions to do that!");}
        if (!message.guild.me.permissions.has("BAN_MEMBERS")) {return message.channel.send("I don't have permissions to unban members in your server.");}
        let user = client.users.cache.get(args[0]) || message.mentions.users.first();

        if (!user) {
            user = await client.users.fetch(args[0]);
            if (!user) {return message.channel.send("You must mention a user to unban, or provide their ID.");}
        }

        return message.guild.members.unban(user.id)
            .then(async () => {return message.channel.send("I've unbanned that user!");})
            .catch(() => {return message.channel.send("Something went wrong while trying to unban that user! If the problem persists, contact my devs.");});
    }
};