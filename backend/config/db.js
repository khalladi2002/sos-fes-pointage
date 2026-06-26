const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/sos_fes_pointage';
    await mongoose.connect(uri);
    console.log('✅ MongoDB connecté :', uri);
  } catch (err) {
    console.error('❌ Erreur connexion MongoDB :', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
