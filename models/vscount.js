const mongoose = require('mongoose');

const vscount = new mongoose.Schema({
    uid: String,
    countOf: String,
    total: ({type: Number, default: 0}),
    against: ({type: Object, default: {}})
});

module.exports = mongoose.model("vscount", vscount);