const admin = require('../config/firebaseAdmin');

async function verifyFirebaseIdToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing Bearer token' });

    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // contains uid, email, custom claims, etc.
    
    // Set default role if none exists
    if (!req.user.role && (!req.user.customClaims || !req.user.customClaims.role)) {
      req.user.role = 'user'; // Default role for all authenticated users
    }
    
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });
    
    // Get role from custom claims first, then fallback to user.role
    const role = (req.user.customClaims && req.user.customClaims.role) || req.user.role || 'user';
    
    if (!allowedRoles.includes(role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

module.exports = { verifyFirebaseIdToken, requireRole };


