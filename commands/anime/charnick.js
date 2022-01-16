const Discord = require('discord.js');

const UserData = require('../../models/user');
const Char = require('../../models/char');

const ask = require('../../util/ask');
const chs = require('../../util/anime/charsearch');
const {Pagination} = require('../../util/pagination');

module.exports = {
    name: "charnick",
    aliases: ['chn', 'charnn', 'cnn'],
    meta: {
        category: 'Anime',
        description: "Add a nickname to a character",
        syntax: '`charnick <charName>`',
        extra: null
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Char Nickname Adding")
        .setDescription("Add a nickname to a character with this command. You will need to specify the name of the character first, then send the message, and after that, Natsuki will ask you for the nickname to add.")
        .addField("Notice", "This nickname will be submitted unless you are a member of Natsuki staff.")
        .addField("Syntax", "`charnick <charName>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args[0]) {
            let tempchar = await ask(message, "What character would you like to add to add a nickname to?", 60000, false, true);
            if (!tempchar) {return;}
            args = tempchar.split(/\s+/g);
        }
        let asr = await chs(message, client, args.join(" ").trim().toLowerCase(), -700, 0);
        let fn;
        if (asr === 0) {
            return message.channel.send("That search returned no results! Try again?");
        } else if (asr instanceof Pagination) {
            await asr.start({user: message.author.id, startPage: 1, endTime: 60000});
            await asr.message.react('✅');
            await message.channel.send("React with :white_check_mark: when you've found the character you want!");
            let arc;
            try {arc = await asr.message.awaitReactions({filter: (r) => ['✅', '⏹'].includes(r.emoji.name), max: 1, errors: ['time']});}
            catch {return message.reply("Looks like you didn't find the character you were looking for.");}
            collected = arc.first().emoji.name;
            if (collected === '✅') {
                fn = client.misc.cache.chars.get(asr.getCurrentPage().title.trim());
                asr.stop();
            }
            else {return message.reply("Looks like you didn't find the character you were looking for.");}
        } else {fn = asr.id;}
        let tu = await UserData.findOne({uid: message.author.id});
        let queue = false;
        if (!tu || !tu.staff) {
            message.channel.send("This nickname will be __submitted__ for reviewal.");
            queue = true;
        }
        let ch = await Char.findOne({id: fn});
        let nn = await ask(message, `What nickname would you like to add to ${ch.name}?`, 60000, false, true);
        if (!nn) {return;}
        if (ch.nicknames.map(nickn => nickn.toLowerCase()).includes(nn.toLowerCase())) {return message.channel.send(`Looks like **${ch.name}** already has the nickname "${nn}".`);}
        if (!queue) {
            ch.nicknames.push(nn);
            ch.markModified('nicknames');
            ch.save();
            client.misc.cache.chars.set(nn, ch.id);
        }
        client.guilds.fetch('762707532417335296').then(g => g.channels.cache.get('932177814638186516').send({
            embeds: [
                new Discord.MessageEmbed()
                    .setAuthor({name: message.author.username, iconURL: message.author.avatarURL()})
                    .setTitle(`New Character Nickname ${queue ? "Submitted" : "Added"}`)
                    .setDescription(`For **${ch.name}** | \`${ch.id}\` from ${client.misc.cache.animeID.get(ch.anime)}`)
                    .addField("Name", nn)
                    .setThumbnail(ch.thumbnail)
                    .setColor('c375f0')
                    .setTimestamp()
                    .setFooter({text: "Natsuki"})
            ], content: queue ? '<@330547934951112705>' : undefined
        }).catch(() => {})).catch(() => {});
        return message.channel.send(`Character nickname ${queue ? "submitted" : "added"}.`);
    }
};