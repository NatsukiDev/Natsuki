const Discord = require('discord.js');

module.exports = {
    name: "avatar",
    aliases: ['av', 'a', 'pfp'],
    help: "Use `{{p}}avatar` to get your own profile picture, or mention someone to get theirs!",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let member = !args.length ? message.author : mention ? mention : client.users.cache.has(args[0]) ? client.users.cache.get(args[0]) : message.author;
        let name = !args.length ? message.member ? message.member.displayName : message.author.username : mention ? mention.username : client.users.cache.has(args[0]) ? client.users.cache.get(args[0]).username : message.author.username;
        try {
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle(`${name.endsWith('s') ? `${name}'` : `${name}'s`} Avatar`)
                .setImage(member.avatarURL({size: 2048}))
                .setColor('c375f0')
                .setFooter("Natsuki", client.user.avatarURL())
                .setTimestamp()
            );
        } catch {return message.reply("Hmm, there seems to have been an error while I tried to show you that user's avatar.");}
    }
};