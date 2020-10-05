const Discord = require('discord.js');
const mongoose = require('mongoose');
const chalk = require('chalk');

module.exports = async (message, msg, args, cmd, prefix, mention, client) => {
    /*const config = client.config;
    try {
        await mongoose.connect(`mongodb+srv://${config.database.user}:${config.database.password}@${config.database.cluster}.uqyvv.mongodb.net`, {
            useFindAndModify: false, useNewUrlParser: true, dbName: 'valk', useUnifiedTopology: true
        });
    } catch (e) {
        let date = new Date; date = date.toString().slice(date.toString().search(":") - 2, date.toString().search(":") + 6);
        console.error(`\n${chalk.red('[ERROR]')} >> ${chalk.yellow(`At [${date}] | Occurred while trying to connect to Mongo Cluster`)}`, e);
    }*/

    let botData = await require('../models/bot').findOne({finder: 'lel'});
    botData.commands = botData.commands + 1;

    botData.save();
};