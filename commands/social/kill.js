const Discord = require('discord.js');
const Saves = require('../../models/saves');
const UserData = require('../../models/user');
const makeId = require('../../util/makeid');

module.exports = {
    name: "kill",
    help: "Kill the person you despise with `{{p}}kill @person`",
    aliases: ['kill', 'murder'],
    meta: {
        category: 'Social',
        description: "Kill someone..",
        syntax: '`kill <@user>`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let savess = await Saves.findOne({name: 'kill'}) ? await Saves.findOne({name: 'kill'}) : new Saves({name: 'kill'});
        let saves = savess.saves;
        if (!args.length) {
            let name = message.guild ? message.member.displayName : message.author.username;
            return message.channel.send(message.guild ? new Discord.MessageEmbed()
                    .setTitle(`${name} is feeling homicidal..watch out!`)
                    .setThumbnail(message.author.avatarURL({size: 2048}))
                    .setDescription(`Brutally murder someone with \`${prefix}kill @${name}\`!`)
                    .setColor('bb0a1e')
                    .setFooter('Luno', client.user.avatarURL())
                    .setTimestamp()
                : "You can't kill me..don't even try."
            );}
        if (mention && args[0].match(/^<@(?:!?)(?:\d+)>$/)) {
            if (!message.guild) {return message.reply("You can't kill me..don't even try.");}
            if (!message.guild.members.cache.has(mention.id)) {return message.reply("The person must have ran from their inevitable death..");}
            if (message.author.id === mention.id) {return message.reply("Uhhh no. Please don't try to hurt yourself..");}
            let name = message.guild ? message.member.displayName : message.author.username;
            let uname = message.guild.members.cache.get(mention.id).displayName;
            return message.channel.send(new Discord.MessageEmbed()
                .setAuthor(`${message.guild ? message.member.displayName : message.author.username} brutally murders ${message.guild.members.cache.get(mention.id).displayName}..Rest in Peace.`, message.author.avatarURL())
                .setImage(String(Array.from(saves.values())[Math.floor(Math.random() * saves.size)]))
                .setColor('bb0a1e')
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