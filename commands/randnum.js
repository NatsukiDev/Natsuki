const Discord = require('discord.js');

module.exports = {
    name: "randnum",
    aliases: ['rn', 'randnumber', 'randomnum', 'randomnumber'],
    meta: {
        category: "",
        perms: "",
        staff: false,
        vip: "",
        serverPerms: [],
        writtenBy: "",
        serverOnly: false
    },
    tags: [],
    help: new Discord.MessageEmbed()
    .setTitle("Help -> Random Numbers")
    .setDescription("Generates a Random Number in the specified range.")
    .addField("Syntax", "`randnum <min> <max> [count]`"),
    meta: {
        category: 'Utility',
        description: "Generate a random number... or a lot of them. It's up to you, really.",
        syntax: '`randnum <min> <max> [count]`',
        extra: null
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}randnum <min> <max> [count]\``);}
        if (args.length < 2) {return message.channel.send("You have to specify two numbers");}
        if (![args[0], args[1]].forEach(x => {if (isNaN(Number(x))) {return false;}})) {return message.channel.send("One of your numbers was not actually a number!");}
        if (![args[0], args[1]].forEach(x => {if (Number(x) < 0 || Number(x) > 10000) {return false;}})) {return message.channel.send("Your number must be positive and less than 10,000");}
        let nums = Number(args[0]) > Number(args[1]) ? [Number(args[1]), Number(args[0])] : [Number(args[0]), Number(args[1])];
        let count;
        if (args[2]) {
            if (isNaN(Number(args[2]))) {return message.channel.send("You must use a number for your count.");}
            count = Number(args[2]);
            if (count < 1 || count > 10) {return message.channel.send("You have to have between 1 and 10 for your count.");}
        }
        count = count ? count : 1;
        let res = '';
        for (let i=0; i<count;i++) {
            res += `${1 + 1}. \`${Math.floor(Math.random() * (nums[1] - nums[0] + 1) + nums[0])}\`\n`;
        }
        return message.channel.send(new Discord.MessageEmbed()
            .setTitle(`Random Number${num.length > 1 ? 's' : ''}`)
            .setDescription(res)
            .setColor('c375f0')
            .setFooter('Natsuki', client.user.avatarURL())
            .setTimestamp()
        );
    }
};