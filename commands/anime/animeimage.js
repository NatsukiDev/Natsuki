const Discord = require('discord.js');

const UserData = require('../../models/user');
const AniData = require('../../models/anime');

const ask = require('../../util/ask');
const ans = require('../../util/anime/anisearch');
const {Pagination} = require('../../util/pagination');

module.exports = {
    name: "animeimage",
    aliases: ['ai', 'aniimage', 'aimg'],
    meta: {
        category: 'Anime',
        description: "Add an image to an anime",
        syntax: '`animeimage <anime> <imageURL|attachedImage>` or `animeimage <list> <anime>`',
        extra: null,
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Anime Images")
        .setDescription("Add an image to a anime, or list the animes' images.")
        .addField("Notice", "If you're not a member of Natsuki staff, this image will be submitted for reviewal.")
        .addField("Syntax", "`animeimage <anime> <imageURL|attachedImage>` or `animeimage <list> <anime>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let list = false;
        if (args[0] && ['l', 'list'].includes(args[0].toLowerCase())) {
            list = true;
            args.shift();
        }
        if (!args[0]) {
            let tempchar = await ask(message, "What anime would you like to add to add an image to?", 60000, false, true);
            if (!tempchar) {return;}
            args = tempchar.split(/\s+/g);
        }
        let asr = await ans(message, client, args.join(" ").trim().toLowerCase(), -700);
        let fn;
        if (asr === 0) {
            return message.channel.send("That search returned no results! Try again?");
        } else if (asr instanceof Pagination) {
            await asr.start({user: message.author.id, startPage: 0, endTime: 60000});
            await asr.message.react('✅');
            await message.channel.send("React with :white_check_mark: when you've found the anime you want!");
            let arc;
            try {arc = await asr.message.awaitReactions({filter: (r) => ['✅', '⏹'].includes(r.emoji.name), max: 1, errors: ['time']});}
            catch {return message.reply("Looks like you didn't find the anime you were looking for.");}
            collected = arc.first().emoji.name;
            if (collected === '✅') {
                fn = client.misc.cache.chars.get(asr.getCurrentPage().title.trim());
                asr.stop();
            }
            else {return message.reply("Looks like you didn't find the anime you were looking for.");}
        } else {fn = asr.id;}
        let tu = await UserData.findOne({uid: message.author.id});
        let queue = false;
        if (!tu || !tu.staff) {
            message.channel.send("This image will be __submitted__ for reviewal.");
            queue = true;
        }
        let ch = await AniData.findOne({id: fn});
        if (!ch.images) {ch.images = [];}

        if (list) {
            if (!ch.images) {ch.images = [];}
            ch.images.push(ch.thumbnail);
            let pages = ch.images.map(im => new Discord.MessageEmbed()
                .setTitle(ch.name)
                .setDescription(`**Name:** ${ch.name}`)
                .setColor("c375f0")
                .setImage(im)
            );
            if (pages.length > 1) {
                let pag = new Pagination(message.channel, pages, message, client, true);
                return await pag.start({user: message.author.id, time: 60000});
            } else {return message.channel.send(pages[0].setTimestamp());}
        } else {
            args.shift();
            let images = [];
            if (message.attachments.size > 1) {
                Array.from(message.attachments.keys()).forEach(i => images.push(message.attachments.get(i).url));
            } else {
                let tempchar = message.attachments.size
                    ? message.attachments.first().url
                    : await ask(message, `Please paste the image or a link to the image you'd like to add to **${ch.name}**.`, 60000, false, true);
                if (!tempchar) {return;}
                args = tempchar.split(/\s+/g);
                images.push(args.join(" "));
            }
            let f;
            images.forEach(img => {if (!img.match(/^https:\/\/(?:[\w\-].?)+[\/\w\-%()_]+\.(?:png|jpg|jpeg|gif|webp)$/gm)) {f = true; return message.channel.send("I don't think that's an image. Try again?");}})
            if (f) {return;}
            if (images.length === 1) {
                let img = images[0];
                if (!queue) {
                    ch.images.push(img);
                    ch.markModified('images');
                    ch.save();
                }
                client.guilds.fetch('762707532417335296').then(g => g.channels.cache.get('932177850239422494').send({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setAuthor({name: message.author.username, iconURL: message.author.displayAvatarURL()})
                            .setTitle(`New Anime Image ${queue ? "Submitted" : "Added"}`)
                            .setDescription(`For **${ch.name}**`)
                            .setThumbnail(ch.thumbnail)
                            .setImage(img)
                            .setColor('c375f0')
                            .setTimestamp()
                            .setFooter({text: "Natsuki"})
                    ], content: queue ? '<@330547934951112705>' : undefined
                }).catch(() => {})).catch(() => {});
                return message.channel.send(`Anime image ${queue ? "submitted" : "added"} to **${ch.name}**.`);
            } else {
                if (!queue) {
                    images.forEach(img => ch.images.push(img));
                    ch.markModified('images');
                    ch.save();
                }
                client.guilds.fetch('762707532417335296').then(g => g.channels.cache.get('932177850239422494').send({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setAuthor({name: message.author.username, iconURL: message.author.displayAvatarURL()})
                            .setTitle(`New Anime Images ${queue ? "Submitted" : "Added"}`)
                            .setDescription(`For **${ch.name}**`)
                            .addField("Images", images.map(img => `${img}\n`).join(""))
                            .setThumbnail(ch.thumbnail)
                            .setColor('c375f0')
                            .setTimestamp()
                            .setFooter({text: "Natsuki"})
                    ], content: queue ? '<@330547934951112705>' : undefined
                }).catch(() => {})).catch(() => {});
                return message.channel.send(`Anime images (${images.length}) ${queue ? "submitted" : "added"} to **${ch.name}**.`);
            }
        }
    }
};