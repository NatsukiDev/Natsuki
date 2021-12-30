const Discord = require('discord.js');
const UserData = require('../../models/user');

module.exports = {
    name: "bio",
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Bio")
        .setDescription("Set and view user bios, which are fun ways to express yourself!")
        .addField("Syntax", "`bio <set|view|clear>`"),
    meta: {
        category: 'Social',
        description: "Set your own user bio, which can be seen by everyone!",
        syntax: '`bio <set|view|clear>`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}bio <set|view|clear>\``);}
        let tu = await UserData.findOne({uid: message.author.id}) ? await UserData.findOne({uid: message.author.id}) : new UserData({uid: message.author.id});

        if (['v', 'view', 'check'].includes(args[0].toLowerCase())) {
            let person = args[1] ? args[1].match(/^<@!?\d+>$/) && message.mentions.users.first() ? message.mentions.users.first().id : message.guild && message.guild.members.cache.has(args[1]) ? args[1] : message.author.id : message.author.id;
            let pud = await UserData.findOne({uid: person});
            if (!pud || !pud.bio || !pud.bio.length) {return message.reply(person === message.author.id ? "You don't have a bio set!" : "That user has no bio for me to show you!");}
            return message.channel.send({embeds: [new Discord.MessageEmbed()
                .setTitle(`Bio for ${message.guild ? message.guild.members.cache.get(person).displayName : message.author.username}`)
                .setThumbnail(client.users.cache.get(person).avatarURL({size: 2048}))
                .setDescription(pud.bio)
                .setColor(pud.color && pud.color.length ? pud.color : 'c375f0')
                .setFooter({text: "Natsuki", iconURL: client.user.avatarURL()})
                .setTimestamp()
            ]});
        }
        if (['s', 'set'].includes(args[0].toLowerCase())) {
            args.shift();
            if (!args.length) {return message.reply("Please specify a bio!");}
            let args2 = msg.startsWith(prefix)
                ? message.content.slice(prefix.length).trim().split(/ +/g)
                : msg.startsWith('<@!')
                    ? message.content.slice(4 + client.user.id.length).trim().split(/ +/g)
                    : message.content.slice(3 + client.user.id.length).trim().split(/ +/g);
            args2.shift(); args2.shift();
            let bio = args2.join(" ");
            if (bio.length > 200) {return message.reply("Please keep your bio under 200 characters!");}
            tu.bio = bio;
            tu.save();
            return message.channel.send({embeds: [new Discord.MessageEmbed()
                .setTitle(`Bio Set!`)
                .setThumbnail(message.author.avatarURL({size: 2048}))
                .setDescription(tu.bio)
                .setColor(tu.color && tu.color.length ? tu.color : 'c375f0')
                .setFooter({text: "Natsuki", iconURL: client.user.avatarURL()})
                .setTimestamp()
            ]});
        }
        if (['c', 'clear'].includes(args[0].toLowerCase())) {
            tu.bio = '';
            tu.save();
            return message.reply("Bio cleared!");
        }
    }
};