const Discord = require('discord.js');

const auth = require('./src/json/auth.json');
const config = require('./src/json/config.json');
const randresp = require('./src/json/randresp.json');

const log = require('./src/util/log/log');

const flags = Discord.GatewayIntentBits;
const partials = Discord.Partials;
let fl = []; Object.keys(flags).forEach(flag => fl.push(flags[flag])); // fuck new standards i'm in't'zing with all the flags.
const client = new Discord.Client({intents: fl, partials: [partials.Channel, partials.Message, partials.Reaction]});
// a "fuck v14" counter is gonna be here real soon i can feel it.

const startBot = async () => {
    client.config = config;
    client.auth = auth;
    client.config.randResp = randresp;

    require('./src/util/misc/setutils')(client); // add some basic swiss army knife utils
    const loggers = log(client);
    Object.keys(loggers).forEach(logger => client[logger] = loggers[logger]);

    client.log(client.utils.gr(client.config.randResp.clistart), {color: "#78d9f8", source: "NATS"}); //natsuki's wakeup log
};
startBot();
// feels like there isn't a function name to do this justice :joy:

// to do list:
// TODO check log files later for cleanup, config, and util optimization
// TODO check connect file later for ^