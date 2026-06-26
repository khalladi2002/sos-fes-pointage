const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h'
  });

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Identifiant et mot de passe requis.' });
    }
    const user = await User.findOne({ username: username.toLowerCase() }).populate('secteur', 'nom');
    if (!user || !user.actif) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }
    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        nom: user.nom,
        username: user.username,
        role: user.role,
        secteur: user.secteur
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// GET /api/auth/me
const me = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('secteur', 'nom');
  res.json(user);
};

// PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const match = await user.comparePassword(oldPassword);
    if (!match) return res.status(400).json({ message: 'Ancien mot de passe incorrect.' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Mot de passe mis à jour.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { login, me, changePassword };
