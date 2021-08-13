const Discord = require('discord.js');
const Saves = require('../../models/saves');
const UserData = require('../../models/user');
const makeId = require('../../util/makeid');

module.exports = {
    name: "smile",
    aliases: ['grin'],
    help: "Spread the happiness with {{p}}smile!",
    meta: {
        category: 'Social',
        description: "Show everyone just how happy you are!",
        syntax: '`smile`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let savess = await Saves.findOne({name: 'smile'}) ? await Saves.findOne({name: 'smile'}) : new Saves({name: 'smile'});
        let saves = savess.saves;
        if (!args.length) {return message.channel.send({embeds: [new Discord.MessageEmbed()
            .setTitle(`${message.guild ? message.member.displayName : message.author.username} has a big smile on their face!`)
            .setImage(String(Array.from(saves.values())[Math.floor(Math.random() * saves.size)]))
            .setColor('00cd00')
        ]});}
        if (['s', 'save', 'n', 'new', 'a', 'add'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.channel.send('oi there cunt, give me a link of an image to add!');}
            let tu = await UserData.findOne({uid: message.author.id});
            if ((!tu || !tu.developer) && !client.misc.savers.includes(message.author.id)) {return message.reply("You must be a Luno Developer in order to add new smile GIFs.");}
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