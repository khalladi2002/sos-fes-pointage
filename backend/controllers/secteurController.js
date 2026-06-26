const Secteur = require('../models/Secteur');
const Agent = require('../models/Agent');
const User = require('../models/User');

// GET /api/secteurs
const getSecteurs = async (req, res) => {
  const secteurs = await Secteur.find().populate('responsable', 'nom username').sort('nom');
  const data = await Promise.all(
    secteurs.map(async (s) => {
      const nbAgents = await Agent.countDocuments({ secteur: s._id, actif: true });
      return { ...s.toObject(), nbAgents };
    })
  );
  res.json(data);
};

// GET /api/secteurs/:id
const getSecteur = async (req, res) => {
  const secteur = await Secteur.findById(req.params.id).populate('responsable', 'nom username');
  if (!secteur) return res.status(404).json({ message: 'Secteur introuvable.' });
  res.json(secteur);
};

// POST /api/secteurs
const createSecteur = async (req, res) => {
  try {
    const { nom, responsable } = req.body;
    const exists = await Secteur.findOne({ nom });
    if (exists) return res.status(400).json({ message: 'Ce secteur existe déjà.' });
    const secteur = await Secteur.create({ nom, responsable: responsable || null });
    if (responsable) await User.findByIdAndUpdate(responsable, { secteur: secteur._id });
    res.status(201).json(secteur);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /api/secteurs/:id
const updateSecteur = async (req, res) => {
  try {
    const { nom, responsable, actif } = req.body;
    const secteur = await Secteur.findByIdAndUpdate(
      req.params.id,
      { nom, responsable: responsable || null, actif },
      { new: true }
    );
    if (!secteur) return res.status(404).json({ message: 'Secteur introuvable.' });
    if (responsable) await User.findByIdAndUpdate(responsable, { secteur: secteur._id });
    res.json(secteur);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// DELETE /api/secteurs/:id
const deleteSecteur = async (req, res) => {
  const nbAgents = await Agent.countDocuments({ secteur: req.params.id });
  if (nbAgents > 0) {
    return res.status(400).json({ message: 'Impossible de supprimer : des agents sont liés à ce secteur.' });
  }
  await Secteur.findByIdAndDelete(req.params.id);
  res.json({ message: 'Secteur supprimé.' });
};

module.exports = { getSecteurs, getSecteur, createSecteur, updateSecteur, deleteSecteur };
