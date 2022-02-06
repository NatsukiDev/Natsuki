const mongoose = require('mongoose');

const RPCh = new mongoose.Schema({
    uid: {type: String, unique: true, required: true},
    chars: {type: Object, default: {}},
    defaults: {type: Object, default: {}},
    default: {type: String}
});

module.exports = mongoose.model('rpch', RPCh);