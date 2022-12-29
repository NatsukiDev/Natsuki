const express = require('express');

module.exports = (client) => {
    const api = express();
    client.api = {wubzy: {}, natsuki: {}};
    client.api.wubzy.app = api;

    client.api.wubzy.app.get('/', (req, res) => res.send("You've reached the wubzy.xyz API. If you're looking for Natsuki's endpoints, please append /natsuki to your query."));
    client.api.wubzy.app.get('/natsuki', (req, res) => res.send("You've reached Natsuki's status endpoint. Receiving this 200 reply indicates that Natsuki is online. If you're looking for the Natsuki API, it has been moved to natsuki.app"));
    client.api.wubzy.app.get('/natsuki/:any?', (req, res) => res.status(301).send("Natsuki's API permanently resides at natsuki.app"));

    client.api.wubzy.server = client.api.wubzy.app.listen(4072, () => console.log(`Ready at ${client.api.wubzy.server.address().address}:${client.api.wubzy.server.address().port}`));
};