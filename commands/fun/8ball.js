const Discord = require("discord.js");

module.exports = {
    name: "8ball",
    aliases: ["8b"],
    help: new Discord.MessageEmbed()
        .setTitle("Help -> 8ball")
        .setDescription("Gives you moral support, decides if you really do want that third taco, or helps you decide on your existential crisis. Answers come with an accuracy guarantee of 0%!")
        .addField("Syntax", "`8ball <question>`"),
    meta: {
        category: 'Fun',
        description: "Gives you moral support, decides if you really do want that third taco, or helps you decide on your existential crisis. Answers come with an accuracy guarantee of 0%!",
        syntax: '`8ball <question>`',
        extra: null
    },
    execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}8ball <question>\``);}
        let question = args.join(" ");
        if (question.length > 230) {return message.reply("Listen, I'm no fortune-teller. I can't help you with a question that long!");}

        let responses = [
            /*Positive Responses*/ "Yes!", "I think so", "Possibly", "Certainly", "Definitely", "Absolutely", "Sure!", "Most Likely", "I believe so", "If you're asking for my honest opinion... yes"
            /*Negative Responses*/ ,"No!", "I don't think so", "Probably not", "Impossible", "Nope", "Absolutely *not*", "Nah", "Doubt it", "I don't believe so", "If you're asking for my honest opinion... no"
            /*Neutral Responses */ ,"Maybe", "I'm not sure", "I'll think about it", "Uhh Natsuki isn't here right now. I can take a message?", "I'm sure if you look deep within your heart, which is currently all over that tree, you'll find the answer", "I mean, if you think so...", "I don't have an opinion on that.", "I'll choose to remain silent."
        ];
        let name = message.guild ? message.member.displayName : message.author.username;

        return message.reply({embeds: [new Discord.MessageEmbed()
            .setAuthor("8ball Question", message.author.avatarURL())
            .setDescription("**Question:** " + question + "\n**Answer:** " + responses[Math.floor(Math.random() * responses.length)])
            .setColor("c375f0")
            .setFooter(`Asked by ${name} | Natsuki`)
            .setTimestamp()]}
        );
    }
};