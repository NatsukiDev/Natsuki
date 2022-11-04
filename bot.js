const Discord = require('discord.js');

const auth = require('./src/json/auth.json');
const config = require('./src/json/config.json');


const flags = Discord.Intents.FLAGS;
let fl = []; Object.keys(flags).forEach(flag => fl.push(flags[flag])); // fuck new standards i'm in't'zing with all the flags.
const client = new Discord.Client({intents: fl, partials: ["CHANNEL", "REACTION", "MESSAGE"]});

const startBot = async () => {
    client.config = config;
    client.auth = auth;
};
startBot();
// feels like there isn't a function name to do this justice :joy: