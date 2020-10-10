const Discord = require('discord.js');
const moment = require('moment');

const deaths = [
    "watching too much anime", "an overdose of waifus", "Hypotakunemia", "trying to self-isekai",
    "Bass:tm:", "cranking the music just a little too loud", "trying to swim in lava", "an unknown cause",
    "Despacito", "something really cliche and unoriginal", "'shrooms", 
    "clicking 'I agree' without reading the Terms of Service", "alchemy", "rusty spoons",
    "picking the wrong waifu", "body pillows", "fur-con", "something to do with lamb sauce",
    "grandma's cookies"
]; // a list of preset death methods that can occur

const before = [
    "A name is being written...", "Someone will perish soon...", "A body is *about* to be discovered...",
    "{p} is scribbling something in their notebook...", "\*Manical laughter echoes around you*...",
    "{p} laughs maniacally..."
]; // things it says before the response is sent

const responses = {
    /*an obj controlling the possible formats for the death note report*/
    news: {
        titles: ["Breaking News"],
        texts: [
            "This just in: **{p}** was found dead at **{ds}** today.\n\nAfter some investigation, the authorities ruled the cause of death to be **{c}**.",
            "We're now live at the crime scene where it is believed that **{p}** died because of **{c}**.",
            "Authorities are reporting what is believed to be another Kira case, where **{c}** has taken the life of **{p}**."
        ],
        images: [],
    }, // a news report of the dead body
    writes: {
        titles: ["Something sinister just happened", "A name has been written", "Fate has been changed"],
        texts: [
            "With a maniacal laugh, **{w}** writes \"**{p}**\" in their Death Note. And the cause of death? They've written **{c}**.",
            "**{w}** has sealed **{pa}** fate to die by **{c}**."
        ],
        images: []
    }, // "so-and-so writes blah blah blah's name in their death note"
    /*hasdied: {
        texts: [],
        images: []
    }, // "so-and-so has died by...",
    unserious: {
        texts: [],
        images: []
    } // other methods, mainly the un-serious or joking ones */
};

//responses.unserious.images = responses.hasdied.images;

module.exports = {
    name: "deathnote",
    aliases: ['dn'],
    help: new Discord.MessageEmbed()
    .setTitle("Help -> Death Note")
    .setDescription("Congratulations! You've picked up a death note. Write someone's name in it, and see for yourself if it's the real deal...")
    .addField("Syntax", "\`deathnote <@member> [method of death]\`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.reply("Unfortunately, this is a **guild-only** command!");}
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}deathnote <@member> [method of death]\``);}
        if (args[0] == "kill" || args[0] == "k") {args.shift();} // if someone adds in 'kill' it'll remove it and act like it wasn't there, proceeding as normal.
        if (!mention) {return message.reply("You have to write their name down in order to kill them! (In other words, please mention the user whose name you wish to write.)");}
        if (!args[0].trim().match(/^<@(?:\!?)\d+>$/)) {return message.reply("You have to mention someone!");}
        if (mention.id == message.author.id) {return message.reply("Hehe I won't let you write your own name in the notebook! Just leave it somewhere for a few days and someone else will take it. Maybe they'll write your name...");} // users can't mention themselves
        if (mention.id == client.user.id) {return message.reply("You can't kill me! Little did you know, I'm actually a death god!");}
        //TODO if bot is mentioned maybe

        let death = deaths[Math.floor(Math.random() * deaths.length)]; //kill method
        let reptype = responses[Object.keys(responses)[Math.floor(Math.random() * Object.keys(responses).length)]]; // report type
        let title = reptype.titles[Math.floor(Math.random() * reptype.titles.length)];
        let pretext = before[Math.floor(Math.random() * before.length)].replace(/{p}/g, message.member.displayName);

        let victim = message.mentions.members.first();
        let killer = message.member;

        let note = await message.channel.send(new Discord.MessageEmbed()
            .setDescription(pretext)
            .setColor('c375f0')
            .setFooter("Natsuki", client.user.avatarURL())
            .setTimestamp()
        );

        await require('../util/wait')(2500);

        let text = reptype.texts[Math.floor(Math.random() * reptype.texts.length)]
        .replace(/{p}/g, victim.displayName) //{p} = victim
        .replace(/{pa}/g, victim.displayName.toLowerCase().endsWith('s') ? `${victim.displayName}'` : `${victim.displayName}'s`) //{pa} = victim but with a formatted apostrophe like "WubzyGD's"
        .replace(/{c}/g, death) // {c} = death method
        .replace(/{w}/g, killer.displayName) // {w} = killer or writer
        .replace(/{ds}/g, moment().format("h:mm a")); // {ds} = date small, basically just the time.
        // Create and format the kill text

        //TODO message before sending then edit that message i.e. "A name is being written..." then wait 5s

        return note.edit(new Discord.MessageEmbed()
            .setAuthor(title, message.author.avatarURL())
            .setThumbnail(mention.avatarURL({size: 1024}))
            .setDescription(text)
            .setColor('c375f0')
            .setFooter("Natsuki")
            .setTimestamp()
        );
    }
};