const Discord = require('discord.js');

module.exports = {
    name: "emoji",
    aliases: ['emote', 'emojiinfo', 'emoteinfo', 'ei'],
    meta: {
        category: 'Misc',
        description: "Get info on a certain emoji",
        syntax: '`emoji <:emoji:|emojiID>`',
        extra: null
    },
    help: new Discord.MessageEmbed()
    .setTitle("Help -> Emoji")
    .setDescription("Get info on an emoji, such as its ID, name, and a link to the source image. You can also use this for the `robemoji` command to add an emoji by its ID.")
    .addField("Syntax", "`emoji <:emoji:|emojiID>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {}
        if (!args[0].match(/^<a?:.+:\d+>$|^\d+$/gm)) {return message.channel.send("That doesn't seem to be a valid emoji! (Standard Discord emojis don't count :p )");}
        let name; let id; let animated; let url;
        let access = false;
        if (args[0].match(/^<a?:.+:\d+>$/)) {
            let spl = args[0].split(':');
            name = spl[1];
            id = spl[2].slice(0, spl[2].length - 1);
            animated = spl[0].includes('a');
            url = `https://cdn.discordapp.com/emojis/${id}`;
            access = client.emojis.cache.has(id);
        } else {
            id = args[0];
            url = `https://cdn.discordapp.com/emojis/${id}`;
            access = client.emojis.cache.has(id);
            if (access) {
                name = client.emojis.cache.get(id).name;
                animated = client.emojis.cache.get(id).animated;
            }
        }

        if (animated) {url += '.gif';}

        try {
            let finEm = new Discord.MessageEmbed()
                .setTitle("Emoji Info")
                .setDescription(`Name: ${name ? `\`:${name}:\`` : "Not Found"}\nID: ${id}\nURL: [Here](${url})\nAnimated: ${animated === true}\n\nI have access: ${access}`)
                .setColor('c375f0')
                .setImage(url)
                .setFooter("Natsuki", client.user.avatarURL())
                .setTimestamp();
            if (access) {finEm.setThumbnail(client.emojis.cache.get(id).guild.iconURL({size: 1024}));}
            if (access && client.emojis.cache.get(id).guild.members.cache.has(message.author.id) && client.emojis.cache.get(id).guild.id !== message.guild ? message.guild.id : 1) {finEm.addField("Server", `You're in the server this emoji is from: **${client.emojis.cache.get(id).guild.name}**`);}
            return message.channel.send(finEm);
        } catch {
            return message.channel.send("There was an error getting info for that emoji. You may not have given a valid emoji, or the ID you gave doesn't lead to a real emoji.");
        }
    }
};