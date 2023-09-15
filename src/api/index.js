const express = require('express');
const chalk = require('chalk');

module.exports = (client) => {
    return new Promise(r => {
        const api = express();
        client.api = {wubzy: {}, natsuki: {}};
        client.api.log = (message, type, prenl, postnl) => client.log(message, {source: 'API', sourceColor: '#1F2B56', suffix: `${type ? chalk.gray(` [${type.toUpperCase()}]`) : ''} >> `}, prenl, postnl);
        client.api.wubzy.app = api;

        client.api.wubzy.app.get('/', (req, res) => res.send("You've reached the wubzy.xyz API. If you're looking for Natsuki's endpoints, please append /natsuki to your query."));
        client.api.wubzy.app.get('/natsuki', (req, res) => res.send("You've reached Natsuki's status endpoint. Receiving this 200 reply indicates that Natsuki is online. If you're looking for the Natsuki API, it has been moved to natsuki.app"));
        client.api.wubzy.app.get('/natsuki/:any?', (req, res) => res.status(301).send("Natsuki's API permanently resides at natsuki.app"));

        client.api.wubzy.server = client.api.wubzy.app.listen(4072, () => {client.api.log(`API ready at ${client.api.wubzy.server.address().address.replace('::', 'localhost')}:${client.api.wubzy.server.address().port}`, 'boot', false, true); r();});
    });
};