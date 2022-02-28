const Discord = require('discord.js');
const mongoose = require('mongoose');
const UserData = require('../../models/user');

module.exports = {
    name: "dnd",
    aliases: ['donotdisturb'],
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Do Not Disturb")
        .setDescription("Set your status within the bot as DnD and specify a reason. Then, when other people ping you, I can let them know that you don't want to be disturbed!")
        .addField("Syntax", "`dnd [clearMode] <reason>`")
        .addField("Notice","Your status clear mode can be set to either 'auto' or 'manual'. If not specified, it will clear when you use `n?clearstatus`."),
    meta: {
        category: 'Social',
        description: "Tell others not to disturb you so that they'll know not to ping you.",
        syntax: '`dnd [clearMode] <reason>`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}dnd [clearMode] <reason>\``);}
        args = msg.startsWith(prefix)
                ? message.content.slice(prefix.length).trim().split(/ +/g)
                : msg.startsWith('<@!')
                    ? message.content.slice(4 + client.user.id.length).trim().split(/ +/g)
                    : message.content.slice(3 + client.user.id.length).trim().split(/ +/g) 
        args = args.slice(1);
        let tu = await UserData.findOne({uid: message.author.id})
            ? await UserData.findOne({uid: message.author.id})
            : new UserData({uid: message.author.id});
        if (['m', 'manual', 'a', 'auto'].includes(args[0])) {
            tu.statusclearmode = ['m', 'manual'].includes(args[0]) ? 'manual' : 'auto';
            args.shift();
        } else {tu.statusclearmode = 'manual';}
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}afk [clearMode] <reason>\``);}
        let reason = args.join(" ");
        if (reason.length > 150) {return message.channel.send("That status a bit long; keep it under 150 characters.");}
        if (reason.match(/<@&\d+>|@everyone/gm)) {return message.channel.send("I won't ping any roles or @ everyone!");}
        if (reason.split(/\n/gm).length > 10) {return message.channel.send("That's too many lines!");}
        tu.statustype = 'dnd';
        tu.statusmsg = reason.trim();
        tu.statussetat = new Date();
        let tempDate = new Date();
        tu.statusclearat = tempDate.setHours(tempDate.getHours() + 12);
        tu.markModified("statussetat");
        tu.markModified("statusclearat");
        tu.save();
        require('../../util/cachestatus')(message.author.id, tempDate.setHours(tempDate.getHours() + 12));
        return message.reply(`I set your ${tu.statusclearmode === 'auto' ? 'automatically' : 'manually'}-clearing Do not Disturb message to: ${reason.trim()}`);
    }
};