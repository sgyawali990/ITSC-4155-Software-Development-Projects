require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const alertRoutes = require('./routes/alerts.routes');

const app = express();

// middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// connect DB
connectDB();

// routes
app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/alerts', alertRoutes);

module.exports = app;