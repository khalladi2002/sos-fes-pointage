const User = require('../models/User');
const Secteur = require('../models/Secteur');

// GET /api/users?role=responsable
const getUsers = async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  const users = await User.find(filter).select('-password').populate('secteur', 'nom').sort('nom');
  res.json(users);
};

// POST /api/users (admin uniquement)
const createUser = async (req, res) => {
  try {
    const { nom, username, password, role, secteur, telephone } = req.body;
    const exists = await User.findOne({ username: username.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'Cet identifiant existe déjà.' });

    const user = await User.create({ nom, username, password, role, secteur: secteur || null, telephone });
    if (role === 'responsable' && secteur) {
      await Secteur.findByIdAndUpdate(secteur, { responsable: user._id });
    }
    const { password: pw, ...safeUser } = user.toObject();
    res.status(201).json(safeUser);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /api/users/:id (admin uniquement)
const updateUser = async (req, res) => {
  try {
    const { nom, username, role, secteur, telephone, actif, password } = req.body;
    const update = { nom, username, role, secteur: secteur || null, telephone, actif };
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });
    Object.assign(user, update);
    if (password) user.password = password;
    await user.save();
    if (role === 'responsable' && secteur) {
      await Secteur.findByIdAndUpdate(secteur, { responsable: user._id });
    }
    const { password: pw, ...safeUser } = user.toObject();
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// DELETE /api/users/:id (admin uniquement)
const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Utilisateur supprimé.' });
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
