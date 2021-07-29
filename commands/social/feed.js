const Discord = require('discord.js');
const Saves = require('../../models/saves');
const UserData = require('../../models/user');
const makeId = require('../../util/makeid');

module.exports = {
    name: "feed",
    help: "Give someone some food with `{{p}}feed @person`!",
    aliases: ['feed'],
    meta: {
        category: 'Social',
        description: "Cutely feed someone!",
        syntax: '`feed <@user>`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let savess = await Saves.findOne({name: 'feed'}) ? await Saves.findOne({name: 'feed'}) : new Saves({name: 'feed'});
        let saves = savess.saves;
        if (!args.length) {
            let name = message.guild ? message.member.displayName : message.author.username;
            return message.channel.send(message.guild ? new Discord.MessageEmbed()
                    .setTitle(`${name} is hungry, why not feed them?`)
                    .setThumbnail(message.author.avatarURL({size: 2048}))
                    .setDescription(`Bless someone with some food with \`${prefix}feed @${name}\`!`)
                    .setColor('bb0a1e')
                    .setFooter('Luno', client.user.avatarURL())
                    .setTimestamp()
                : "Sorry..I'm kinda full right now."
            );}
        if (mention && args[0].match(/^<@(?:!?)(?:\d+)>$/)) {
            if (!message.guild) {return message.reply("Only Crescent can feed me sorry.");}
            if (!message.guild.members.cache.has(mention.id)) {return message.reply("I guess that person didn't want any food..");}
            if (message.author.id === mention.id) {return message.reply("You can't feed yourself. **Starve.**");}
            let name = message.guild ? message.member.displayName : message.author.username;
            let uname = message.guild.members.cache.get(mention.id).displayName;
            return message.channel.send(new Discord.MessageEmbed()
                .setAuthor(`${message.guild ? message.member.displayName : message.author.username} feeds ${message.guild.members.cache.get(mention.id).displayName} a delicous treat!`, message.author.avatarURL())
                .setImage(String(Array.from(saves.values())[Math.floor(Math.random() * saves.size)]))
                .setColor('fed8b1')
            );
        }
        if (['s', 'save', 'n', 'new', 'a', 'add'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.channel.send('oi there cunt, give me a link of an image to add!');}
            let tu = await UserData.findOne({uid: message.author.id});
            if ((!tu || !tu.developer) && !client.developers.includes(message.author.id) && !client.misc.savers.includes(message.author.id)) {return message.reply("You must be a Luno Developer in order to add new feeding GIFs.");}
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