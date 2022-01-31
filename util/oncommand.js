const Discord = require('discord.js');
const UserData = require('../models/user');

module.exports = async (message, msg, args, cmd, prefix, mention, client) => {
    let botData = await require('../models/bot').findOne({finder: 'lel'});
    botData.commands = botData.commands + 1;
    botData.save();
    let tu = await UserData.findOne({uid: message.author.id})
        ? await UserData.findOne({uid: message.author.id})
        : new UserData({uid: message.author.id});
    tu.commands = tu.commands + 1;
    tu.save();

    if (tu.commands > 50 && !tu.msg) {
        message.author.send({embeds: [new Discord.MessageEmbed()
            .setThumbnail(client.user.avatarURL({size: 2048}))
            .setDescription(`Hey there **${message.author.username}**! Looks like you've used my commands over **50 times**${tu.commands > 51 ? ` (${tu.commands} to be exact)` : ''}!\nI hope you're enjoying the wonderful things I have to offer, because I've enjoyed offering them to you.`)
            .addField("What next?", "If you're enjoying what I do, you can [join my support server](https://discord.gg/u9c2uD24wB) to leave feedback and say hi to my developers. You can also consider [giving the repository a star](https://github.com/NatsukiDev/Natsuki) to show your support! I look forward to my time with you in the future <:hearty:812130944319750144>")
            .setFooter({text: "Natsuki"})
            .setTimestamp()
        ]}).catch(() => {});
        tu.msg = true;
        tu.save();
    }
};