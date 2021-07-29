const Discord = require('discord.js');
const Saves = require('../../models/saves');
const UserData = require('../../models/user');
const makeId = require('../../util/makeid');

module.exports = {
    name: "angry",
    aliases: ['pissed', 'angry', 'mad', 'angy'],
    help: "Show your anger with {{p}} angy",
    meta: {
        category: 'Social',
        description: "Show the world how mad you are!",
        syntax: '`angry`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let savess = await Saves.findOne({name: 'angry'}) ? await Saves.findOne({name: 'angry'}) : new Saves({name: 'angry'});
        let saves = savess.saves;
        if (!args.length) {return message.channel.send(new Discord.MessageEmbed()
            .setTitle(`${message.guild ? message.member.displayName : message.author.username} is pissed off!`)
            .setImage(String(Array.from(saves.values())[Math.floor(Math.random() * saves.size)]))
            .setColor('a21a1a')
        );}
        if (['s', 'save', 'n', 'new', 'a', 'add'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.channel.send('oi there cunt, give me a link of an image to add!');}
            let tu = await UserData.findOne({uid: message.author.id});
            if ((!tu || !tu.developer) && !client.misc.savers.includes(message.author.id)) {return message.reply("You must be a Luno Developer in order to add new angry GIFs.");}
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