const {TagFilter} = require("../util/tagfilter");
const {Tag} = require ("../util/tag");

const Discord = require('discord.js');
const UserData = require('../models/user');
const AniData = require('../models/anime');

module.exports = {
    name: "anime",
    aliases: ['ani', 'an'],
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Anime")
        .setDescription("View and find anime in our huge list of anime!")
        .addField("Syntax", "`anime <>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}anime <>\``);}
        let queue = false;
        if (['a', 'add', 'n', 'new'].includes(args[0])) {
            let tu = await UserData.findOne({uid: message.author.id});
            if (!tu || !tu.staff) {
                await message.channel.send("Since you aren't a Natsuki Staff member, this anime will be __submitted__ for reviewal!");
                queue = true;
            }
            let options = new TagFilter([
                new Tag(['ask', 'question'], 'ask', 'toggle'),
                new Tag(['title', 't', 'name', 'n'], 'name', 'append'),
                new Tag(['japname', 'japanesename', 'jn'], 'japname', 'listAppend'),
                new Tag(['description', 'desc', 'd', 'plot', 'p'], 'plot', 'append'),
                new Tag(['pub', 'pubs', 'publishers', 'publisher', 'pb'], 'publishers', 'listAppend'),
                new Tag(['stud', 's', 'studio', 'studs', 'studios'], 'studios', 'listAppend'),
                new Tag(['began', 'airstart', 'as'], 'airStartDate', 'append'),
                new Tag(['ended', 'airend', 'ae'], 'airEndDate', 'append'),
                new Tag(['iscomplete', 'completed', 'ic'], 'isComplete', 'toggle'),
                new Tag(['seasons', 'sns'], 'seasons', 'append'),
                new Tag(['episodes', 'es'], 'episodes', 'append'),
                new Tag(['genres', 'g'], 'genres', 'listAppend'),
                new Tag(['tags', 'ta', 'tgs', 'tg', 'tag'], 'tags', 'listAppend'),
                new Tag(['cs', 'characters', 'chars', 'chs'], 'characters', 'listAppend'),
                new Tag(['streams', 'streamat', 'sa'], 'streamAt', 'listAppend')
            ]).test(args.join(' '));

            var foptions = {};
            let option; for (option of Object.keys(options)) {
                if (Array.isArray(options[option])) {
                    let s = '';
                    let data;
                    for (data of options[option]) {
                        s += data;
                        s += options[option].indexOf(data) < (options[option].length - 1) ? ', ' : '';
                    }
                    foptions[option] = s;
                }
            }

            message.channel.send(new Discord.MessageEmbed()
                .setTitle(`New Anime -> ${options.name}`)
                .setDescription(`${queue ? 'Requested' : 'Added'} by ${message.guild ? message.member.displayName : message.author.username}`)
                .addField('Info', `**Name:** ${options.name}\n**Japanese Name:** ${options.japname}\n\n**Publishers:** ${foptions.publishers}\n**Studios:** ${foptions.studios}`)
                .addField('Length', `**# of Seasons:** ${options.seasons}\n**# of Episodes:** ${options.episodes}`)
                .addField('Airing', `**Began:** ${options.airStartDate}\n**Ended:** ${options.isComplete ? options.airEndDate : 'This anime is still airing!'}`)
                .addField('Other', `**Genre(s):** ${foptions.genres}\n**Tags:** ${foptions.tags}\n**Characters:** ${foptions.characters}\n**Stream this at:** ${foptions.streamAt}`)
                .setColor("c375f0")
                .setFooter('Natsuki', client.user.avatarURL())
                .setTimestamp()
            );
        }
    }
};