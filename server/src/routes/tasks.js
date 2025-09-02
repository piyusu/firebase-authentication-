const express = require('express');
const Task = require('../models/Task');
const { verifyFirebaseIdToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Create Task - admin and user can create
router.post('/', verifyFirebaseIdToken, requireRole(['admin', 'user']), async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await Task.create({ title, description, ownerUid: req.user.uid });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create task' });
  }
});

// Read Tasks - admin can see all, user sees own
router.get('/', verifyFirebaseIdToken, requireRole(['admin', 'user']), async (req, res) => {
  try {
    const role = req.user.role || (req.user.customClaims && req.user.customClaims.role) || 'user';
    const query = role === 'admin' ? {} : { ownerUid: req.user.uid };
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Update Task - admin can update any, user only own
router.put('/:id', verifyFirebaseIdToken, requireRole(['admin', 'user']), async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const role = req.user.role || (req.user.customClaims && req.user.customClaims.role) || 'user';
    const filter = role === 'admin' ? { _id: id } : { _id: id, ownerUid: req.user.uid };
    const task = await Task.findOneAndUpdate(filter, update, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update task' });
  }
});

// Delete Task - only admin can delete
router.delete('/:id', verifyFirebaseIdToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Task.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ error: 'Task not found' });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;


