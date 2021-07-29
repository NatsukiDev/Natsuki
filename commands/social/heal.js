const Discord = require('discord.js');
const Saves = require('../../models/saves');
const UserData = require('../../models/user');
const makeId = require('../../util/makeid');

module.exports = {
    name: "heal",
    help: "Heal somebody in need with `{{p}}heal @person`!",
    aliases: ['heal'],
    meta: {
        category: 'Social',
        description: "Heal an injured comrade!",
        syntax: '`heal <@user>`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let savess = await Saves.findOne({name: 'revive'}) ? await Saves.findOne({name: 'revive'}) : new Saves({name: 'revive'});
        let saves = savess.saves;
        if (!args.length) {
            let name = message.guild ? message.member.displayName : message.author.username;
            return message.channel.send(message.guild ? new Discord.MessageEmbed()
                    .setTitle(`${name} needs healing!`)
                    .setThumbnail(message.author.avatarURL({size: 2048}))
                    .setDescription(`Lend them some help with \`${prefix}heal @${name}\`!`)
                    .setColor('ffc0cb')
                    .setFooter('Luno', client.user.avatarURL())
                    .setTimestamp()
                : "I am immortal, I don't need healing."
            );}
        if (mention && args[0].match(/^<@(?:!?)(?:\d+)>$/)) {
            if (!message.guild) {return message.reply("I am immortal, I don't need healing.");}
            if (!message.guild.members.cache.has(mention.id)) {return message.reply("It's too late..they're already gone to a better place..");}
            if (message.author.id === mention.id) {return message.reply("You can't heal yourself because....I SAID SO");}
            let name = message.guild ? message.member.displayName : message.author.username;
            let uname = message.guild.members.cache.get(mention.id).displayName;
            return message.channel.send(new Discord.MessageEmbed()
                .setAuthor(`${message.guild ? message.member.displayName : message.author.username} heals ${message.guild.members.cache.get(mention.id).displayName}!`, message.author.avatarURL())
                .setImage(String(Array.from(saves.values())[Math.floor(Math.random() * saves.size)]))
                .setColor('ffc0cb')
            );
        }
        if (['s', 'save', 'n', 'new', 'a', 'add'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.channel.send('oi there cunt, give me a link of an image to add!');}
            let tu = await UserData.findOne({uid: message.author.id});
            if ((!tu || !tu.developer) && !client.developers.includes(message.author.id) && !client.misc.savers.includes(message.author.id)) {return message.reply("You must be a Luno Developer in order to add new winking GIFs.");}
            let e = true;
            let id;
            while (e === true) {id = makeId(6); if (!saves.has(id)) {e = false;}}
            args.shift();
            saves.set(id, args.join(" ").trim());
            savess.saves = saves;
            savess.save();
            return message.channel.send("I did it! Are you proud of me senpai?");
        }
    }
};