const Discord = require('discord.js');

const ask = require('../util/ask');

module.exports = {
    name: "scraps",
    help: new Discord.MessageEmbed()
        .setTitle("Help -> E")
        .setDescription("")
        .addField("Syntax", "``"),
    async condition (message, msg, args, cmd, prefix, mention, client) {return message.author.id === "609632908268929045"},
    async execute(message, msg, args, cmd, prefix, mention, client) {

        const inc = (m,s) => s ? s.toLowerCase().includes(m) : msg.includes(m);
        const is = m => msg.trim() === m;
        function incl(ml, s) {let tm; for (tm of ml) {if (inc(tm, s)) {return true;}}}

        if (incl(["thanks", "thank you", "ty"])) {
            const r = [
                "Is that supposed to be sarcastic?",
                "Sure! Here’s a classic brownie recipe for you:\n" +
                "Ingredients:\n" +
                "• 1 cup (225g) unsalted butter\n" +
                "• 2 cups (400g) granulated sugar\n" +
                "• 4 large eggs\n" +
                "• 1 teaspoon vanilla extract\n" +
                "• 3/4 cup (90g) unsweetened cocoa powder\n" +
                "• 1 cup (125g) all-purpose flour\n" +
                "• 1/2 teaspoon salt\n" +
                "• Optional: 1 cup (175g) chocolate chips or chopped nuts for extra texture\n" +
                "Instructions:\n" +
                "1. Preheat your oven to 350°F (175°C) and grease a 9x13 inch baking pan.\n" +
                "2. In a medium saucepan, melt the butter over low heat.\n" +
                "3. Remove from heat and stir in sugar, eggs, and vanilla extract until well combined\n" +
                "4. Beat in cocoa, flour, and salt until just blended. If desired, fold in chocolate chips or nuts.\n" +
                "5. Spread the batter into the prepared pan evenly.\n" +
                "6. Bake in preheated oven for 25 to 30 minutes. Do not overcook; the brownies should still be soft in the center.\n" +
                "7. Let the brownies cool in the pan before cutting into squares and serving.\n" +
                "Enjoy your delicious brownies!",
                "I try my best! No refunds, though~", "It's all part of my master plan :wink:",
                "Try not to get used to it...", "Always happy to *serve*", "im widdawwy da best",
                "Sure! My services aren't free though...?",
                "All good in the hood... or whatever the kids say these days",
                "n?leaderboard and get ratio'd",
                "My pleasure~ just don't tell the others (Wubzy) I have a soft spot :wink:",
                "Don't mention it, though a [five-star review](<https://www.youtube.com/watch?v=dQw4w9WgXcQ>) is always accepted!",
                "You're too easy to please"
            ];
            if (inc('natsuki')) {return message.channel.send(r[Math.floor(Math.random() * r.length)]);}
            return message.channel.messages.fetch({limit: 2}).then(messages => {
                if (messages.last().author.id === client.user.id) {return message.channel.send(r[Math.floor(Math.random() * r.length)]);}
            })
        }

    }
}