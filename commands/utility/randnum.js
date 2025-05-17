const Discord = require('discord.js');

module.exports = {
    name: "randnum",
    aliases: ['rn', 'randnumber', 'randomnum', 'randomnumber'],
    tags: [],
    help: new Discord.MessageEmbed()
    .setTitle("Help -> Random Numbers")
    .setDescription("Generates a Random Number in the specified range.")
    .addField("Syntax", `You can specify one number, in which case a number between 1 and that number we will be chosen: \`randnum <max>\`, or specify a min and max: \`randnum <min> <max> [count]\` - where \`count\` specifies how many separate random numbers you want.`),
    meta: {
        category: 'Utility',
        description: "Generate a random number... or a lot of them. It's up to you, really.",
        syntax: `\`randnum <max>\`, or specify a min and max: \`randnum <min> <max> [count]\``,
        extra: null,
        guildOnly: false
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: You can specify one number, in which case a number between 1 and that number we will be chosen: \`${prefix}randnum <max>\`, or specify a min and max: \`${prefix}randnum <min> <max> [count]\` - where \`count\` specifies how many separate random numbers you want.`);}
        let max = args[1] || args[0];
        let min = args[1] ? args[0] : "1";
        let count = args[2] || "1";
        let th = false;
        [max, min, count].forEach((x) => {
            if (!x.match(/^[\d\-]+$/)) {th = true; return message.channel.send("One of your numbers was not actually a number!");}
            if (x.length > 6) {th = true; return message.channel.send("One of your numbers was too large!");}
        });
        try {
            max = Number(max);
            min = Number(min);
            count = Number(count);
        } catch {th = true; return message.channel.send("There was an issue handling one of your numbers—make sure these are all valid!");}
        if (th) {return;}
        if (min > max) {return message.channel.send("Your min is greater than your max... how's that supposed to work?");}
        if (count > 25) {return message.channel.send("You can get up to 25 random numbers per usage. Discord gets angry when my messages get too large :3");}
        if (count < 1) {return message.channel.send("You want... less than one random number...? Sure thing, I'll get right on it...");}
        const rand = () => Math.floor(Math.random() * (max - min + 1)) + min;
        return message.channel.send({embeds: [new Discord.MessageEmbed()
                .setAuthor({name: `Random Number${client.utils.s(count)}`, iconURL: message.member ? message.member.displayAvatarURL({dynamic: true}) : message.author.displayAvatarURL({dynamic: true})})
                .setDescription(`**Between** ${min} and ${max}`)
                .addField("Result", count === 1
                    ? `${rand()}` //only one number
                    : count > 10 ? Array.apply(null, Array(count)).map(() => `\`${rand()}\``).join(", ") //compressed list for 10+ nums
                    : Array.apply(null, Array(count)).map((x, i) => `**#${i + 1}**. \`${rand()}\``).join('\n') //pretty list for < 10 but > 1 nums
                )
                .setColor('c375f0')
                .setFooter({text: "Natsuki"})
                .setTimestamp()
            ]
        })
    }
};