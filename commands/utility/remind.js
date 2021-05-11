const Discord = require('discord.js');
const cron = require('cron');
const moment = require('moment');

module.exports = {
    name: "remind",
    aliases: ['remindme', 'reminder'],
    meta: {
        category: 'Utility',
        description: "Set a reminder for something later",
        syntax: '`remind <x days|x hours|x minutes>`',
        extra: null
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Reminders")
        .setDescription("Have me remind you about something later on.")
        .addField("Syntax", "`remind <x days|x hours|x minutes>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}remind <time> <days|hours|minutes> <reminder>\``);}
        if (isNaN(args[0])) {return message.channel.send("You didn't provide a number for how long I should wait to remind you.");}
        if (args[0].length > 8) {return message.channel.send("Whoah there, pal. That's a lot of time! A little too much, perhaps?");}
        let time = Number(args[0]);
        if (!args[1]) {return message.channel.send("You didn't provide the time format. Must be `<days|hours|minutes>`");}
        if (!['days', 'day', 'd', 'hours', 'hour', 'h', 'minutes', 'minute', 'm'].includes(args[1].toLowerCase())) {return message.channel.send("You didn't provide a proper time format. Must be `days`, `hours`, or `minutes`.");}
        let type = args[1].toLowerCase();
        time = type.startsWith('m') ? time : type.startsWith('h') ? time * 60 : time * 60 * 24;
        if (time > (60 * 24 * 14)) {return message.channel.send("Reminders are limited to less than 14 days.");}
        if (!args[2]) {return message.channel.send("You have to tell me what you want me to remind you to do!");}
        args.shift(); args.shift();
        let reminder = args.join(" ");
        if (reminder.length > 300) {return message.channel.send("Your reminder must be less than 300 characters.");}
        let startDate = new Date(Date.now() + (1000 * 60 * time));
        new cron.CronJob(startDate, () => message.author.send(`Here's a reminder you asked me to give you ${moment(new Date(Date.now() - (1000 * 60 * time))).fromNow()}: ${reminder}`).catch(() => {})).start();
	    return message.channel.send(`Reminder set! Make sure you have your DMs open, as it will send in DM.`);
    }
};