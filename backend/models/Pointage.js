const mongoose = require('mongoose');

const pointageSchema = new mongoose.Schema(
  {
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    secteur: { type: mongoose.Schema.Types.ObjectId, ref: 'Secteur', required: true },
    date: { type: String, required: true }, // format YYYY-MM-DD
    statut: {
      type: String,
      enum: ['Présent', 'Absent', 'Repos', 'Congé', 'Maladie'],
      required: true
    },
    heureEntree: { type: String, default: '' },
    heureSortie: { type: String, default: '' },
    observation: { type: String, default: '' },
    saisiPar: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

// Un seul pointage par agent et par jour
pointageSchema.index({ agent: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Pointage', pointageSchema);
