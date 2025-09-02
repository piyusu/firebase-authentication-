const express = require('express');
const admin = require('../config/firebaseAdmin');
const User = require('../models/User');
const { verifyFirebaseIdToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Assign role to user (admin only)
router.post('/assign-role', verifyFirebaseIdToken, requireRole(['admin']), async (req, res) => {
  try {
    const { uid, role } = req.body;
    if (!['admin', 'user'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

    await admin.auth().setCustomUserClaims(uid, { role });
    const user = await User.findOneAndUpdate(
      { uid },
      { uid, role },
      { new: true, upsert: true }
    );
    res.json({ message: 'Role assigned', user });
  } catch (err) {
    res.status(400).json({ error: 'Failed to assign role' });
  }
});

// Get my profile
router.get('/me', verifyFirebaseIdToken, async (req, res) => {
  try {
    const profile = await User.findOne({ uid: req.user.uid });
    res.json({ firebase: { uid: req.user.uid, email: req.user.email, role: req.user.role || (req.user.customClaims && req.user.customClaims.role) }, app: profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

module.exports = router;


