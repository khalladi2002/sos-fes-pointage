const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema(
  {
    matricule: { type: String, required: true, unique: true, trim: true },
    nom: { type: String, required: true, trim: true },
    secteur: { type: mongoose.Schema.Types.ObjectId, ref: 'Secteur', required: true },
    telephone: { type: String, default: '' },
    actif: { type: Boolean, default: true }
  },
  { timestamps: true }
);

agentSchema.index({ nom: 'text' });

module.exports = mongoose.model('Agent', agentSchema);
