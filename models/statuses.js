const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
    f: String,
    statuses: [{id: String, clear: Date}]
});

module.exports = new mongoose.model('statuses', StatusSchema);