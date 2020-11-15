const Discord = require('discord.js');

const ask = require('../util/ask');

module.exports = {
    name: "secretsanta",
    aliases: ['ss'],
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Secret Santa")
        .setDescription("Create a secret santa for all of your friends or for your server! Whether you celebrate the holidays or not, this can still be loads of fun!")
        .addField("Syntax", "``"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}\``);}
        if (['start', 'create', 'new'].includes(args[0].toLowerCase())) {
            if (client.misc.activeDMs.has(message.author.id)) {return message.reply("I'm already asking you questions in DM for a separate command! Finish that command before using this one.");}
            client.misc.activeDMs.set(message.author.id, 'secretsanta-make');
            let mesg = await message.author.send("I'll be asking you a few questions here about how you want your Secret Santa to go! You can simply ignore the messages for a few minutes to cancel the process.").catch(() => {message.reply("Please open your DMs so I can ask you some questions!");});
            let dmch = mesg.channel;

            let conf = await ask(mesg, "This secret santa will be tied to your account, and you will be considered the host. Is this okay?", 60000); if (!conf) {return;}
            if (['n', 'no'].includes(conf.trim().toLowerCase())) {return dmch.send("Oh, alrighty! Have the person who wants to be the host execute this same command.");}
            if (!['yes', 'ye', 'y', 'sure'].includes(conf.trim().toLowerCase())) {return dmch.send("Please specify yes or no you weeb!");}

            let start = await ask(mesg, "When will you begin the secret santa? (You'll start it manually, so don't worry about formatting.", 60000); if (!start) {return;}
            if (start.length > 150) {return dmch.send("Heya there, just a few words, please! I don't wanna have to read out an essay about when it's starting to all the people that want to hear about your secret santa!");}

            let end = await ask(mesg, "When will you end the secret santa? (You'll also end it manually.)", 60000); if (!start) {return;}
            if (end.length > 150) {return dmch.send("Heya there, just a few words, please! I don't wanna have to read out an essay about when it's ending to all the people that want to hear about your secret santa!");}

            let spend = await ask(mesg, "What is your maximum and minimum spending? This is useful so that everyone gets an equal gift or gifts. This will be shown to the people that buy their gifts.", 360000); if (!join) {return;}
            
        }
    }
};