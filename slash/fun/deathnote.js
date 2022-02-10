const Discord = require('discord.js');
const {SlashCommand} = require('../../util/slash');
const {SlashCommandBuilder} = require('@discordjs/builders');

const moment = require("moment");
const VC = require("../../models/vscount");



const deaths = [
    "watching too much anime", "an overdose of waifus", "Hypotakunemia", "trying to self-isekai",
    "Bass:tm:", "cranking the music just a little too loud", "trying to swim in lava",
    "Despacito", "something really cliche and unoriginal", "'shrooms",
    "clicking 'I agree' without reading the Terms of Service", "alchemy", "rusty spoons",
    "picking the wrong waifu", "body pillows", "fur-con", "something to do with lamb sauce",
    "grandma's cookies", "trying to get cat ears", "not reading the assembly instructions for that ikea furniture",
    "the wrong kind of coke", "getting cancelled irl", "getting their credit card declined",
    "finishing the last episode", "posting memes in #general", "stepping on a lego", "stubbing their toe",
    "fork in toaster", "toasterbath", "signing this book without reading the cover", "being Kirby's dinner"
]; // a list of preset death methods that can occur

const before = [
    "A name is being written...", "Someone will perish soon...", "A body is *about* to be discovered...",
    "{w} is scribbling something in their notebook...", "\*Manical laughter echoes around you*...",
    "{w} laughs maniacally..."
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



module.exports = (client) => {
    return new SlashCommand('deathnote', client,
        new SlashCommandBuilder()
            .setName('deathnote')
            .setDescription("Write someone's name in the death note and see for yourself if it's the real deal...")
            .addUserOption(option => {
                return option.setName("victim")
                    .setDescription("The person to write in your note")
                    .setRequired(true);
            })
            .addStringOption(option => option
                .setName("death-method")
                .setDescription("Decide for yourself how you want the person to die")
            ),

        async (client, interaction, guild, prefix) => {
            if (!guild) {return interaction.reply("Unfortunately, this is a **guild-only** command!");}
            let user = interaction.options.getUser('victim');
            let member = interaction.guild.members.cache.get(user.id);
            if (!user) {return interaction.reply("Looks like you didn't provide someone to write in the deathnote!");}
            if (user.id === interaction.user.id) {return interaction.reply("Hehe I won't let you write your own name in the notebook! Just leave it somewhere for a few days and someone else will take it. Maybe they'll write your name...");} // users can't user themselves
            if (user.id === client.user.id) {return interaction.reply("You can't kill me! Little did you know, I'm actually a death god!");}
            if (user.bot) {return interaction.reply("As a bot, I simply cannot let you attempt to kill another fellow bot!");}

            let reptype = responses[Object.keys(responses)[Math.floor(Math.random() * Object.keys(responses).length)]]; // report type
            let title = reptype.titles[Math.floor(Math.random() * reptype.titles.length)];

            let death = interaction.options.getString('death-method') || deaths[Math.floor(Math.random() * deaths.length)]; //kill method
            if (death.length > 750) {return interaction.reply("I'd rather you didn't try to fill the death note with a 7-page double-spaced essay in Times New Roman containing an advanced trajectory theorem on the death of your poor target.");}

            let victim = member.displayName;
            let killer = interaction.guild.members.cache.get(interaction.user.id);

            let pretext = before[Math.floor(Math.random() * before.length)].replace(/{w}/g, killer.displayName);

            let note = await interaction.reply({embeds: [new Discord.MessageEmbed()
                .setDescription(pretext)
                .setColor('c375f0')
                .setFooter({text: "Natsuki", iconURL: client.user.displayAvatarURL()})
                .setTimestamp()
            ]});

            await require('../../util/wait')(2500);

            let text = reptype.texts[Math.floor(Math.random() * reptype.texts.length)]
                .replace(/{p}/g, victim) //{p} = victim
                .replace(/{pa}/g, victim.toLowerCase().endsWith('s') ? `${victim}'` : `${victim}'s`) //{pa} = victim but with a formatted apostrophe like "WubzyGD's"
                .replace(/{c}/g, death) // {c} = death method
                .replace(/{w}/g, killer.displayName) // {w} = killer or writer
                .replace(/{ds}/g, moment().format("h:mm a")); // {ds} = date small, basically just the time.
            // Create and format the kill text

            let dns;
            if (user && user.id) {
                dns = await VC.findOne({uid: interaction.user.id, countOf: 'dn'}) || new VC({uid: interaction.user.id, countOf: 'dn'});
                dns.against[user.id] = dns.against[user.id] ? dns.against[user.id] + 1 : 1;
                dns.total++;
                dns.markModified(`against.${user.id}`);
                dns.save();
            }

            let finalEmbed = new Discord.MessageEmbed()
                .setAuthor({name: title, iconURL: killer.displayAvatarURL()})
                .setDescription(`${text}${dns ? `\n\n_Their name is in your deathnote **${dns.against[user.id] === 1 ? 'once' : `${dns.against[user.id]} times`}.**_` : ''}`)
                .setColor('c375f0')
                .setFooter({text: `Natsuki${dns ? ` | ${dns.total} name${dns.total === 1 ? ' has been' : 's'} written in your deathnote!` : ''}`})
                .setTimestamp();

            if (user) {finalEmbed.setThumbnail(member.displayAvatarURL({size: 1024}));}

            return interaction.editReply({embeds: [finalEmbed]});
        }
    );
};