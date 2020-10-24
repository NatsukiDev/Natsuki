import {TagFilter} from "../util/tagfilter";
import {Tag} from "../util/tag";

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
            if (!tu || tu.staff) {
                await message.channel.send("Since you aren't a Natsuki Staff member, this anime will be __submitted__ for reviewal!");
                queue = true;
            }
            let options = new TagFilter([
                new Tag(['ask', 'question'], 'ask', 'toggle'),
                new Tag(['title', 't', 'name', 'n'], 'name', 'append'),
                new Tag(['description', 'desc', 'd', 'plot', 'p'], 'plot', 'append')
                //new Tag([''])
            ]);
        }
    }
};