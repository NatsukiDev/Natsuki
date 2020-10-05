const Discord = require('discord.js');
const client = new Discord.Client();
//const config = require('./config.js');
const auth = require('./auth.json');

//client.config = config;

async function init() {
    await client.login(auth.token);
    client.config = auth;

    ['commands', 'aliases'].forEach(x => client[x] = new Discord.Collection());
    ['command', 'event'].forEach(x => require(`./handle/${x}`)(client));
}
init();