const express = require('express');
const api = express();

api.get('/', (req, res) => res.send("You've reached the wubzy.xyz API. If you're looking for Natsuki's endpoints, please append /natsuki to your query."));
api.get('/natsuki', (req, res) => res.send("You've reached Natsuki's API. Receiving this 200 reply indicates that Natsuki is online."));

const server = api.listen(4072, () => console.log(`Ready at ${server.address().address}:${server.address().port}`));