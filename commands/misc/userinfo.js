const Discord = require('discord.js');
const moment = require('moment');
const mongoose = require('mongoose');
const UserData = require('../../models/user');

module.exports = {
    name: "userinfo",
    aliases: ['ui', 'memberinfo', 'user'],
    help: "Shows your info, or shows the info of a user you ping.",
    meta: {
        category: 'Misc',
        description: "See some info about a user",
        syntax: '`userinfo [@user]`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let person = message.guild ? mention ? message.guild.members.cache.get(mention.id) : args[0] ? message.guild.members.cache.has(args[0]) ? message.guild.members.cache.get(args[0]) : message.member : message.member : message.author;
        let name = message.guild ? person.displayName : person.username;
        let tu = await UserData.findOne({uid: person.id});
        let now = new Date();
        let infoembed = new Discord.MessageEmbed()
            .setTitle(`User Info for ${name}`)
            .setDescription(`Requested by ${message.guild ? message.member.displayName : message.author.username}`)
            .setThumbnail(client.users.cache.get(person.id).avatarURL({size: 2048}))
            .addField("Account Created", moment(client.users.cache.get(person.id).createdAt).fromNow(), true)
            .addField("Bot User?", client.users.cache.get(person.id).bot ? "Is a bot" : "Is not a bot", true)
            .setColor('c375f0')
            .setFooter('Natsuki', client.user.avatarURL())
            .setTimestamp();

        if (message.guild) {
            infoembed.addField('In Server Since', `${moment(person.joinedAt).fromNow()}${!moment(person.joinedAt).fromNow().includes('days') ? ` | ${Math.floor((new Date().getTime() - person.joinedAt.getTime()) / (60 * 60 * 24 * 1000))} days` : ''}\nMember for **${Math.round(((now.getTime() - new Date(message.member.joinedAt.getTime()).getTime()) / (new Date(message.guild.createdAt).getTime() - now.getTime())) * -100)}%** of server lifetime`, false)
                .addField('Roles', `**${person.roles.cache.size}** roles | [${person.roles.cache.size}/${message.guild.roles.cache.size}] - ${Math.round((person.roles.cache.size / message.guild.roles.cache.size) * 100)}%\nHighest: ${person.roles.highest ? `<@&${person.roles.highest.id}>` : 'No roles!'}`, true)
            if (message.guild.ownerId === person.id) {infoembed.addField("Extra", "User is the server's owner!");}
            else if (person.permissions.has("ADMINISTRATOR")) {infoembed.addField("Extra", "User is an admin! Watch out :eyes:");}
        }

        if (tu) {
            infoembed.addField('Natsuki Commands Executed', tu.commands)
                .addField('Donator?', tu.developer ? `Well, ${name} makes me work, so they're a supporter in my book!` : tu.donator ? 'Yes! They have donated or supported me in the past!' : 'No', true)
                .addField('Natsuki Staff Level', tu.developer ? 'Developer' : tu.admin ? 'Admin; Audit access to the bot' : tu.staff ? 'Staff; Support but with maintenance permissions' : tu.support ? 'Support; Answers tickets and help queries' : 'Member; Does not have a staff rank.', true);
        }
        return message.channel.send(infoembed);
    }
};