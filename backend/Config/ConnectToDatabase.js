const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_DATABASE_URI;
    
    console.log(`Tentative de connexion à : ${mongoURI}`); 
    
    await mongoose.connect(mongoURI);
    console.log('Connexion à MongoDB réussie !');
  } catch (err) {
    console.error('Erreur de connexion à MongoDB :', err.message);
    process.exit(1);
  }
};

module.exports = connectToDatabase;