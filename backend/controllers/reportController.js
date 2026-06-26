const Agent = require('../models/Agent');
const Secteur = require('../models/Secteur');
const Pointage = require('../models/Pointage');
const { generatePointagePdf } = require('../utils/generatePdf');
const { generatePointageExcel } = require('../utils/generateExcel');

// GET /api/reports/pdf?secteur=&date=
const exportPdf = async (req, res) => {
  try {
    const { secteur, date } = req.query;
    if (!secteur || !date) return res.status(400).json({ message: 'Secteur et date requis.' });

    const secteurDoc = await Secteur.findById(secteur);
    if (!secteurDoc) return res.status(404).json({ message: 'Secteur introuvable.' });

    const agents = await Agent.find({ secteur, actif: true }).sort('matricule');
    const pointages = await Pointage.find({ secteur, date });

    const lignes = agents.map((a) => {
      const p = pointages.find((pt) => String(pt.agent) === String(a._id));
      return {
        matricule: a.matricule,
        nom: a.nom,
        heureEntree: p?.heureEntree || '',
        heureSortie: p?.heureSortie || '',
        statut: p?.statut || 'Non pointé'
      };
    });

    generatePointagePdf(res, { secteurNom: secteurDoc.nom, date, lignes });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// GET /api/reports/excel?type=date|secteur|agent&date=&secteur=&agent=&from=&to=
const exportExcel = async (req, res) => {
  try {
    const { type, date, secteur, agent, from, to } = req.query;
    const filter = {};
    if (req.user.role === 'responsable') filter.secteur = req.user.secteur;

    if (type === 'date' && date) filter.date = date;
    if (type === 'secteur' && secteur) filter.secteur = secteur;
    if (type === 'agent' && agent) filter.agent = agent;
    if (from && to) filter.date = { $gte: from, $lte: to };

    const pointages = await Pointage.find(filter)
      .populate('agent', 'matricule nom')
      .populate('secteur', 'nom')
      .sort({ date: -1 });

    await generatePointageExcel(res, pointages, `pointages_${type || 'export'}`);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { exportPdf, exportExcel };
