const Discord = require('discord.js');

const deaths = [
    "Watching too much anime", "Overdose of waifus", "Hypotakunemia", "Trying to self-isekai",
    "Bass.", "Cranked the music just a little too loud", "Tried to swim in lava", "Unknown",
    "Despacito"
]; // a list of preset death methods that can occur

module.exports = {
    name: "deathnote",
    aliases: ['dn'],
    help: new Discord.MessageEmbed()
    .setTitle("Help -> Death Note")
    .setDescription("Congratulations! You've picked up a death note. Write someone's name in it, and see for yourself if it's the real deal...")
    .addField("Syntax", "\`deathnote <@member> [method of death]\`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}deathnote <@member> [method of death]\``);}
        if (args[0] == "kill" || args[0] == "k") {args.shift();} // if someone adds in 'kill' it'll remove it and act like it wasn't there, proceeding as normal.
        if (!mention) {return message.reply("You have to write their name down in order to kill them! (In other words, please mention the user whose name you wish to write.)");}

    }
};