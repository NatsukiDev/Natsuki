const mongoose = require('mongoose');

const Monners = mongoose.Schema({
    uid: {type: String, unique: true},
    currency: {type: Number, default: 0},
    daily: {type: {
        streak: Number,
        last: Number,
        total: Number
    }, default: {}},
    transactions: {type: Object, default: {}}
});

module.exports = mongoose.model('monners', Monners);