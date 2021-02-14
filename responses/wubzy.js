const Discord = require('discord.js');

const UserData = require('../models/user');

const ask = require('../util/ask');

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

        if (incl(['gn natsuki', 'goodnight natsuki', 'night natsuki'])) {
            const r = ["Goodnight! :)", "Night Wubbo. Hope you weren't up too late working on me!", "Sleep well!", "Yeah, I was just headed to bed, too.",
                "<:awoo:750131415693393950> glad you're getting some sleep ^^ ~"];
            message.channel.send(`${r[Math.floor(Math.random() * r.length)]} Want me to set your status before you go off?`);
            let to = false; let sconf;
            try {sconf = await message.channel.awaitMessages(m => m.author.id === "330547934951112705", {time: 15000, errors: ['time'], max: 1});}
            catch {message.channel.send("Oh, I guess he already went to bed, huh? I'll just... set his status anyways-"); to = true;}
            if (sconf) {sconf = sconf.first().content.trim().toLowerCase();}
            if (to || ['sure', 'ye', 'mhm'].includes(sconf)) {
                let w = await UserData.findOne({uid: message.author.id});
                w.statusclearmode = 'manual';
                w.statusmsg = "Sleeping <a:rollingcat:766362862976892958>";
                w.statussetat = new Date();
                let tempDate = new Date();
                w.statusclearat = tempDate.setHours(tempDate.getHours() + 12);
                w.statustype = 'dnd';
                w.save();
                if (!to) {message.channel.send("I set your status for you so you can get some sleep! Message me when you're up - I get lonely when you sleep ;-;");}
                return;
            }
        }
    }
};