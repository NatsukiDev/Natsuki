const Discord = require('discord.js');

const UserData = require('../../models/user');
const AniData = require('../../models/anime');

const ask = require('../../util/ask');
const ans = require('../../util/anime/anisearch');
const {Pagination} = require('../../util/pagination');

module.exports = {
    name: "animenick",
    aliases: ['aninick', 'an', 'animenickname', 'ann', 'aninn'],
    meta: {
        category: 'Anime',
        description: "Add a nickname/alternate name to an anime",
        syntax: '`animenick <anime>`',
        extra: null
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Anime Nicknames")
        .setDescription("Add a nickname or alternate name to an anime that it can later be found by.")
        .addField("Notice", "You'll first need to state the anime name, then I'll ask you for the alternate name you want to add. Don't send it in the same message as the command. It won't work.")
        .addField("Syntax", "`animenick <anime>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args[0]) {
            let tempchar = await ask(message, "What anime would you like to add to add an alternate name to?", 60000, false, true);
            if (!tempchar) {return;}
            args = tempchar.split(/\s+/g);
        }
        let asr = await ans(message, client, args.join(" ").trim().toLowerCase(), -700, 0);
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
            message.channel.send("This alternate name will be __submitted__ for reviewal.");
            queue = true;
        }
        let ch = await AniData.findOne({id: fn});
        if (!ch.altNames) {ch.altNames = [];}
        let nn = await ask(message, `What nickname would you like to add to ${ch.name}?`, 60000, false, true);
        if (!nn) {return;}
        if (ch.altNames.map(nickn => nickn.toLowerCase()).includes(nn.toLowerCase())) {return message.channel.send(`Looks like **${ch.name}** already has the nickname "${nn}".`);}
        if (!queue) {
            ch.altNames.push(nn);
            ch.markModified('altNames');
            ch.save();
            client.misc.cache.anime.set(nn, ch.id);
        }
        client.guilds.fetch('762707532417335296').then(g => g.channels.cache.get('932177814638186516').send({
            embeds: [
                new Discord.MessageEmbed()
                    .setAuthor({name: message.author.username, iconURL: message.author.displayAvatarURL()})
                    .setTitle(`New Anime Alt Name ${queue ? "Submitted" : "Added"}`)
                    .setDescription(`For **${ch.name}** | \`${ch.id}\``)
                    .addField("Name", nn)
                    .setThumbnail(ch.thumbnail)
                    .setColor('c375f0')
                    .setTimestamp()
                    .setFooter({text: "Natsuki"})
            ], content: queue ? '<@330547934951112705>' : undefined
        }).catch(() => {})).catch(() => {});
        return message.channel.send(`Anime alt name ${queue ? "submitted" : "added"}.`);
    }
};