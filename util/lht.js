const path = require('path');
const Discord = require('discord.js');
const axios = require("axios");
const cheerio = require('cheerio');
const {GoogleSpreadsheet} = require('google-spreadsheet');
const {google} = require('googleapis');
const {JWT} = require("google-auth-library");

const auth = require('../gauth.json');

module.exports = async client => { try {

    const LH = await client.guilds.fetch('359107239056769044');
    const UPDATES = await LH.channels.fetch('1337297601208516699');

    let doc = new GoogleSpreadsheet('1JRQ3B4v56Hz1oi8NkGPH0ImAWrrMZXifetb24LMCN1s', new JWT({email: auth.client_email, key: auth.private_key, scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file']}));
    await doc.loadInfo();

    let sheet = doc.sheetsByIndex[0];
    let rows = await sheet.getRows({limit: 500});

    let raws = {};
    rows.forEach(row => raws[row.get("NAME")] = {link: row.get("LINK RAW"), released: row.get("RELEASED"), raw: row.get("RAW")});
    const compareRaws = async () => {
        rows = await sheet.getRows({limit: 500});
        for (let row of rows) {
            if (row.get("RAW") !== raws[row.get("NAME")].raw) {
                const {data} = await axios.get(row.get("LINK RAW"));
                const $ = cheerio.load(data);
                let img = '';
                try {img = $('div.col-md-4 > div.text-center > img.thumbnail').attr('src');} catch {} //deviously easy web scrape

                let embed = new Discord.MessageEmbed()
                    .setAuthor({name: "New Raw Posted"})
                    .setTitle(row.get("NAME")) //TODO IMAGES
                    .setDescription(`A new raw has been released for *${row.get("NAME")}*.\n\n*time to get to work~*`)
                    .addField("Old", `**${raws[row.get("NAME")].raw}**`, true)
                    .addField("New", `**${row.get("RAW")}**`, true)
                    .addField("Last LH Release", `**${row.get("RELEASED")}**`)
                    .setURL(row.get("LINK RAW"))
                    .setFooter({text: "Natsuki", iconURL: client.user.avatarURL()})
                    .setTimestamp()

                if (img && typeof img === 'string' && img.startsWith('https')) {
                    /*const colors = await prominent(img, {amount: 3, format: 'hex'});*/
                    embed.setImage(img)
                        /*.setColor(colors[Math.floor(Math.random() * colors.length)])*/;
                } /*else {*/embed.setColor('dc134c');/*}*/

                UPDATES.send({
                    content: (row.get("ROLE") && row.get("ROLE").match(/\d+/g)) ? `<@&${row.get("ROLE")}>` : "I don't know what role to ping for this series!",
                    embeds: [embed]
                }).catch(() => {});
            }
            raws[row.get("NAME")] = {link: row.get("LINK RAW"), released: row.get("RELEASED"), raw: row.get("RAW")};
        }
    };

    //client.misc.timeTracker.on('minute', compareRaws);

    client.misc.timeTracker.on('bullySavi', () => {
        const bullies = [
            "Ohhhhhh Saviiiii you busy? No? Wanna fix that? (it's LHT time)", "LHT time~~", "u translating rn qt? i smell slacker. stinky",
            "You already know why I'm here lol", "Are you ignoring these DMs yet?", "Time to translate some Farming Life :3", "It's ~~your worst nightmare~~Natsuki here~ you ready to do ~~slavery~~TL work?",
            "hi i was told im supposed to bully u, dont shoot the messenger", "FBI open up! (i've run out of creative ways to tell you to do your job)", "TL time lol",
            "ベリグットツランスレエタタイム", "knock knock, it's your TL work at the door, it wants child support", "bully bully bully bully bully time do your worky worky worky worky work time",
            "if you leave LHT i'll leave with you slavery sucks ||just kidding time to do your job (it's unpaid)||", "\\> be you\n\\> be a TL\n\\> realize it's 10am\n\\>ihatemyjob.png", "hi"
        ];
        client.users.fetch('204496174491631616').then(
            u => u.send(bullies[Math.floor(Math.random() * bullies.length)])
                .catch(() => client.users.fetch(client.developers[0]).then(w => w.send("I couldn't DM Savi!!")))
        )
    });

} catch {}};