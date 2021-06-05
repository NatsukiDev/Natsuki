const Discord = require("discord.js");

const {Tag} = require('../../util/tag');
const {TagFilter} = require('../../util/tagfilter');

module.exports = {
    name: "coinflip",
    aliases: ['cf', 'flipcoin'],
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Coin Flipping")
        .setDescription("Flip a coin! ...it's really not that hard.\n\nYou can add `-reason` to show what the flip is for, or `-call <heads|tails>`")
        .addField("Syntax", "`coinflip`"),
    meta: {
        category: 'Utility',
        description: "Flips a coin. Not much to see here...",
        syntax: '`coinflip`',
        extra: null
    },
    execute(message, msg, args, cmd, prefix, mention, client) {
        let options = {};
        let calls = null;

        if (args.length) {
            options = new TagFilter([
                new Tag(['r', 'reason'], 'reason', 'append'),
                new Tag(['c', 'call'], 'call', 'append'),
                new Tag(['against', 'a'], 'against', 'append')
            ]).test(args.join(" "));

            if (options.call && options.call.length) {
                if (!['heads', 'head', 'h', 'tails', 'tail', 't'].includes(options.call.toLowerCase().trim())) {return message.channel.send("Your `-call` must be `heads` or `tails`. Try again!");}
                let ce = ['heads', 'head', 'h'].includes(options.call.toLowerCase().trim());
                calls = {'1': ce ? 'Heads' : 'Tails', '2': ce ? 'Tails' : 'Heads'};
            }

            if (options.reason && options.reason.length > 250) {return message.channel.send("Listen pal, your'e flipping a coin... it ain't that serious. You don't need that big of a reason!");}
            if (options.against && options.against.length > 35) {return message.channel.send("The person you're flipping a coin against has a name that's wayyy too long for me to remember. Could you try a nickname instead?");}
        }

        let flip = [1,2][Math.floor(Math.random() * 2)];

        let coinEmbed = new Discord.MessageEmbed()
            .setAuthor("Coin Flip", message.author.avatarURL())
            .setThumbnail(flip === 1 ? "https://cdn.discordapp.com/attachments/563198656241598484/655514893033799700/SmartSelect_20191214-140108_Samsung_Internet.jpg" : "https://cdn.discordapp.com/attachments/563198656241598484/655514881293811753/SmartSelect_20191214-140131_Samsung_Internet.jpg")
            .setDescription(`Flipped by ${message.guild ? message.member.displayName : message.author.username}.\nThe result is **${flip === 1 ? "Heads" : "Tails"}**`)
            .setFooter("Natsuki")
            .setColor("c375f0")
            .setTimestamp();

        if (options.reason && options.reason.length) {coinEmbed.addField("Reason", options.reason, !!(options.against && options.against.length));}
        if (options.against && options.against.length) {coinEmbed.addField("Against", `Coin flipped against ${options.against}`, true);}
        if (calls) {coinEmbed.addField("Call", `${message.guild ? message.member.displayName : message.author.username} called **${calls['1']}** ${options.against && options.against.length ? `(leaving ${options.against} with **${calls['2']}**)` : ''} and **${(calls['1'] === 'Heads' && flip === 1) || (calls['2'] === 'Heads' && flip === 2) ? 'was' : "wasn't"}** correct!`);}

        return message.channel.send(coinEmbed);
    }
};