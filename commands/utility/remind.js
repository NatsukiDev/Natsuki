const Discord = require('discord.js');
const cron = require('cron');

module.exports = {
    name: "remind",
    aliases: ['remindme', 'reminder'],
    meta: {
        category: 'Utility',
        description: "",
        syntax: '` <>`',
        extra: null
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> ")
        .setDescription("")
        .addField("Syntax", "``"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        //if (!args.length) {return message.channel.send(`Syntax: \`${prefix}\``);}
        const job = new cron.CronJob(new Date().setMinutes(new Date().getMinutes() + 1), () => message.author.send('test cron'));
    }
};