const mongoose = require('mongoose');

const secteurSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, unique: true, trim: true },
    responsable: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    actif: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Secteur', secteurSchema);
