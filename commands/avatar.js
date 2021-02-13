const Discord = require('discord.js');
const {Tag} = require('../util/tag');
const {TagFilter} = require('../util/tagfilter');

module.exports = {
    name: "avatar",
    aliases: ['av', 'a', 'pfp'],
    help: "Use `{{p}}avatar` to get your own profile picture, or mention someone to get theirs!",
    meta: {
        category: 'Misc',
        description: "Flare your avatar or peek at others'",
        syntax: '`avatar [@mention]`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let member = !args.length ? message.author : mention ? mention : client.users.cache.has(args[0]) ? client.users.cache.get(args[0]) : message.author;
        let name = !args.length ? message.member ? message.member.displayName : message.author.username : mention ? mention.username : client.users.cache.has(args[0]) ? client.users.cache.get(args[0]).username : message.author.username;
        let options = new TagFilter([
            new Tag(['small', 's', 'mini', 'm'], 'small', 'toggle'),
            new Tag(['verysmall', 'vsmall', '-vs', 'xs'], 'vsmall', 'toggle')
        ]).test(args.join(" "));
        try {
            let avem = new Discord.MessageEmbed()
            .setTitle(`${name.endsWith('s') ? `${name}'` : `${name}'s`} Avatar`)
            .setImage(member.avatarURL({size: options.vsmall ? 128 : options.small ? 256 : 2048, dynamic: true}))
            .setColor('c375f0')
            .setFooter("Natsuki", client.user.avatarURL())
            if (!options.vsmall) {avem.setTimestamp();}
            return message.channel.send(avem);
        } catch {return message.reply("Hmm, there seems to have been an error while I tried to show you that user's avatar.");}
    }
};