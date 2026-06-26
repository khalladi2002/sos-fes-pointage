const Pointage = require('../models/Pointage');
const Agent = require('../models/Agent');

// GET /api/pointages?date=&secteur=&agent=&from=&to=
const getPointages = async (req, res) => {
  const filter = {};
  if (req.user.role === 'responsable') {
    filter.secteur = req.user.secteur;
  } else if (req.query.secteur) {
    filter.secteur = req.query.secteur;
  }
  if (req.query.agent) filter.agent = req.query.agent;
  if (req.query.date) {
    filter.date = req.query.date;
  } else if (req.query.from && req.query.to) {
    filter.date = { $gte: req.query.from, $lte: req.query.to };
  }

  const pointages = await Pointage.find(filter)
    .populate('agent', 'matricule nom')
    .populate('secteur', 'nom')
    .sort({ date: -1 });
  res.json(pointages);
};

// POST /api/pointages/bulk  -> saisie quotidienne pour tout un secteur
// body: { secteur, date, pointages: [{ agent, statut, heureEntree, heureSortie, observation }] }
const saveBulkPointages = async (req, res) => {
  try {
    const { secteur, date, pointages } = req.body;

    if (req.user.role === 'responsable' && String(secteur) !== String(req.user.secteur)) {
      return res.status(403).json({ message: 'Accès refusé : ce secteur ne vous appartient pas.' });
    }

    const ops = pointages.map((p) => ({
      updateOne: {
        filter: { agent: p.agent, date },
        update: {
          $set: {
            agent: p.agent,
            secteur,
            date,
            statut: p.statut,
            heureEntree: p.heureEntree || '',
            heureSortie: p.heureSortie || '',
            observation: p.observation || '',
            saisiPar: req.user._id
          }
        },
        upsert: true
      }
    }));

    if (ops.length) await Pointage.bulkWrite(ops);
    const result = await Pointage.find({ secteur, date }).populate('agent', 'matricule nom');
    res.json({ message: 'Pointage enregistré avec succès.', pointages: result });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /api/pointages/:id
const updatePointage = async (req, res) => {
  try {
    const pointage = await Pointage.findById(req.params.id);
    if (!pointage) return res.status(404).json({ message: 'Pointage introuvable.' });
    if (req.user.role === 'responsable' && String(pointage.secteur) !== String(req.user.secteur)) {
      return res.status(403).json({ message: 'Accès refusé.' });
    }
    Object.assign(pointage, req.body, { saisiPar: req.user._id });
    await pointage.save();
    res.json(pointage);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// GET /api/pointages/alerts -> agents absents consécutifs, retards, sans pointage
const getAlerts = async (req, res) => {
  const filter = {};
  if (req.user.role === 'responsable') filter.secteur = req.user.secteur;
  else if (req.query.secteur) filter.secteur = req.query.secteur;

  const agents = await Agent.find({ ...filter, actif: true }).populate('secteur', 'nom');
  const today = new Date();
  const last7 = [...Array(7)].map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });

  const alerts = [];
  for (const agent of agents) {
    const recents = await Pointage.find({ agent: agent._id, date: { $in: last7 } }).sort({ date: -1 });
    // Absences consécutives (à partir d'aujourd'hui en remontant)
    let consecutifs = 0;
    for (const d of last7) {
      const p = recents.find((r) => r.date === d);
      if (p && p.statut === 'Absent') consecutifs++;
      else break;
    }
    if (consecutifs >= 2) {
      alerts.push({ type: 'absence_consecutive', agent: agent.nom, matricule: agent.matricule, jours: consecutifs });
    }
    // Retards fréquents (heure d'entrée après 06:15, seuil exemple)
    const retards = recents.filter((p) => p.statut === 'Présent' && p.heureEntree && p.heureEntree > '06:15');
    if (retards.length >= 3) {
      alerts.push({ type: 'retards_frequents', agent: agent.nom, matricule: agent.matricule, nombre: retards.length });
    }
    // Sans pointage aujourd'hui
    const todayStr = today.toISOString().slice(0, 10);
    const pointageAujourdhui = recents.find((r) => r.date === todayStr);
    if (!pointageAujourdhui) {
      alerts.push({ type: 'sans_pointage', agent: agent.nom, matricule: agent.matricule });
    }
  }
  res.json(alerts);
};

module.exports = { getPointages, saveBulkPointages, updatePointage, getAlerts };
