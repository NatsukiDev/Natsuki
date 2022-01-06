const Monners = require('../../models/monners');
const Chests = require('../../models/chests');
const manyitems = require('manyitems');
const Discord = require('discord.js');

module.exports = async (client, member, channel, prefix) => {
    if (client.misc.cache.chests.timeout.has(member.guild.id) && new Date().getTime() - client.misc.cache.chests.timeout.get(member.guild.id) < (1000 * 60 * 2)) {return;}
    let rand = Math.floor(Math.random() * 100);
    if (rand !== 69 && rand !== 42) {return;} //decide if it even continues

    let tm = await Monners.findOne({uid: member.id});
    let streak = tm && tm.daily ? tm.daily.streak : 0; //get streak for bonus later

    let rarities = [ //decide rarity
        {
            rarity: 100,
            name: 'Common',
            color: '586269',
            amount: 40
        }, {
            rarity: 40,
            name: 'Uncommon',
            color: '449e77',
            amount: 120
        }, {
            rarity: 20,
            name: 'Rare',
            color: '459dcc',
            amount: 300
        }, {
            rarity: 10,
            name: 'Legendary',
            color: '7951bd',
            amount: 750
        }, {
            rarity: 1,
            name: 'Epic',
            color: 'c7a756',
            amount: 1250
        }, {
            rarity: 0.02,
            name: 'Godly',
            color: 'fa25be',
            amount: 20000
        }
    ];
    let rareNum = (Math.ceil(Math.random() * 10000)) / 100;
    let rarity;
    for (let i = 0; i < Object.keys(rarities).length; i++) { //loop that reassigns to a higher rarity until the rarity value is lower than its requirement
        if (rareNum < (100 - rarities[i].rarity)) {break;}
        else {rarity = rarities[i];}
    }

    let ri = new manyitems.Random("bubble", undefined, {
        min: rarity.amount - (rarity.amount * .10),
        max: rarity.amount + (rarity.amount * .10) + (rarity.amount * .10 * 1.25 * streak)
    });
    let streakBonus = streak !== 0 ? Math.floor((Math.floor(Math.random() * (rarity.amount * .10)) * 1.5 * streak)) : 0;
    let amount = ri.calc_bubble() + streakBonus; //calculate the amount by allowing a 10% +/- variance, higher potential with higher streak, and adding another random bonus with streak

    let chests = await Chests.findOne({gid: member.guild.id});
    if (!chests) {return;}
    let spawnChannel = chests.channel && chests.channel.length ? chests.channel : channel;

    client.misc.cache.chests.timeout.set(member.guild.id, new Date().getTime());

    let chestEmbed = new Discord.MessageEmbed()
        .setTitle(`${client.utils.an(rarity.name, true)} Chest has spawned!`)
        .setDescription(`It has **${amount} ${client.misc.cache.monnersNames.get(member.guild.id) || 'Monners'}<:monners:926736756047495218>**`)
        .setFooter({text: `Type ${prefix}claim to claim it!`})
        .setColor(rarity.color) //create the chest message

    if (spawnChannel === channel) {
        return channel.send({embeds: [chestEmbed]})
        .then(m => {client.misc.cache.chests.waiting.set(m.channel.id, {amount: amount, rarity: rarity, message: m});}) //place the chest in waiting to make it claimable
        .catch(() => {});
    }
    else {
        member.guild.channels.fetch(spawnChannel)
        .then(ch => ch.send({embeds: [chestEmbed]})
            .then(m => {client.misc.cache.chests.waiting.set(m.channel.id, {amount: amount, rarity: rarity, message: m});})
            .catch(() => {}))
        .catch(() => {})
    }
    return spawnChannel.send({embeds: [chestEmbed]}); //spawn the chest
};