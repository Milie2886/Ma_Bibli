const mongoose = require('mongoose');
const livreSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
});
module.exports = mongoose.model('Livre', livreSchema)