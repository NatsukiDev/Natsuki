const Discord = require('discord.js');
const {Tag} = require('../../util/tag');
const {TagFilter} = require('../../util/tagfilter');

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
        let member = args.length ? (mention || client.users.cache.get(args[0]) || message.author) : message.author;
        let name = message.guild ? message.guild.members.cache.get(member.id).displayName : member.username;
        let options = new TagFilter([
            new Tag(['small', 's', 'mini', 'm'], 'small', 'toggle'),
            new Tag(['verysmall', 'vsmall', '-vs', 'xs'], 'vsmall', 'toggle')
        ]).test(args.join(" "));
        
        try {
            let avem = new Discord.MessageEmbed()
            .setTitle(`${name.endsWith('s') ? `${name}'` : `${name}'s`} Avatar`)
            .setImage(message.guild ? message.guild.members.cache.get(member.id).displayAvatarURL({size: options.vsmall ? 128 : options.small ? 256 : 2048, dynamic: true, format: "png"}) : member.displayAvatarURL({size: options.vsmall ? 128 : options.small ? 256 : 2048, dynamic: true, format: "png"}))
            .setColor('c375f0')
            .setFooter({text: "Natsuki", iconURL: client.user.displayAvatarURL()})
            if (!options.vsmall) {avem.setTimestamp();}
            return message.channel.send({embeds: [avem]});
        } catch (e) {console.error(e); return message.reply("Hmm, there seems to have been an error while I tried to show you that user's avatar.");}
    }
};