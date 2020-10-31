const Discord = require('discord.js');
const Saves = require('../models/saves');
const UserData = require('../models/user');
const makeId = require('../util/makeid');

module.exports = {
    name: "slap",
    help: "Use `{{p}}slap @person` to have me personally deliver your anger to them with a nice s l a p.",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let savess = await Saves.findOne({name: 'slap'}) ? await Saves.findOne({name: 'slap'}) : new Saves({name: 'slap'});
        let saves = savess.saves;
        if (!args.length) {
            return message.channel.send(message.guild ? "Please mention someone to slap!" : "Oi! You don't get to waltz into my DM just to slap me!");}
        if (mention && args[0].match(/^<@(?:!?)(?:\d+)>$/)) {
            if (!message.guild) {return message.reply("Please make sure you're in a server so you can mention someone other than me to slap!");}
            if (!message.guild.members.cache.has(mention.id)) {return message.reply("That user is not in this server!");}
            if (message.author.id === mention.id) {return message.reply("Wait wouldn't slapping yourself be a form of self-harm? ToS is that you??");}
            return message.channel.send(new Discord.MessageEmbed()
                .setAuthor(`${message.guild ? message.member.displayName : message.author.username} slaps ${message.guild.members.cache.get(mention.id).displayName}`, message.author.avatarURL())
                .setImage(String(Array.from(saves.values())[Math.floor(Math.random() * saves.size)]))
                .setColor('d93846')
            );
        }
        if (['s', 'save', 'n', 'new', 'a', 'add'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.channel.send('oi there cunt, give me a link of an image to add!');}
            let tu = await UserData.findOne({uid: message.author.id});
            if ((!tu || !tu.developer) && !client.misc.savers.includes(message.author.id)) {return message.reply("You must be a Natsuki Developer in order to add new slap GIFs.");}
            let e = true;
            let id;
            while (e === true) {id = makeId(6); if (!saves.has(id)) {e = false;}}
            args.shift();
            saves.set(id, args.join(" ").trim());
            savess.saves = saves;
            savess.save();
            return message.channel.send("Save added!");
        }
    }
};