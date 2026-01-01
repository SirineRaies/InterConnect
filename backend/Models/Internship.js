const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Le titre de l'offre est obligatoire."]
    },
    requiredSkills: {
        type: [String],
        required: [true, "Les compétences requises sont obligatoires."],
    },
    description: {
        type: String,
        required: [true, "La description de l'offre est obligatoire."],
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    supervisor: {
        type: String,
        required: [true, "Le nom du superviseur est obligatoire."]
    },
    studentsIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Student',
        default: []
    },
    startDate: {
        type: Date,
        required: [true, "La date de début de l'offre est obligatoire."]
    },
    endDate: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Internship', InternshipSchema);
