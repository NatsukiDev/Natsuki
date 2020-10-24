const Discord = require('discord.js');
const moment = require('moment');
const mongoose = require('mongoose');
const UserData = require('../models/user');

module.exports = {
    name: "userinfo",
    aliases: ['ui', 'memberinfo', 'user'],
    help: "Shows your info, or shows the info of a user you ping.",
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let person = message.guild ? mention ? message.guild.members.cache.get(mention.id) : args[0] ? message.guild.members.cache.has(args[0]) ? message.guild.members.cache.get(args[0]) : message.member : message.member : message.author;
        let name = message.guild ? person.displayName : person.username;
        let tu = await UserData.findOne({uid: person.id});
        if (!tu) {return message.channel.send("I don't have any data on that user yet.");}
        let infoembed= new Discord.MessageEmbed()
            .setTitle(`User Info for ${name}`)
            .setDescription(`Requested by ${message.guild ? message.member.displayName : message.author.username}`)
            .setThumbnail(client.users.cache.get(person.id).avatarURL({size: 2048}))
            .addField("Account Created", moment(client.users.cache.get(person.id).createdAt).fromNow(), true)
            .addField("Bot User?", client.users.cache.get(person.id).bot ? "Is a bot" : "Is not a bot", true)
            .setColor('c375f0')
            .setFooter('Natsuki', client.user.avatarURL())
            .setTimestamp();

        if (message.guild) {
            infoembed.addField('In Server Since', moment(person.joinedAt).fromNow(), true)
                .addField('Highest Role in Server', `<@&${person.roles.highest.id}>`, true)
        }

        if (tu) {
            infoembed.addField('Natsuki Commands Executed', tu.commands)
                .addField('Natsuki Staff Level', tu.support ? 'Support; Answers tickets and help queries' : tu.staff ? 'Staff; Support but with maintenance permissions' : tu.admin ? 'Admin; Audit access to the bot' : tu.developer ? 'Developer' : 'Member; Does not have a staff rank.')
                .addField('Donator?', tu.developer ? `Well, ${name} makes me work, so they're a supporter in my book!` : tu.donator ? 'Yes! They have donated or supported me in the past!' : 'No');
        }
        return message.channel.send(infoembed);
    }
};