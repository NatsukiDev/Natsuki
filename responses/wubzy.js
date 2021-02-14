const Discord = require('discord.js');

module.exports = {
    name: "decide",
    help: new Discord.MessageEmbed()
        .setTitle("Help -> ")
        .setDescription("")
        .addField("Syntax", "``"),
    async condition (message, msg, args, cmd, prefix, mention, client) {return message.author.id === "330547934951112705"},
    async execute(message, msg, args, cmd, prefix, mention, client) {
        const inc = m => msg.includes(m);
        const is = m => msg.trim() === m;
        function incl(ml) {let tm; for (tm of ml) {if (inc(tm)) {return true;}}}

        if (incl(["thanks natsuki", "thank you natsuki", "ty natsuki"])) {
            const r = ["Anytime!", "Anything for my creator!", "I hope I was at least a little bit helpful!",
            ":P Happy to help!", "You're welcome, Wubzy!", "Always happy to help you, Wubz",
            "I do take tips :D"];
            return message.channel.send(r[Math.floor(Math.random() * r.length)]);
        }

        if (is("❤")) {
            let m = message.channel.messages.fetch({limit: 2}).then(mm => mm.first());
            console.log(m);
            if (m.author.id === client.user.id) {return message.channel.send(":heart:");}
        }
    }
};