const Discord = require('discord.js');

module.exports = {
    name: "decide",
    help: new Discord.MessageEmbed()
    .setTitle("Help -> ")
    .setDescription("")
    .addField("Syntax", "``"),
    async condition (message, msg, args, cmd, prefix, mention, client) {return msg.split(/\s+/gm).length > 3 && (msg.startsWith(`<@${client.user.id}>`) || msg.startsWith(`<@!${client.user.id}>`));},
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let e = message.content.split(/\s+/g); e.shift();
        let options = e.join(" ").split(/(?:(?:\s+)[oO][rR] [sS][hH][oO][uU][lL][dD] [iI](?:\s+)|,(?:\s*)[oO][rR] [sS][hH][oO][uU][lL][dD] [iI](?:\s+)|(?:\s+)[oO][rR] [dD][oO] [iI](?:\s+)|,(?:\s*)[dD][oO] [iI](?:\s+)|,(?:\s*)[sS][hH][oO][uU][lL][dD] [iI](?:\s+)|,(?:\s*)[oO][rR] [dD][oO] [iI](?:\s+)|,(?:\s*)[oO][rR](?:\s+)|(?:\s+)[oO][rR](?:\s+)|,(?:\s*))/gm);
        //console.log(e, options);
        if (options.length < 2) {return;}
        let cleanups = ['should i ', 'do i '];
        let option; for (option of options) {let c; for (c of cleanups) {if (option.trim().toLowerCase().startsWith(c)) {options[options.indexOf(option)] = option.trim().slice(c.length);}}}
        return message.channel.send(`${['You should', 'How about', 'Hmmm... I pick', 'How about you', 'I think you should'][Math.floor(Math.random() * 5)]} ${options[Math.floor(Math.random() * options.length)]}.`);
    }
};