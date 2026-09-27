const express = require('express');

const authRoutes = require('./authRoutes');
const serviceRoutes = require('./serviceRoutes');
const requestRoutes = require('./requestRoutes');
const messageRoutes = require('./messageRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/demandes', requestRoutes);
router.use('/messages', messageRoutes);
router.use('/utilisateurs', userRoutes);

module.exports = router;
