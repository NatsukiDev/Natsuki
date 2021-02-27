const Discord = require('discord.js');
const mongoose = require('mongoose');
const UserData = require('../../models/user');

module.exports = {
    name: "developer",
    aliases: ['dev'],
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Developer")
        .setDescription("Add or remove users as Natsuki developers.")
        .addField("Syntax", "`developer <add|remove> <@user|userID>`")
        .addField("Notice", "You must already be a developer of Natsuki in order to use this command."),
    meta: {
        category: 'Developer',
        description: "Add or remove users as Natsuki developers",
        syntax: '`developer <add|remove|check> <@user|userID>`',
        extra: "You can check if a user is a developer without being a developer."
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.reply("This is a guild-only command!");}
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}developer <add|remove> <@user|userID>\``);}
        let person = mention ? mention : args[1] ? client.users.cache.has(args[1]) ? client.users.cache.get(args[1]) : null : null;
        let tu = await UserData.findOne({uid: person ? person.id : message.author.id}) ? await UserData.findOne({uid: person ? person.id : message.author.id}) : new UserData({uid: person ? person.id : message.author.id});
        if (['c', 'check'].includes(args[0])) {return message.reply(`${person ? person : message.member.displayName} ${tu.developer ? 'is' : 'is not'} a Natsuki developer.`);}
        if (!['a', 'add', 'r', 'remove'].includes(args[0])) {return message.reply("You must specify whether to `add` or `remove` someone as a developer.");}
        if (!person) {return message.reply("You must mention someone to add as a developer, or use their ID.");}
        let atu = await UserData.findOne({uid: message.author.id});
        if (!atu && !atu.developer && !client.developers.includes(message.author.id)) {return message.reply('You must be a developer in order to add or remove someone else as a developer.');}
        if (['a', 'add'].includes(args[0])) {tu.support = true; tu.staff = true; tu.admin = true; tu.developer = true;}
        else {tu.developer = false;}
        tu.save();
        const logemb = (act) => new Discord.MessageEmbed()
            .setAuthor(`Developer ${act}`, message.author.avatarURL())
            .setDescription("A user's Developer status was updated.")
            .setThumbnail(person.avatarURL({size: 1024}))
            .addField("Name", person.username, true)
            .addField("Developer", message.author.username, true)
            .setColor("e8da3a")
            .setFooter("Natsuki")
            .setTimestamp();
        client.guilds.cache.get('762707532417335296').channels.cache.get('762732961753595915').send(logemb(['a', 'add'].includes(args[0]) ? 'Added' : 'Removed'));
        return message.reply(`${message.guild.members.cache.get(person.id).displayName} is no${['a', 'add'].includes(args[0]) ? 'w' : ' longer'} a developer!`);
    }
};