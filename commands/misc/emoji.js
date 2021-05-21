const Discord = require('discord.js');

const {Pagination} = require('../../util/pagination');

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
        if (!args.length) {
            if (!message.guild.id) {return message.channel.send(`Syntax: \`${prefix}emoji <:emoji:|emojiID>\``);}
            let emotes = [];
            Array.from(message.channel.messages.cache.values()).forEach(m => {
                let margs = m.content.split(/\s+/gm);
                margs.forEach(marg => {if (marg.match(/^<a?:.+:\d+>$/) && !emotes.includes(marg)) {emotes.push(marg);}});
                if (m.reactions.cache.size) {Array.from(m.reactions.cache.values()).forEach(r => {if (r.emoji.id && !emotes.includes(`<${r.emoji.animated ? 'a' : ''}:${r.emoji.name}:${r.emoji.id}>`)) {emotes.push(`<${r.emoji.animated ? 'a' : ''}:${r.emoji.name}:${r.emoji.id}>`);}});}
            });
            if (!emotes.length) {return message.channel.send("It doesn't look like anyone has sent any emoji recently. Try using the command again but adding an emoji to the message to get info on it.");}
            emotes.reverse();
            let emoteEmbeds = [];
            emotes.forEach(emote => {
                let spl = emote.split(':');
                let finEm = new Discord.MessageEmbed()
                    .setTitle("Emoji Info")
                    .setDescription(`Name: ${spl[1] ? `\`:${spl[1]}:\`` : "Not Found"}\nID: ${spl[2].slice(0, spl[2].length - 1)}\nURL: [Here](${`https://cdn.discordapp.com/emojis/${spl[2].slice(0, spl[2].length - 1)}${spl[0].includes('a') ? '.gif' : ""}`})\nAnimated: ${spl[0].includes('a') === true}\n\nI have access: ${client.emojis.cache.has(spl[2].slice(0, spl[2].length - 1))}`)
                    .setColor('c375f0')
                    .setImage(`https://cdn.discordapp.com/emojis/${spl[2].slice(0, spl[2].length - 1)}${spl[0].includes('a') ? '.gif' : ""}`)
                    .setFooter("Natsuki", client.user.avatarURL())
                    .setTimestamp();
                if (client.emojis.cache.has(spl[2].slice(0, spl[2].length - 1))) {finEm.setThumbnail(client.emojis.cache.get(spl[2].slice(0, spl[2].length - 1)).guild.iconURL({size: 1024}));}
                if (client.emojis.cache.has(spl[2].slice(0, spl[2].length - 1)) && client.emojis.cache.get(spl[2].slice(0, spl[2].length - 1)).guild.members.cache.has(message.author.id) && client.emojis.cache.get(spl[2].slice(0, spl[2].length - 1)).guild.id !== (message.guild ? message.guild.id : 1)) {finEm.addField("Server", `You're in the server this emoji is from: **${client.emojis.cache.get(spl[2].slice(0, spl[2].length - 1)).guild.name}**`);}
                emoteEmbeds.push(finEm);
            });
            let emojiList = new Pagination(message.channel, emoteEmbeds, message, client, true);
            return emojiList.start({user: message.author.id, endTime: 60000});
        }
        if (!args[0].match(/^<a?:.+:\d+>$|^\d+$/gm)) {
            if (args[0].length > 25) {return message.channel.send("That doesn't seem to be a valid emoji! (Standard Discord emojis don't count :p )");}
            let lookup = client.emojis.cache.filter(e => (args[0].length > 4 && e.name.toLowerCase().includes(args[0].toLowerCase())) || e.name.toLowerCase() === args[0].toLowerCase());
            if (!lookup.size) {return message.channel.send("I tried to find some emojis that matched that name, but couldn't find anything. Maybe you didn't give an emoji to begin with?");}
            let emotes = Array.from(lookup.values());
            if (lookup.size > 20) {
                let pages = [];
                let x = 0;
                while (true) {
                    let cond = false;
                    let page = '';
                    for (let i = 0; i < 20; i++) {
                        if (emotes[(x * 20) + i] === undefined) {cond = true; break;}
                        page += `<${emotes[(x * 20) + i].animated ? 'a' : ''}:${emotes[(x * 20) + i].name}:${emotes[(x * 20) + i].id}> \`:${emotes[(x * 20) + i].name}:\` -> ${emotes[(x * 20) + i].id}\n`;
                        if ((x * 20) + i >= emotes.length) {cond = true; break;}
                    }
                    pages.push(new Discord.MessageEmbed()
                        .setTitle(`Emoji Lookup Results [${(x * 20) + 1}-${(x * 20) + 20} of ${lookup.size}]`)
                        .setDescription(page)
                        .setColor('c375f0')
                        .setFooter("Natsuki", client.user.avatarURL())
                        .setTimestamp()
                    );
                    if (cond) {break;}
                    x++;
                }
                let emojiList = new Pagination(message.channel, pages, message, client, true);
                return emojiList.start({user: message.author.id, endTime: 60000});
            } else {
                let page = '';
                for (let i = 0; i < lookup.size; i++) {page += `<${emotes[i].animated ? 'a' : ''}:${emotes[i].name}:${emotes[i].id}> \`:${emotes[i].name}:\` -> ${emotes[i].id}\n`;}
                return message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`Emoji Lookup Results - ${lookup.size}`)
                    .setDescription(page)
                    .setColor('c375f0')
                    .setFooter("Natsuki", client.user.avatarURL())
                    .setTimestamp()
                );
            }
        }
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
            if (access && client.emojis.cache.get(id).guild.members.cache.has(message.author.id) && client.emojis.cache.get(id).guild.id !== (message.guild ? message.guild.id : 1)) {finEm.addField("Server", `You're in the server this emoji is from: **${client.emojis.cache.get(id).guild.name}**`);}
            return message.channel.send(finEm);
        } catch {
            return message.channel.send("There was an error getting info for that emoji. You may not have given a valid emoji, or the ID you gave doesn't lead to a real emoji.");
        }
    }
};