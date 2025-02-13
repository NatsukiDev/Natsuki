const Discord = require('discord.js');

const errorhandler = require('./src/util/log/errorhandler');
const log = require('./src/util/log/log');

const flags = Discord.GatewayIntentBits;
const partials = Discord.Partials;
let fl = []; Object.keys(flags).forEach(flag => fl.push(flags[flag])); // fuck new standards i'm in't'zing with all the flags.
const client = new Discord.Client({intents: fl, partials: [partials.Channel, partials.Message, partials.Reaction]});
// a "fuck v14" counter is gonna be here real soon i can feel it.
//fuck new embeds


const startBot = async () => {

    client.config = require('./src/json/config.json');
    client.auth = require('./src/json/auth.json');
    client.config.randResp = require('./src/json/randresp.json');

    require('./src/util/misc/setutils')(client); // add some basic swiss army knife utils
    
    const loggers = log(client);
    Object.keys(loggers).forEach(logger => client[logger] = loggers[logger]);

    client.log(client.utils.gr(client.config.randResp.clistart), {color: "#78d9f8", source: client.config.bot.consoleName}, true, true); //natsuki's wakeup log

    require('./src/bot/startup/run/getflags')(client);

    await require('./src/db/connect')(client); //connect to database
    await require('./src/bot/startup/run/collect')(client); //load in commands and events
    await require('./src/bot/startup/run/login')(client); //log in to discord

    require('./src/util/misc/nodehandlers')(client); //bot uncaught promises, warnings, event loop shenanigans

};
startBot().catch(e => errorhandler(client, e)); // TODO add a .catch() and flag to recover the process
// feels like there isn't a function name to do this justice :joy:

// to do list:
// TODO check log files later for cleanup, config, and util optimization
// TODO check connect file later for ^