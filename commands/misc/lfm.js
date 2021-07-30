const Discord = require('discord.js');

const Saves = require('../../models/saves');

const ask = require("../../util/ask");

module.exports = {
    name: "lfm",
    aliases: ['lastfm'],
    meta: {
        category: 'Misc',
        description: "Interact with the last.fm service",
        syntax: '` <>`',
        extra: null
    },
    help: new Discord.MessageEmbed()
    .setTitle("Help -> Last.fm")
    .setDescription("Interact with last.fm, a service that stores and analyzes your Spotify listening activity.")
    .addField("Notice", "Most of the features of this command require you to have an account. You can make one at [last.fm](https://last.fm)")
    .addField("Syntax", "``"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}\``);}

        let savess = await Saves.findOne({name: 'lfm'}) || new Saves({name: 'lfm'});
        let saves = savess.saves;
        
        if (['s', 'set', 'setname', 'setusername', 'setn'].includes(args[0].toLowerCase())) {
            args.shift();
            let name;
            if (!args.length) {
                name = await ask(message, "What is your last.fm username?", 60000);
                if (!name) {return;}
            }
            saves.set(message.author.id, name || args.join(" ").trim());
            savess.saves = saves;
            savess.save();
            return message.channel.send(`Last.fm username set! Try \`${prefix}nowplaying\` if you're listening to music to show off what you're currently listening to!`);
        }
    }
};