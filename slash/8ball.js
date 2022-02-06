const {SlashCommand} = require('../util/slash');
const {SlashCommandBuilder} = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = (client) => {
    return new SlashCommand('8ball', client,
        new SlashCommandBuilder()
            .setName('8ball')
            .setDescription("Get a totally accurate and well-thought-out answer to your life's troubles.")
            .addStringOption(option => {
                return option.setName("question")
                    .setDescription("Your existential crisis.")
                    .setRequired(true);
            })
            .addBooleanOption(option => {
                return option.setName("send")
                    .setDescription("Should I send the answer to the channel?");
            }),

        async (client, interaction) => {
            const responses = [
                /*Positive Responses*/ "Yes!", "I think so", "Possibly", "Certainly", "Definitely", "Absolutely", "Sure!", "Most Likely", "I believe so", "If you're asking for my honest opinion... yes"
                /*Negative Responses*/ ,"No!", "I don't think so", "Probably not", "Impossible", "Nope", "Absolutely *not*", "Nah", "Doubt it", "I don't believe so", "If you're asking for my honest opinion... no"
                /*Neutral Responses */ ,"Maybe", "I'm not sure", "I'll think about it", "Uhh Natsuki isn't here right now. I can take a message?", "I'm sure if you look deep within your heart, which is currently all over that tree, you'll find the answer", "I mean, if you think so...", "I don't have an opinion on that.", "I'll choose to remain silent."
            ];
            return await interaction.reply({embeds: [new Discord.MessageEmbed()
                .setAuthor({name: "8ball Question", iconURL: interaction.user.displayAvatarURL()})
                .setDescription("**Question:** " + interaction.options.getString('question') + "\n**Answer:** " + responses[Math.floor(Math.random() * responses.length)])
                .setColor("c375f0")
                .setFooter({text: `Asked by ${interaction.guild ? interaction.member.displayName : interaction.user.username} | Natsuki`})
                .setTimestamp()
            ], ephemeral: !interaction.options.getBoolean("send")});
        }
    );
};