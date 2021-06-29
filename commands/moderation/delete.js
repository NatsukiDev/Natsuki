const Discord = require('discord.js');

module.exports = {
    name: "delete",
    aliases: ['del', 'purge', 'clear'],
    meta: {
        category: 'Moderation',
        description: "Delete messages from a channel, and optionally from a specific user or users.",
        syntax: '`clear <messageCount> [@user] [@user] [etc]`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Mass Message Deletion")
        .setDescription("Delete recently-sent messages from a channel. You can also delete them from a specific user or users, if you wish.")
        .addField("Permissions", "You must have Manage Messages permissions in this server in order to purge messages.")
        .addField("Mentions", "If you mention multiple people, I will delete messages from those users until the total sum of messages reaches the specified message count. In other words, if you mention three people and specify to delete 6 messages, I will the last 6 messages from all of them, not the last 6 messages for each user.")
        .addField("Notice", "Purges with mentions might purge less than the specified count. This only really affects large deletion counts in channels where several other people than just the members mentioned talked. A fix is currently being made.")
        .addField("Syntax", "`clear <messageCount> [@user] [@user] [etc]`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.member.permissions.has("MANAGE_MESSAGES")) {return message.channel.send("You don't have permissions to manage messages in this server!");}
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}clear <messageCount> [@user] [@user] [etc]\``);}
        if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) {return message.channel.send("I don't have permissions to manage messages in this server.");}
        if (!message.channel.permissionsFor(client.user.id).has("MANAGE_MESSAGES")) {return message.channel.send("I don't have permissions to manage messages in this channel.");}
        if (isNaN(Number(args[0])) || Number(args[0]) > 100 || Number(args[0]) < 1) {return message.channel.send("You must specify a positive number less than 100 of messages to delete.");}
        await message.delete();
        let count = Number(args[0]);
        while (true) {
            let messages = await message.channel.messages.fetch({limit: message.mentions.users.size ? 50 : count}, false, true).catch(() => message.channel.send("There was an error trying to grab the messages to delete. Sorry!"));
            let toDelete = [];
            if (toDelete.length >= count) break;
            if (message.mentions.users.size) {Array.from(message.mentions.users.values()).forEach(u => Array.from(messages.values()).forEach(m => {if (m.author.id === u.id && toDelete.length < count) {toDelete.push(m.id);}}));}
            else {toDelete = Array.from(messages.keys());}
            await message.channel.bulkDelete(toDelete, true);
        }
        return true;
    }
};
