// Restreint l'accès à une liste de rôles autorisés
const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Accès refusé : permissions insuffisantes.' });
  }
  next();
};

// Vérifie qu'un responsable n'agit que sur son propre secteur.
// secteurIdGetter(req) doit retourner l'ObjectId du secteur concerné par la requête.
const sameSecteurOrAdmin = (secteurIdGetter) => (req, res, next) => {
  if (req.user.role === 'admin') return next();
  const secteurId = secteurIdGetter(req);
  if (!secteurId || String(secteurId) !== String(req.user.secteur)) {
    return res.status(403).json({ message: 'Accès refusé : ce secteur ne vous appartient pas.' });
  }
  next();
};

module.exports = { allowRoles, sameSecteurOrAdmin };
