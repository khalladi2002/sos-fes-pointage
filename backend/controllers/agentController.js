const Agent = require('../models/Agent');

// GET /api/agents?secteur=&actif=&search=
const getAgents = async (req, res) => {
  const filter = {};
  // Un responsable ne voit que son secteur
  if (req.user.role === 'responsable') {
    filter.secteur = req.user.secteur;
  } else if (req.query.secteur) {
    filter.secteur = req.query.secteur;
  }
  if (req.query.actif !== undefined) filter.actif = req.query.actif === 'true';
  if (req.query.search) filter.nom = { $regex: req.query.search, $options: 'i' };

  const agents = await Agent.find(filter).populate('secteur', 'nom').sort('matricule');
  res.json(agents);
};

const getAgent = async (req, res) => {
  const agent = await Agent.findById(req.params.id).populate('secteur', 'nom');
  if (!agent) return res.status(404).json({ message: 'Agent introuvable.' });
  res.json(agent);
};

// POST /api/agents (admin uniquement)
const createAgent = async (req, res) => {
  try {
    const { matricule, nom, secteur, telephone } = req.body;
    const exists = await Agent.findOne({ matricule });
    if (exists) return res.status(400).json({ message: 'Ce matricule existe déjà.' });
    const agent = await Agent.create({ matricule, nom, secteur, telephone });
    res.status(201).json(agent);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /api/agents/:id (admin uniquement)
const updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!agent) return res.status(404).json({ message: 'Agent introuvable.' });
    res.json(agent);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// DELETE /api/agents/:id (admin uniquement)
const deleteAgent = async (req, res) => {
  await Agent.findByIdAndDelete(req.params.id);
  res.json({ message: 'Agent supprimé.' });
};

module.exports = { getAgents, getAgent, createAgent, updateAgent, deleteAgent };
