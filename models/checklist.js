const mongoose = require('mongoose');
module.exports = mongoose.model('checklist', new mongoose.Schema({
    id: String,
    ownerId: String,
    name: String,
    description: String,
    image: String,
    children: {type: [{
        list: Boolean,
        id: String
    }], default: []},
    archived: {type: Boolean, default: false},
    assignees: {type: [String], default: []}
}));