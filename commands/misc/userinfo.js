const Discord = require('discord.js');
const moment = require('moment');
require('moment-precise-range-plugin');

const UserData = require('../../models/user');

module.exports = {
    name: "userinfo",
    aliases: ['ui', 'memberinfo', 'user'],
    help: "Shows your info, or shows the info of a user you ping.",
    meta: {
        category: 'Misc',
        description: "See some info about a user",
        syntax: '`userinfo [@user]`',
        extra: null,
        guildOnly: true
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let person = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if (!person) {return message.channel.send("Hmmm... that doesn't seem to be a real user.");}
        let u = await client.users.fetch(person.id, {force: true, cache: false}).catch(() => {});
        if (!u) {return message.channel.send("There was an issue finding that user. They might not be a real user!");}
        temp = await message.guild.members.fetch(person.id);
        if (!temp) {return message.channel.send("There was an issue finding that user. They might not be a real user, or not one that exists in this server.");}
        let name = message.guild ? person.displayName : person.username;
        let tu = await UserData.findOne({uid: person.id});
        let now = new Date();
        let infoembed = new Discord.MessageEmbed()
            .setTitle(`User Info for ${name}`)
            .setDescription(`Requested by ${message.guild ? message.member.displayName : message.author.username}`)
            .setThumbnail((message.guild ? person : u).displayAvatarURL({size: 4096}))
            .addField("Account Created", `${moment(u.createdAt).fromNow()}`, true)
            .addField("Bot User?", u.bot ? "Is a bot" : "Is not a bot", true)
            .setColor('c375f0')
            .setFooter({text: "Natsuki", iconURL: client.user.avatarURL()})
            .setTimestamp();

        if (message.guild) {
            infoembed.addField('In Server Since', `${client.utils.sm(moment.preciseDiff(Date.now(), person.joinedAt, true))}${!moment(person.joinedAt).fromNow().includes('days') ? ` | ${Math.floor((new Date().getTime() - person.joinedAt.getTime()) / (60 * 60 * 24 * 1000))} days` : ''}\nMember for **${Math.round(((now.getTime() - person.joinedAt.getTime()) / (now.getTime() - message.guild.createdAt.getTime())) * 100)}%** of server lifetime`, false)
                .addField('Roles', `**${person.roles.cache.size}** roles | [${person.roles.cache.size}/${message.guild.roles.cache.size}] - ${Math.round((person.roles.cache.size / message.guild.roles.cache.size) * 100)}%\nHighest: ${person.roles.highest ? `<@&${person.roles.highest.id}>` : 'No roles!'}`, true)
            if (message.guild.ownerId === person.id) {infoembed.addField("Extra", "User is the server's owner!");}
            else if (person.permissions.has("ADMINISTRATOR")) {infoembed.addField("Extra", "User is an admin! Watch out :eyes:");}
        }

        if (tu) {
            infoembed.addField('Natsuki Commands Executed', `${tu.commands}`);
            if (tu.donator || tu.developer) {infoembed.addField('Donator?', tu.developer ? `Well, ${name} makes me work, so they're a supporter in my book!` : tu.donator ? 'Yes! They have donated or supported me in the past!' : 'No', true);}
            if (tu.staff) {infoembed.addField('Natsuki Staff Level', tu.developer ? 'Developer' : tu.admin ? 'Admin; Audit access to the bot' : tu.staff ? 'Staff; Support but with maintenance permissions' : tu.support ? 'Support; Answers tickets and help queries' : 'Member; Does not have a staff rank.', true);}
        }
        
        console.log()
        if (u.banner) {infoembed.setImage(u.bannerURL({size: 4096, dynamic: true, format: 'png'}));}

        return message.channel.send({embeds: [infoembed]});
    }
};