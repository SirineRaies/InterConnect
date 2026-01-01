const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    idUser :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    secteur: {
        type: String,
        required: [true, "Le secteur d'entreprise est obligatoire."],
    },
    description: {
        type: String,
        required: false,
    },
    image:{
        type: String,
        required: false,
        default: ''
    }},{
    timestamps: true
});

module.exports = mongoose.model('Company', CompanySchema);
