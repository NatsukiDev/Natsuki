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
        const inc = (m,s) => s ? s.toLowerCase().includes(m) : msg.includes(m);
        const is = m => msg.trim() === m;
        function incl(ml, s) {let tm; for (tm of ml) {if (inc(tm, s)) {return true;}}}

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
            if (to || incl(['ye', 'mhm', 'sure'], sconf)) {
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
            } else {return message.channel.send("Oh... well, goodnight! Let me know when you're up, this castle gets so lonely when you're asleep");}
        }

        if (inc('anime') && incl(['we binging', 'am i watching', 'should i watch', 'to watch', 'we watching', "am i gonna watch", "are we gonna watch"]) && inc("natsuki")) {
            async function q() {
                let sconf;
                const r1 = ["Hmm, you could", "You could always", "How about you", "You can", "Tough question. Maybe", "Glad you asked! You should", "Oh I know the perfect one:"];
                const r2 = ["rebinge Arifureta", "watch ~~tits the anime~~ DxD :wink:", "do Fairy Tail", "sob to Violet Evergarden again", "see Tokyo Ghoul for the millionth time", "watch ReZero", "finally start Attack on Titan Season 4",
                "watch quintessential quintuplets", "have your heart wrenched out by Senko-San again", "finish Bleach", "finish Akame ga Kill", "start Guren Lagann", "finish Darling in the Franxx again",
                "watch Akashic Records again", "finish Rent-a-Girlfriend", "rebinge Kabaneri and question reality", "rewatch Code Geass", "do a thing called getting the hell off anime and doing something productive with your life!"];
                message.channel.send(`${r1[Math.floor(Math.random() * r1.length)]} ${r2[Math.floor(Math.random() * r2.length)]}`);
                try {sconf = await message.channel.awaitMessages(m => m.author.id === "330547934951112705", {time: 15000, errors: ['time'], max: 1});}
                catch {message.channel.send("Oh, I guess he liked the idea that much and just left..."); return 2;}
                sconf = sconf.first().content.trim().toLowerCase();
                if (incl(["bet", "i like", "yes", "sure", "fine", "alright", "ok"], sconf)) {
                    const r3 = ["Glad you liked the idea!", "Smart move!", "Hehe I'm good at reccomendations, aren't I?", "Yay I love it when Wubby likes my suggestions"];
                    message.channel.send(`${r3[Math.floor(Math.random() * r3.length)]} Want me to set your status?`);
                    return 1;
                } else {
                    const r3 = ["Oh, my bad.", "Sorry bout that. Lemme try again", "Bad idea? Yeah I didn't think it was that good of an idea anyways.", "Uhhhh- pfff I was just joking anyways"];
                    message.channel.send(r3[Math.floor(Math.random() * r3.length)]);
                    return await q();
                }
            }
            let res = await q();
            if (res === 2) {return;}
            let to = false; let sconf;
            try {sconf = await message.channel.awaitMessages(m => m.author.id === "330547934951112705", {time: 15000, errors: ['time'], max: 1});}
            catch {message.channel.send("Guess my recommendations are just that good that he left... Don't mind me while I set his status anyways"); to = true;}
            if (sconf) {sconf = sconf.first().content.trim().toLowerCase();}
            if (to || incl(['ye', 'mhm', 'sure'], sconf)) {
                let w = await UserData.findOne({uid: message.author.id});
                w.statusclearmode = 'manual';
                w.statusmsg = "Watching anime (that I personally recommended him because I'm cool so leave poor Wubzy be!)";
                w.statussetat = new Date();
                let tempDate = new Date();
                w.statusclearat = tempDate.setHours(tempDate.getHours() + 12);
                w.statustype = 'dnd';
                w.save();
                if (!to) {message.channel.send("I set your status for you so you can get some binging in! Let me know if your anime is any good, I've been looking for a good watch myself.");}
                return;
            } else {return message.channel.send("Watching anime in incognito are we? I gotcha :p");}
        }
    }
};