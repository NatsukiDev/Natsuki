const Discord = require('discord.js');
const client = new Discord.Client();
//const config = require('./config.js');
const auth = require('./auth.json');

//client.config = config;

async function init() {
    await client.login(auth.token);
    client.config = auth;

    ['commands', 'aliases'].forEach(x => client[x] = new Discord.Collection());
    client.responses = {triggers: [], commands: new Discord.Collection()};
    ['command', 'event', 'response'].forEach(x => require(`./handle/${x}`)(client));

    client.developers = ["330547934951112705", "673477059904929802"];
    
    client.misc = {
        savers: ['497598953206841375'],
        activeDMs: new Discord.Collection(),
        statusPings: new Discord.Collection()
    };

    client.utils = {};
    client.utils.logch = async () => {return client.guilds.cache.get('762707532417335296').channels.cache.get('762732961753595915');};

    client.guildconfig = {};
    client.guildconfig.prefixes = new Map();
    client.guildconfig.logs = new Map();
}
init();