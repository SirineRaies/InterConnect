const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    niveau: {
        type: String,
        required: [true, 'Le niveau est obligatoire.']
    },
    specialite: {
        type: String,
        required: false,
    },
    skills: {
        type: [String],
        required: false,
        default: []
    },
    cvUrl: {
        type: String,
        required: false,
    }},{
    timestamps: true
});

module.exports = mongoose.model('Student', StudentSchema);
