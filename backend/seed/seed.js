/**
 * Script de données de démonstration pour SOS Fès.
 * Usage : npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Secteur = require('../models/Secteur');
const User = require('../models/User');
const Agent = require('../models/Agent');
const Pointage = require('../models/Pointage');

const agentsJnanat1 = [
  { matricule: '1073', nom: 'بناصر محمد' },
  { matricule: '1098', nom: 'الخرشاف عبد الواحد' },
  { matricule: '1119', nom: 'فهيم محمد' },
  { matricule: '1144', nom: 'قصور عادل' },
  { matricule: '1145', nom: 'العبدوني محمد' },
  { matricule: '1258', nom: 'صوصي علوي عمر' },
  { matricule: '1267', nom: 'السليماني عمر' },
  { matricule: '1282', nom: 'بوفقادي إدريسي أنوار' },
  { matricule: '1345', nom: 'بوعيدة عبد الإله' },
  { matricule: '1370', nom: 'خروف محمد' },
  { matricule: '1392', nom: 'شركي بوصري مراد' },
  { matricule: '1520', nom: 'زكري حاتم' },
  { matricule: '1521', nom: 'فكري أنوار' },
  { matricule: '1522', nom: 'مرزاق كمال' },
  { matricule: '1525', nom: 'الشفال يوسف' },
  { matricule: '1304', nom: 'سلطاني أحمد' },
  { matricule: '1529', nom: 'ناصري ياسين' },
  { matricule: '1531', nom: 'المخلوفي هشام' }
];

const statuts = ['Présent', 'Présent', 'Présent', 'Présent', 'Absent', 'Repos', 'Maladie'];

async function run() {
  await connectDB();
  console.log('🧹 Nettoyage de la base...');
  await Promise.all([Secteur.deleteMany({}), User.deleteMany({}), Agent.deleteMany({}), Pointage.deleteMany({})]);

  console.log('🏗️  Création des secteurs...');
  const secteursNoms = ['JNANAT 1', 'JNANAT 2', 'CEINTURE', 'ATLAS', 'ZOUAGHA'];
  const secteurs = {};
  for (const nom of secteursNoms) {
    secteurs[nom] = await Secteur.create({ nom });
  }

  console.log('👤 Création des utilisateurs...');
  const admin = await User.create({
    nom: 'Administrateur SOS Fès',
    username: 'admin',
    password: 'Admin@2026',
    role: 'admin'
  });

  const respJnanat1 = await User.create({
    nom: 'Responsable JNANAT 1',
    username: 'resp.jnanat1',
    password: 'Resp@2026',
    role: 'responsable',
    secteur: secteurs['JNANAT 1']._id
  });
  secteurs['JNANAT 1'].responsable = respJnanat1._id;
  await secteurs['JNANAT 1'].save();

  // Responsables fictifs pour les autres secteurs (mot de passe identique pour la démo)
  const autresSecteurs = secteursNoms.filter((n) => n !== 'JNANAT 1');
  for (const nom of autresSecteurs) {
    const username = 'resp.' + nom.toLowerCase().replace(/\s+/g, '');
    const resp = await User.create({
      nom: `Responsable ${nom}`,
      username,
      password: 'Resp@2026',
      role: 'responsable',
      secteur: secteurs[nom]._id
    });
    secteurs[nom].responsable = resp._id;
    await secteurs[nom].save();
  }

  console.log('🧍 Création des agents du secteur JNANAT 1...');
  const agentsCrees = [];
  for (const a of agentsJnanat1) {
    const agent = await Agent.create({
      matricule: a.matricule,
      nom: a.nom,
      secteur: secteurs['JNANAT 1']._id,
      telephone: ''
    });
    agentsCrees.push(agent);
  }

  console.log('🗓️  Génération de pointages de démonstration (14 derniers jours)...');
  const pointagesData = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    for (const agent of agentsCrees) {
      const statut = statuts[Math.floor(Math.random() * statuts.length)];
      pointagesData.push({
        agent: agent._id,
        secteur: secteurs['JNANAT 1']._id,
        date: dateStr,
        statut,
        heureEntree: statut === 'Présent' ? '06:00' : '',
        heureSortie: statut === 'Présent' ? '14:00' : '',
        observation: '',
        saisiPar: respJnanat1._id
      });
    }
  }
  await Pointage.insertMany(pointagesData, { ordered: false }).catch(() => {});

  console.log('\n✅ Données de démonstration créées avec succès !\n');
  console.log('--- Comptes de connexion ---');
  console.log('Admin       -> identifiant: admin           mot de passe: Admin@2026');
  console.log('Responsable -> identifiant: resp.jnanat1     mot de passe: Resp@2026');
  console.log('(Autres secteurs : resp.jnanat2, resp.ceinture, resp.atlas, resp.zouagha / Resp@2026)\n');

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Erreur du script de seed :', err);
  process.exit(1);
});
