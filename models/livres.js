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
    category: {
        type: String,
        enum: ['Tintin', 'Le club des 5', 'Asterix', 'Mortelle Adèle', 'Gaston'],
        required: 'Ce champs est obligatoire'
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
});
module.exports = mongoose.model('Livre', livreSchema)