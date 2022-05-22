const Discord = require('discord.js');

const {Tag} = require('../../util/tag');
const {TagFilter} = require('../../util/tagfilter');
const {Pagination} = require('../../util/pagination');

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
        let fail = false;
        let member = args.length && !fail ? (mention || client.users.cache.get(args[0]) || message.author) : message.author;
        await client.users.fetch(member.id, {force: true}).catch(() => fail = true);
        if (message.guild) {message.guild.members.fetch(member.id, {force: true});}
        let name = message.guild ? message.guild.members.cache.get(member.id).displayName : member.username;
        let options = new TagFilter([
            new Tag(['small', 's', 'mini', 'm'], 'small', 'toggle'),
            new Tag(['verysmall', 'vsmall', '-vs', 'xs'], 'vsmall', 'toggle'),
            new Tag(['g', 'global', 'user', 'u'], 'global', 'toggle'),
            new Tag(['b', 'both'], 'both', 'toggle')
        ]).test(args.join(" "));
        
        try {
            if (options.both && message.guild ? member.displayAvatarURL({size: 2048, dynamic: true, format: 'png'}) !== message.guild.members.cache.get(member.id).displayAvatarURL({size: 2048, dynamic: true, format: 'png'}) : false) {
                const pag = new Pagination(message.channel, [message.guild.members, client.users]
                    .map(source => source.cache.get(member.id).displayAvatarURL({size: options.vsmall ? 128 : options.small ? 256 : 2048, dynamic: true, format: "png"}))
                    .map((avatar, index) => new Discord.MessageEmbed()
                    .setTitle(`${name.endsWith('s') ? `${name}'` : `${name}'s`} ${['Server', 'Global'][index]} Avatar`)
                    .setImage(avatar)
                    .setColor('c375f0')
                    ), message, client
                );
                return await pag.start({user: message.author.id, time: 60000});
            } else {
                let avem = new Discord.MessageEmbed()
                .setTitle(`${name.endsWith('s') ? `${name}'` : `${name}'s`} Avatar`)
                .setImage(message.guild ? (options.global ? client.users : message.guild.members).cache.get(member.id).displayAvatarURL({size: options.vsmall ? 128 : options.small ? 256 : 2048, dynamic: true, format: "png"}) : member.displayAvatarURL({size: options.vsmall ? 128 : options.small ? 256 : 2048, dynamic: true, format: "png"}))
                .setColor('c375f0')
                .setFooter({text: "Natsuki", iconURL: client.user.displayAvatarURL()})
                if (!options.vsmall) {avem.setTimestamp();}
                return message.channel.send({embeds: [avem]});
            }
        } catch (e) {console.error(e); return message.reply("Hmm, there seems to have been an error while I tried to show you that user's avatar.");}
    }
};