const Discord = require('discord.js');

const UserData = require('../../models/user');

module.exports = {
    name: "marry",
    meta: {
        category: 'Fun',
        description: "Marry someone to get some extra fun benefits!",
        syntax: '`marry <@user|status|decline>`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Marriage")
        .setDescription("Marry another Natsuki user. They'll have to accept your marriage request for you to be able to marry them, though.")
        .addField("Syntax", "`marry <@user|status|decline>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}marry <@user|status|decline>\``);}
        if (['s', 'status', 'v', 'view'].includes(args[0].toLowerCase())) {
            const tu = await UserData.findOne({uid: message.author.id});
            if (!tu || !tu.marriedTo) {return message.channel.send("You aren't married to anyone :(");}
            else {return message.channel.send({embeds: [new Discord.MessageEmbed()
                .setTitle("Marriage Status")
                .setDescription(`<@${message.author.id}> is married to <@${tu.marriedTo}>!`)
                .setColor('c375f0')
                .setFooter({text: "Natsuki", iconURL: client.user.avatarURL()})
                .setTimestamp()
            ]});}
        } else if (['d', 'decline', 'r', 'reject'].includes(args[0].toLowerCase())) {

        } else {
            if (!mention) {return message.channel.send("You have to mention the person you'd like to marry!");}
            if (!message.guild.members.cache.has(mention.id)) {return message.channel.send("I can't find that user! Make sure they're in this server before trying to marry them, or go to a server they're in. If you're certain that person is in this server, then wait for them to come online and send a message first; that might help.");}
            if (mention.id === client.user.id) {return message.channel.send("I'm actually already married! Well, I will be soon, to my girlfriend Tamaki. I love her very much <:NC_hearty:841489530413383712>");}
            if (mention.bot) {return message.channel.send("Us bots aren't smart enough to respond to a marriage request and we're really too boring to wanna marry in the first place, so I'll just stop you in your tracks now.");}
            const tu = await UserData.findOne({uid: message.author.id}) || new UserData({uid: message.author.id});
            if (tu.marriedTo) {return message.channel.send("Looks like you're already married to someone. Cheating, are we?");}
            const ou = await UserData.findOne({uid: mention.id}) || new UserData({uid: mention.id});
            if (ou.marriedTo) {return message.channel.send("Looks like that person is already in a relationship. Yikes, good luck with that.");}
            if (client.misc.cache.marriageRequests.has(ou.uid) && client.misc.cache.marriageRequests.get(ou.uid) === message.author.id) {
                tu.marriedTo = ou.uid; ou.marriedTo = tu.uid;
                tu.markModified('marriedTo'); ou.markModified('marriedTo');
                await tu.save(); await ou.save();
                return message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setTitle(`New Marriage!`)
                    .setDescription(`With the powers invested in me by Wubzy ~~and myself because I'm cool like that~~, I now pronounce ${message.member.displayName} and ${message.guild.members.cache.get(ou.uid).displayName} a married couple till debt and richer Discord users do you part.`)
                    .setColor('c375f0')
                    .setFooter({text: "Natsuki", iconURL: client.user.avatarURL()})
                    .setTimestamp()
                ]});
            }
            if (client.misc.cache.marriageRequests.has(message.author.id)) {return message.channel.send("You're already waiting on another marriage response.");}
            if (client.misc.cache.marriageRequests.filter(u => u === ou.uid).size > 10) {return message.channel.send("*10 people are waiting on a response to marry this person. Yikes.*");}
            client.misc.cache.marriageRequests.set(message.author.id, ou.uid);
            return message.channel.send(`<@${ou.uid}>, you have a marriage request from ${message.member.displayName}. Send \`${prefix}marry @${message.member.displayName}\` to accept!`);
        }
    }
};