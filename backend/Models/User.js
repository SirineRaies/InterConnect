const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom sont obligatoire.']
    },
    email: {
        type: String,
        required: [true, "L'email est obligatoire."],
        unique: true,
        match: [/.+\@.+\..+/, "Format d'email invalide."]
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est obligatoire.'],
        minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères.']
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'company'],
    },
    profileCompleted :{
        type: Boolean,
        default: false
    }},{
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
