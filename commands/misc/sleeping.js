const Discord = require('discord.js');

const UserData = require("../../models/user");

module.exports = {
    name: "sleeping",
    aliases: ['asleep', 'sloopin', 'ischleep'],
    meta: {
        category: 'Misc',
        description: "Set your status to tell others you're sleeping.",
        syntax: '`sleeping`',
        extra: null
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Sleeping")
        .setDescription("Use this command to set an automatically-clearing AFK status that lets people who ping you know you're asleep. Send any message to any server with Natsuki in it to clear the status.")
        .addField("Syntax", "`sleeping`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        let tu = await UserData.findOne({uid: message.author.id}) || new UserData({uid: message.author.id});
        tu.statusclearmode = 'auto';
        tu.statustype = 'afk';
        tu.statusmsg = [
            "<a:NC_yawn:830701611990908961> Sleeping",
            "<a:NC_yawn2:857589454830174219> Getting a good night's rest",
            "<a:NC_yawn:830701611990908961> Big sleep",
            "<a:NC_yawn2:857589454830174219> \\*snore\\*"
        ][Math.floor(Math.random() * 4)];
        tu.statussetat = new Date();
        let tempDate = new Date();
        tu.statusclearat = tempDate.setHours(tempDate.getHours() + 12);
        tu.statusSleeping = true;
        tu.markModified("statusSleeping");
        tu.markModified("statussetat");
        tu.markModified("statusclearat");
        tu.save();
        require('../../util/cachestatus')(message.author.id, tempDate.setHours(tempDate.getHours() + 10));
        return message.channel.send(
            (client.misc.cache.returnToSleep.has(message.author.id) && new Date().getTime() - client.misc.cache.returnToSleep.get(message.author.id) < 600000
                ? [
                    "Ah, well I'm glad you're getting back to sleep! Try to put the phone down and get some rest qt",
                    "Actually taking my advice and getting some sleep? You need it after all!",
                    ":D You're going back to bed! I don't wanna see you up again. You need some sleep qt ^^",
                    "Sleep is good for you! It's best uninterrupted. Get some good sleep and try not to pick up your phone again."
                ]
                : [
                    "Goodnight qt <:NC_wave:830704926576345119>",
                    "<:NC_hearty:841489530413383712> Have a good sleep! ^^",
                    "Sleep well. You deserve it <3 <a:NC_NekoPet_1:861664617406136342><a:NC_NekoPet_2:861664756184252417>",
                    "<:NC_nezuGUN:852735951712157698> Get good sleep coward!"
                ]
            )[Math.floor(Math.random() * 4)]
        );
    }
};