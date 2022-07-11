const Discord = require('discord.js');

const {Tag} = require('../../util/tag');
const {TagFilter} = require('../../util/tagfilter');

module.exports = {
    name: "choose",
    aliases: ['po', 'pick', 'pickone', 'chooseone'],
    meta: {
        category: 'Utility',
        description: "Feeling indecisive? Have Natsuki choose for you!",
        syntax: '`choose <option> <option> [option] [etc...] ` OR `choose -option option that has spaces -o another one -choice another one -o anotherrr`',
        extra: null
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Choosing")
        .setDescription("Have Natsuki choose for you.")
        .addField("Usage", "All choices are done with a space. Or, you can use tag syntax to have options with spaces")
        .addField("Syntax", "`choose <option> <option> [option] [etc...] ` OR `choose -option option that has spaces -o another one -choice another one -o anotherrr`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}choose <option> <option> [option] [etc...] \` OR \`choose -option option that has spaces -o another one -choice another one -o anotherrr\``);}
        const options = new TagFilter([
            new Tag(['o', 'option', 'choice', 'c', 'ch'], 'options', 'listAppend')
        ]).test(args.join(" "));
        let choices = [];
        choices = options && options.options && options.options.length ? options.options : args;
        let prer = ["Hmmm, how about", "I pick", "I choose", "And the result is...\\*drumroll*..."];
        return message.channel.send(`${prer[Math.floor(Math.random() * prer.length)]} "${choices[Math.floor(Math.random() * choices.length)]}"`);
    }
};