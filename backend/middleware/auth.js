const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Non autorisé. Token manquant.' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.actif) {
      return res.status(401).json({ message: 'Utilisateur introuvable ou désactivé.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
};

module.exports = { protect };
