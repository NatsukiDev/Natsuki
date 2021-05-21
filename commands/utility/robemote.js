const Discord = require('discord.js');

module.exports = {
    name: "robemote",
    aliases: ['robemoji', 're', 'stealemoji', 'stealemote', 'addemote', 'createemote', 'createemoji', 'addemoji', 'ae'],
    meta: {
        category: 'Utility',
        description: "Take any emote and instantly add it to your server!",
        syntax: '`robemote [emoji|url] [name]`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
    .setTitle("Help -> Emoji Robbery")
    .setDescription("Takes an emoji and adds it to this server, if you have the permissions.")
    .addField("Syntax", "`robemote [emoji] [name]`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.member.permissions.has("MANAGE_EMOJIS")) {return message.channel.send("You must have permissions to manage emoji in this server.");}
        if (!message.guild.me.permissions.has("MANAGE_EMOJIS")) {return message.channel.send("I don't have permissions to manage emoji in this server, so I can't add any emotes.");}
        if (!args.length) {
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle("Add Emoji")
                .setDescription("React to this message with the emoji you want to be added to the server.")
                .setFooter("This will time out in 60 seconds")
                .setColor('c375f0')
            ).then(m => {
                const rc = m.createReactionCollector((r, u) => u.id === message.author.id, {time: 60000});
                rc.on('collect', r => {
                    rc.stop();
                    return message.guild.emojis.create(`https://cdn.discordapp.com/emojis/${r.emoji.id}`, r.emoji.name)
                    .then(e => message.channel.send(new Discord.MessageEmbed()
                        .setAuthor(message.member.displayName, message.author.avatarURL())
                        .setTitle("Emoji Created!")
                        .setThumbnail(`https://cdn.discordapp.com/emojis/${e.id}${e.animated ? '.gif': ''}`)
                        .setDescription(`Name: \`:${e.name}:\`\nID: ${e.id}\nURL: [Click Me](https://cdn.discordapp.com/emojis/${e.id})`)
                        .setFooter("Natsuki")
                        .setColor('c375f0')
                        .setTimestamp()
                    ).then(() => require('../../util/ask')(message, "If you'd like to rename the emoji, send the name now. Otherwise, wait 30 seconds and nothing will happen.", 30000, false, false)
                        .then(res => {
                            if (res) {
                                e.setName(res)
                                .then(() => message.channel.send("Emoji successfully renamed!"))
                                .catch(() => {return message.channel.send("For some reason, the emoji was not able to be renamed. Please do so manually");});
                            }
                        })
                    )).catch(() => message.channel.send("<a:NC_x:717396078294597643> There was an error trying to create that emoji. I might not have permissions to add emoji, or the server may be at its emoji limit."));
                });
                rc.on('end', collected => {if (collected.size) {return m.delete().catch(() => {});} else {m.edit(m.embeds[0].setDescription(m.embeds[0].description + '\n\n*Timed out!*')).catch(() => {});}});
            });
        }

        if (!args[0].match(/^<a?:.+:\d+>$|^https:\/\/.+$|^\d+$/)) {return message.channel.send("It doesn't look like you gave me a valid emoji to steal or a URL to make an emoji from.");}
        if (!args[1] && !args[0].match(/^<a?:.+:\d+>$/)) {return message.channel.send("You specified a URL/ID but didn't give an emoji name. Please try again and give the name you'd like to make the emoji.");}

        return message.guild.emojis.create(
            args[0].match(/^<a?:.+:\d+>$/) 
                ? `https://cdn.discordapp.com/emojis/${args[0].split(':')[2].slice(0, args[0].split(':')[2].length - 1)}`
                : args[0].match(/^\d+$/)
                    ? `https://cdn.discordapp.com/emojis/${args[0]}`
                    : args[0],
            args[1] || args[0].split(':')[1]
        ).then(e => message.channel.send(new Discord.MessageEmbed()
            .setAuthor(message.member.displayName, message.author.avatarURL())
            .setTitle("Emoji Created!")
            .setThumbnail(`https://cdn.discordapp.com/emojis/${e.id}${e.animated ? '.gif': ''}`)
            .setDescription(`Name: \`:${e.name}:\`\nID: ${e.id}\nURL: [Click Me](https://cdn.discordapp.com/emojis/${e.id}${e.animated ? '.gif': ''})`)
            .setFooter("Natsuki")
            .setColor('c375f0')
            .setTimestamp()
        ))
        .catch(() => message.channel.send("<a:NC_x:717396078294597643> There was an error trying to create that emoji. I might not have permissions to add emoji, the server may be at its emoji limit, you may have given a bad URL, not specified the emoji properly, or the file type in the URL you gave is invalid."));
    }
};