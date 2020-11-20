const mongoose = require('mongoose');

const SS = new mongoose.Schema({
    ssid: {type: String, unique: true},
    owner: String,
    start: String,
    end: String,
    anon: Boolean,
    info: String,
    notes: String,
    members: [{name: String, id: String, info: String}],
    started: Boolean,
    spend: String,
    assignments: [{name: String, assignedTo: String}]
});

module.exports = mongoose.model('ss', SS);