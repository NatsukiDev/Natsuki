const mongoose = require('mongoose');

const td = new mongoose.Schema({
    uid: {type: String, unique: true},
    lists: {type: Object, default: {quick: []}},
    publicLists: {type: Object, default: {}}
});

module.exports = mongoose.model('todo', td);