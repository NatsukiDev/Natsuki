const Discord = require('discord.js');
const Saves = require('../../models/saves');
const UserData = require('../../models/user');
const makeId = require('../../util/makeid');

module.exports = {
    name: "simp",
    help: "Show your love for someone with `{{p}}simp @person`!",
    aliases: ['simp', 'love'],
    meta: {
        category: 'Social',
        description: "Simp for you're senpai",
        syntax: '`simp <@user>`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let savess = await Saves.findOne({name: 'simp'}) ? await Saves.findOne({name: 'simp'}) : new Saves({name: 'simp'});
        let saves = savess.saves;
        if (!args.length) {
            let name = message.guild ? message.member.displayName : message.author.username;
            return message.channel.send(message.guild ? new Discord.MessageEmbed()
                    .setTitle(`${name} is feeling lonely..maybe you should simp for them!`)
                    .setThumbnail(message.author.avatarURL({size: 2048}))
                    .setDescription(`Fall madly in love with someone with \`${prefix}simp @${name}\`!`)
                    .setColor('ffb6c1')
                    .setFooter('Luno', client.user.avatarURL())
                    .setTimestamp()
                : "Only my mommy Crescent can simp for me."
            );}
        if (mention && args[0].match(/^<@(?:!?)(?:\d+)>$/)) {
            if (!message.guild) {return message.reply("Only my mommy Crescent can simp for me.");}
            if (!message.guild.members.cache.has(mention.id)) {return message.reply("They already left you. Get over it.");}
            if (message.author.id === mention.id) {return message.reply("You can't simp for yourself you lonely fuck.");}
            let name = message.guild ? message.member.displayName : message.author.username;
            let uname = message.guild.members.cache.get(mention.id).displayName;
            return message.channel.send(new Discord.MessageEmbed()
                .setAuthor(`${message.guild ? message.member.displayName : message.author.username} falls madly in love with ${message.guild.members.cache.get(mention.id).displayName}..what a simp.`, message.author.avatarURL())
                .setImage(String(Array.from(saves.values())[Math.floor(Math.random() * saves.size)]))
                .setColor('ffb6c1')
            );
        }
        if (['s', 'save', 'n', 'new', 'a', 'add'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.channel.send('oi there cunt, give me a link of an image to add!');}
            let tu = await UserData.findOne({uid: message.author.id});
            if ((!tu || !tu.developer) && !client.developers.includes(message.author.id) && !client.misc.savers.includes(message.author.id)) {return message.reply("You must be a Luno Developer in order to add new simping GIFs.");}
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