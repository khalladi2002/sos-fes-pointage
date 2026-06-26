const Agent = require('../models/Agent');
const Pointage = require('../models/Pointage');
const Secteur = require('../models/Secteur');

const todayStr = () => new Date().toISOString().slice(0, 10);

// GET /api/stats/overview
const getOverview = async (req, res) => {
  const filter = {};
  if (req.user.role === 'responsable') filter.secteur = req.user.secteur;
  else if (req.query.secteur) filter.secteur = req.query.secteur;

  const totalAgents = await Agent.countDocuments({ ...filter, actif: true });
  const date = req.query.date || todayStr();

  const pointagesAuj = await Pointage.find({ ...filter, date });
  const presents = pointagesAuj.filter((p) => p.statut === 'Présent').length;
  const absents = pointagesAuj.filter((p) => p.statut === 'Absent').length;
  const repos = pointagesAuj.filter((p) => p.statut === 'Repos').length;
  const conges = pointagesAuj.filter((p) => p.statut === 'Congé').length;
  const malades = pointagesAuj.filter((p) => p.statut === 'Maladie').length;

  const tauxPresence = totalAgents > 0 ? Math.round((presents / totalAgents) * 100) : 0;

  res.json({ totalAgents, presents, absents, repos, conges, malades, tauxPresence, date });
};

// GET /api/stats/presence-par-jour?days=14
const getPresenceParJour = async (req, res) => {
  const filter = {};
  if (req.user.role === 'responsable') filter.secteur = req.user.secteur;
  else if (req.query.secteur) filter.secteur = req.query.secteur;

  const days = parseInt(req.query.days) || 14;
  const labels = [...Array(days)]
    .map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().slice(0, 10);
    })
    .reverse();

  const data = await Promise.all(
    labels.map(async (date) => {
      const presents = await Pointage.countDocuments({ ...filter, date, statut: 'Présent' });
      const absents = await Pointage.countDocuments({ ...filter, date, statut: 'Absent' });
      return { date, presents, absents };
    })
  );
  res.json(data);
};

// GET /api/stats/presence-par-secteur
const getPresenceParSecteur = async (req, res) => {
  const date = req.query.date || todayStr();
  const secteurs = await Secteur.find({ actif: true });
  const data = await Promise.all(
    secteurs.map(async (s) => {
      const totalAgents = await Agent.countDocuments({ secteur: s._id, actif: true });
      const presents = await Pointage.countDocuments({ secteur: s._id, date, statut: 'Présent' });
      return { secteur: s.nom, totalAgents, presents };
    })
  );
  res.json(data);
};

// GET /api/stats/absences-mensuelles?months=6
const getAbsencesMensuelles = async (req, res) => {
  const filter = { statut: 'Absent' };
  if (req.user.role === 'responsable') filter.secteur = req.user.secteur;
  else if (req.query.secteur) filter.secteur = req.query.secteur;

  const months = parseInt(req.query.months) || 6;
  const result = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const ym = d.toISOString().slice(0, 7); // YYYY-MM
    const count = await Pointage.countDocuments({ ...filter, date: { $regex: `^${ym}` } });
    result.push({ mois: ym, absences: count });
  }
  res.json(result);
};

module.exports = { getOverview, getPresenceParJour, getPresenceParSecteur, getAbsencesMensuelles };
