const Discord = require('discord.js');
const Saves = require('../../models/saves');
const UserData = require('../../models/user');
const makeId = require('../../util/makeid');

module.exports = {
    name: "handhold",
    help: "Hold someone's hand with `{{p}}handhold @person`",
    aliases: ['hh', 'holdhands', 'holdhandswith'],
    meta: {
        category: 'Social',
        description: "Hold someone's hand to let them know you're there for them",
        syntax: '`handhold <@user>`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let savess = await Saves.findOne({name: 'handhold'}) ? await Saves.findOne({name: 'handhold'}) : new Saves({name: 'handhold'});
        let saves = savess.saves;
        if (!args.length) {
            let name = message.guild ? message.member.displayName : message.author.username;
            return message.channel.send(message.guild ? new Discord.MessageEmbed()
                    .setTitle(`${name} is feeling a little lonely. If only someone would hold their hand...`)
                    .setThumbnail(message.author.avatarURL({size: 2048}))
                    .setDescription(`Let them know you love them with \`${prefix}handhold @${name}\`!`)
                    .setColor('328ba8')
                    .setFooter('Luno', client.user.avatarURL())
                    .setTimestamp()
                : "Yikes... I'm kinda germaphobic you know. Maybe try asking in a server?"
            );}
        if (mention && args[0].match(/^<@(?:!?)(?:\d+)>$/)) {
            if (!message.guild) {return message.reply("Please make sure you're in a server so you can mention someone other than me to hold hands with!");}
            if (!message.guild.members.cache.has(mention.id)) {return message.reply("That user is not in this server!");}
            if (message.author.id === mention.id) {return message.reply("Holding your own hand... I mean it's possible? Same effect, though? Eh, not really.");}
            let name = message.guild ? message.member.displayName : message.author.username;
            let uname = message.guild.members.cache.get(mention.id).displayName;
            return message.channel.send(new Discord.MessageEmbed()
                .setAuthor(`${message.guild ? message.member.displayName : message.author.username} holds ${uname.endsWith('s') ? `${uname}'` : `${uname}'s`} hand!`, message.author.avatarURL())
                .setImage(String(Array.from(saves.values())[Math.floor(Math.random() * saves.size)]))
                .setColor('d428a0')
            );
        }
        if (['s', 'save', 'n', 'new', 'a', 'add'].includes(args[0].toLowerCase())) {
            if (!args[1]) {return message.channel.send('oi there cunt, give me a link of an image to add!');}
            let tu = await UserData.findOne({uid: message.author.id});
            if ((!tu || !tu.developer) && !client.developers.includes(message.author.id) && !client.misc.savers.includes(message.author.id)) {return message.reply("You must be a Luno Developer in order to add new kiss GIFs.");}
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