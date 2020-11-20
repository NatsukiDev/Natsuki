const Discord = require('discord.js');
const SS = require('../models/secretsanta');

const ask = require('../util/ask');

module.exports = {
    name: "secretsanta",
    aliases: ['ss'],
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Secret Santa")
        .setDescription("Create a secret santa for all of your friends or for your server! Whether you celebrate the holidays or not, this can still be loads of fun!")
        .addField("Syntax", "``"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}\``);}
        if (['start', 'create', 'new', 'c', 'n', 's'].includes(args[0].toLowerCase())) {
            function clearDM() {client.misc.activeDMs.delete(message.author.id);}
            if (client.misc.activeDMs.has(message.author.id)) {return message.reply("I'm already asking you questions in DM for a separate command! Finish that command before using this one.");}
            client.misc.activeDMs.set(message.author.id, 'secretsanta-make');
            let mesg = await message.author.send("I'll be asking you a few questions here about how you want your Secret Santa to go! You can simply ignore the messages for a few minutes to cancel the process.").catch(() => {message.reply("Please open your DMs so I can ask you some questions!");});
            let dmch = mesg.channel;

            let conf = await ask(mesg, "This secret santa will be tied to your account, and you will be considered the host. Is this okay?", 60000, true); if (!conf) {return clearDM();}
            if (['n', 'no'].includes(conf.trim().toLowerCase())) {clearDM(); return dmch.send("Oh, alrighty! Have the person who wants to be the host execute this same command.");}
            if (!['yes', 'ye', 'y', 'sure'].includes(conf.trim().toLowerCase())) {clearDM(); return dmch.send("Please specify yes or no you weeb!");}

            let start = await ask(mesg, "When will you begin the secret santa? (You'll start it manually, so don't worry about formatting.", 60000, true); if (!start) {return clearDM();}
            if (start.length > 150) {clearDM(); return dmch.send("Heya there, just a few words, please! I don't wanna have to read out an essay about when it's starting to all the people that want to hear about your secret santa!");}

            let end = await ask(mesg, "When will you end the secret santa? (You'll also end it manually.)", 60000, true); if (!end) {return clearDM();}
            if (end.length > 150) {clearDM(); return dmch.send("Heya there, just a few words, please! I don't wanna have to read out an essay about when it's ending to all the people that want to hear about your secret santa!");}

            let spend = await ask(mesg, "What is your maximum and minimum spending? This is useful so that everyone gets an equal gift or gifts. This will be shown to the people that buy their gifts.", 360000, true); if (!spend) {return clearDM();}
            if (spend.length > 500) {clearDM(); return dmch.send("Mate, this is not a dissertation! Let's keep it under 500 characters, please!");}

            let anon = await ask(mesg, "Will you be keeping this secret santa totally anonymous, or will you let the gift recipients know who their gifters are when they are opened? Type \"yes\" if you will be keeping it anonymous, and \"no\" otherwise.", 360000, true); if (!anon) {return clearDM();}
            if (['n', 'no'].includes(anon.trim().toLowerCase())) {anon = false;}
            else if (['yes', 'ye', 'y', 'sure'].includes(anon.trim().toLowerCase())) {anon = true;}
            else {clearDM(); return dmch.send("Please specify yes or no you weeb!");}

            let info = await ask(mesg, "What information would you like me to ask joining members to provide when they join your secret santa? (Whatever you type will be shown directly to them when.)", 360000, true); if (!info) {return clearDM();}
            if (info.length > 750) {clearDM(); return dmch.send("Let's keep it under 750 characters, please.");}

            let notes = await ask(mesg, "Are there any other notes you'd like to add? If not, just write N/A or something of that nature.", 360000, true); if (!ask) {return clearDM();}
            if (notes.length > 500) {clearDM(); return dmch.send("Let's keep it under 500 characters, please.");}

            let fconf = await ask(mesg, "Would you like to continue and create the secret santa? By doing so, you agree that:\n-Natsuki and its developers are not responsible for anything financially-related to your secret santa\n-Anyone with your join code can join the secret santa\n-You are responsible for notifying your members of any changes or updates.\n-I am not responsible for any eggnog that may or may not be stolen from you by Wubzy. *for legal reasons this is a joke*\n\n-The answers you have submitted are what you want to use, as they cannot be changed.", 120000, true); if (!fconf) {return clearDM();}
            if (['n', 'no'].includes(conf.trim().toLowerCase())) {clearDM(); return dmch.send("Oh, yikes. Is it about the eggnog? Sorry about that hehe...");}
            if (!['yes', 'ye', 'y', 'sure'].includes(conf.trim().toLowerCase())) {clearDM(); return dmch.send("Please specify yes or no you weeb!");}

            let id;
            while (true) {
                id = require('../util/makeid')(6);
                let test = await SS.findOne({ssid: id});
                if (!test) {break;}
            }

            let tss = new SS({
                ssid: id,
                owner: message.author.id,
                start: start,
                end: end,
                anon: anon,
                spend: spend,
                info: info,
                notes: notes,
                members: [],
                started: false
            });
            tss.save();

            clearDM();
            return dmch.send(new Discord.MessageEmbed()
                .setTitle("Secret Santa Created!")
                .setDescription("Your Secret Santa has been completed! Have your members join by using `n?secretsanta join <ID>` where the ID is the ID displayed below. You can start your secret santa when you have at least 3 members with `n?secretsanta start <ID>`. If someone joins that you don't want in your secret santa, use `n?secretsanta kick <ID> <@member|userID>`. If you want to also participate, just join the same way as everyone else.")
                .setThumbnail(message.author.avatarURL({size: 1024}))
                .addField("ID", `\`${id}\``, true)
                .addField("Owner", message.author.username, true)
                .setColor("01bd2f")
                .setFooter("Natsuki", client.user.avatarURL())
                .setTimestamp()
            );
        }

        if (['j', 'join'].includes(args[0].toLowerCase())) {
            if (!args[1] || args[1].length !== 6) {return message.channel.send("You must provide a 6-digit join code! Ask the host to copy it and send it to you.");}

            let tss = await SS.findOne({ssid: args[1]});
            if (!tss) {return message.channel.send("A secret santa with that join code does not exist!");}
            if (tss.started) {return message.channel.send("That secret santa has already started.");}
            let min = false; let m; for (m of tss.members) {if (m.id === message.author.id) {min = true;}}
            if (tss.members && min) {return message.channel.send("You're already in that secret santa!");}

            function clearDM() {client.misc.activeDMs.delete(message.author.id);}
            if (client.misc.activeDMs.has(message.author.id)) {return message.reply("I'm already asking you questions in DM for a separate command! Finish that command before using this one.");}
            client.misc.activeDMs.set(message.author.id, 'secretsanta-join');

            let mesg = await message.author.send("I'll be asking you a few questions here about you and what you want! You can simply ignore the messages for a few minutes to cancel the process.").catch(() => {message.reply("Please open your DMs so I can ask you some questions!");});
            let dmch = mesg.channel;

            let o = await client.users.fetch(tss.owner);

            await dmch.send(new Discord.MessageEmbed()
                .setTitle("This Secret Santa!")
                .setDescription("This is the one you're trying to join!")
                .addField("Start", tss.start)
                .addField("End", tss.end)
                .addField("Spending", tss.spend)
                .addField("Notes", tss.notes)
                .addField("Anonymous Gifters", tss.anon ? "Yes" : "No")
                .addField("ID", `\`${tss.ssid}\``, true)
                .addField("Owner", o.username, true)
                .addField("Members", tss.members ? tss.members.length : 0, true)
                .setColor("01bd2f")
                .setFooter("Natsuki", client.user.avatarURL())
                .setTimestamp()
            );

            let name = await ask(mesg, "What is your name? This can be seen by everyone in the secret santa.", 60000, true); if (!name) {return clearDM();}
            if (name.length > 50) {clearDM(); return dmch.send("Maybe just the *first* name? I doubt it's over 50 characters.");}

            await dmch.send("This is the information the host has asked you to provide:");
            let info = await ask(mesg, tss.info, 600000, true); if (!info) {return clearDM();}
            if (info.length > 750) {clearDM(); return dmch.send("Let's keep that under 750 characters. No need to put your entire Christmas list on there :smirk:");}

            let conf = await ask(mesg, "Before we finish, do you agree to the following things:\n-I, Natsuki, and my developers, are not responsible for anything financially-related to your Secret Santa\n-You should contact the host if you have questions\n-These answers you gave are final and will be seen by the person who draws you.\n-You *need* to have your DMs open so that I can reach you when drawing time comes!", 120000, true);
            if (['n', 'no'].includes(conf.trim().toLowerCase())) {clearDM(); return dmch.send("Alrighty! I've discarded your responses :P");}
            if (!['yes', 'ye', 'y', 'sure'].includes(conf.trim().toLowerCase())) {clearDM(); return dmch.send("Please specify yes or no you weeb!");}

            let tssmembers = tss.members ? tss.members : {};
            tssmembers.push({id: message.author.id, name: name, info: info});
            tss.members = tssmembers;
            tss.save();

            clearDM();

            await o.send(`${message.author.username} has joined your Secret Santa! (Code: \`${tss.ssid}\` in case you have more than one)`);
            return dmch.send("All done! You've now joined.");
        }

        if (['start'].includes(args[0])) {
            if (!args[1] || args[1].length !== 6) {return message.channel.send("You must specify the join code/ID to your Secret Santa!");}
            let tss = await SS.findOne({ssid: args[1]});
            if (!tss) {return message.channel.send("That Secret Santa doesn't exist; your code is invalid!");}
            if (tss.owner !== message.author.id) {return message.channel.send("You must be the host to do that!");}
            if (tss.started) {return message.channel.send("Your Secret Santa is already started!");}
            if (tss.members.length < 3) {return message.channel.send("You need to have at least 3 members in order to start.");}

            let dm = []; let cm; let rm; let rm2;
            while (true) {
                rm = tss.members[Math.floor(Math.random() * tss.members.length)];
                rm2 = tss.members[Math.floor(Math.random() * tss.members.length)];
                if (rm.id !== rm2.id) {
                    dm.push([rm, rm2]);
                    break;
                }
            }
            let i; for (i=0;i<tss.members.length;i++) {
                cm = tss.members[i];
                let c = false;
                let t; for (t of dm) {if (t[0].id === cm.id) {c = true;}}
                if (!c) {
                    dm.push([dm[dm.length - 1], cm]);
                }
            }
            let mg; let asg = []; for (mg of dm) {asg.push({name: mg[0].id, assignedTo: mg[1].id});}
            tss.assignments = asg;
        }
    }
};