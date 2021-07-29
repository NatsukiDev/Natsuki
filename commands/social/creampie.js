const Discord = require('discord.js');
const Saves = require('../../models/saves');
const UserData = require('../../models/user');
const makeId = require('../../util/makeid');

module.exports = {
    name: "creampie",
    help: "Show the world your creaming skils with `{{p}}creampie @person`!",
    aliases: ['creampie'],
    meta: {
        category: 'Social',
        description: "Give the gift of a creampie!",
        syntax: '`Creampie <@user>`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let savess = await Saves.findOne({name: 'creampie'}) ? await Saves.findOne({name: 'creampie'}) : new Saves({name: 'creampie'});
        let saves = savess.saves;
        if (!args.length) {
            let name = message.guild ? message.member.displayName : message.author.username;
            return message.channel.send(message.guild ? new Discord.MessageEmbed()
                    .setTitle(`${name} needs a creampie!`)
                    .setThumbnail(message.author.avatarURL({size: 2048}))
                    .setDescription(`Help with their..ahem..problem..with \`${prefix}creampie @${name}\`!`)
                    .setColor('fffdd0')
                    .setFooter('Luno', client.user.avatarURL())
                    .setTimestamp()
                : "Do. Not. Touch. Me."
            );}
        if (mention && args[0].match(/^<@(?:!?)(?:\d+)>$/)) {
            if (!message.guild) {return message.reply("No means no.");}
            if (!message.guild.members.cache.has(mention.id)) {return message.reply("I guess they didn't want your creampie..");}
            if (message.author.id === mention.id) {return message.reply("You can't give yourself a creampie..weirdo.");}
            let name = message.guild ? message.member.displayName : message.author.username;
            let uname = message.guild.members.cache.get(mention.id).displayName;
            return message.channel.send(new Discord.MessageEmbed()
                .setAuthor(`${message.guild ? message.member.displayName : message.author.username} gives a massive creampie to ${message.guild.members.cache.get(mention.id).displayName}..Tasty!`, message.author.avatarURL())
                .setImage(String(Array.from(saves.values())[Math.floor(Math.random() * saves.size)]))
                .setColor('fffdd0')
            );
        }
        if (['s', 'save', 'n', 'new', 'a', 'add'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.channel.send('oi there cunt, give me a link of an image to add!');}
            let tu = await UserData.findOne({uid: message.author.id});
            if ((!tu || !tu.developer) && !client.developers.includes(message.author.id) && !client.misc.savers.includes(message.author.id)) {return message.reply("You must be a Luno Developer in order to add new creampie GIFs.");}
            let e = true;
            let id;
            while (e === true) {id = makeId(6); if (!saves.has(id)) {e = false;}}
            args.shift();
            saves.set(id, args.join(" ").trim());
            savess.saves = saves;
            savess.save();
            return message.channel.send("I made a new creampie!...ew");
        }
    }
};