const Discord = require('discord.js');
const UserData = require('../models/user');

module.exports = {
    name: "staff",
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Staff")
        .setDescription("Make a user a Natsuki staff member")
        .addField("Syntax", "`admin <add|remove|check> <@user|userID>`")
        .addField("Notice", "This command is only available to Natsuki developers."),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.reply("This is a guild-only command.");}
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}\``);}
        let person = mention ? mention : args[1] ? client.users.cache.has(args[1]) ? client.users.cache.get(args[1]) : null : null;
        let tu = await UserData.findOne({uid: person ? person.id : message.author.id}) ? await UserData.findOne({uid: person ? person.id : message.author.id}) : new UserData({uid: person ? person.id : message.author.id});
        if (['c', 'check'].includes(args[0])) {return message.reply(`${person ? person : message.member.displayName} ${tu.admin ? 'is' : 'is not'} a part of Natsuki Staff.`);}
        if (!['a', 'add', 'r', 'remove'].includes(args[0])) {return message.reply("You must specify whether to `add` or `remove` someone as a Staff Member.");}
        if (!person) {return message.reply("You must mention someone to add as a staff member, or use their ID.");}
        let atu = await UserData.findOne({uid: message.author.id});
        if (!atu && !atu.developer && !client.developers.includes(message.author.id)) {return message.reply('You must be a developer in order to add set staff member statuses.');}
        if (['a', 'add'].includes(args[0])) {tu.support = true; tu.staff = true;}
        else {tu.staff = false; tu.admin = false; tu.developer = false;}
        tu.save();
        const logemb = (act) => new Discord.MessageEmbed()
            .setAuthor(`Staff ${act}`, message.author.avatarURL())
            .setDescription("A user's Staff status was updated.")
            .setThumbnail(person.avatarURL({size: 1024}))
            .addField("Name", person.username, true)
            .addField("Developer", message.author.username, true)
            .setColor("e8da3a")
            .setFooter("Natsuki")
            .setTimestamp();
        client.guilds.cache.get('762707532417335296').channels.cache.get('762732961753595915').send(logemb(['a', 'add'].includes(args[0]) ? 'Added' : 'Removed'));
        return message.reply(`${message.guild.members.cache.get(person.id).displayName} is no${['a', 'add'].includes(args[0]) ? 'w' : ' longer'} a staff member!`);
    }
};