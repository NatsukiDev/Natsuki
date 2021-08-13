const Discord = require('discord.js');

const Saves = require("../../models/saves");

module.exports = {
    name: "nowplaying",
    aliases: ['np'],
    meta: {
        category: 'Fun',
        description: "Show off the music you're currently listening to through last.fm!",
        syntax: '`nowplaying [@mention]`',
        extra: null
    },
    help: new Discord.MessageEmbed()
    .setTitle("Help -> Now Playing")
    .setDescription("Accesses last.fm's API to show off what music you're currently listening to. Use the `lfm` command for more information.")
    .addField("Syntax", "`nowplaying [@mention]`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let savess = await Saves.findOne({name: 'lfm'}) ? await Saves.findOne({name: 'lfm'}) : new Saves({name: 'lfm'});
        let saves = savess.saves;
        let user = mention || message.author;
        if (!saves.get(user.id)) {return message.channel.send(`${mention ? "That person's" : "Your"} last.fm username isn't set! ${mention ? "They" : "You"} can set it with \`${prefix}lfm set <username>\``);}
        
        let found = false;
        try {
            const glfm = function() {return new Promise(resolve => {
                let timeout = setTimeout(() => {return resolve(undefined);}, 3000);
                let stream = client.lfm.stream(saves.get(user.id));
                stream.on('nowPlaying', t => {
                    clearTimeout(timeout);
                    message.channel.send({embeds: [new Discord.MessageEmbed()
                        .setAuthor(message.guild ? message.guild.members.cache.get(user.id) ? message.guild.members.cache.get(user.id).displayName : user.username : user.username, user.avatarURL())
                        .setTitle(`${saves.get(user.id)} | Now Playing`)
                        .setDescription(`<@${user.id}> is currently listening to **${t.name}** by **${t.artist['#text']}**.\nView the song [here](${t.url}).`)
                        .setColor("c375f0")
                        .setThumbnail(t.image[3]['#text'])
                        .setTimestamp()
                    ]})
                    found = true;
                    stream.stop();
                    return resolve(undefined);
                });
                stream.start();
            });}
            await glfm().catch((e) => {console.error(e);});
        } catch (e) {console.error(e);}
        
        if (!found) {return message.channel.send(`I couldn't find what \"${saves.get(user.id)}\" is listening to. Perhaps ${!mention ? "you" : "they"}'re not listening to anything, or you got ${!mention ? "your" : "their"} name wrong?`);}
    }
};