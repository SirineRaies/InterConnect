const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Veuillez fournir une adresse email valide']
  },
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true
  },
  cvUrl: {
    type: String,
    required: true
  },
  scoreIA: {
    type: Number,
    default: null,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['En attente', 'Accepté', 'Refusé'],
    default: 'En attente'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', ApplicationSchema);
