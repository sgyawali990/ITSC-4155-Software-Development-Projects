require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// IMPORT ROUTES
const authRoutes = require('./routes/auth.routes');
const templateRoutes = require('./routes/template.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const alertRoutes = require('./routes/alerts.routes'); 
const storeRoutes = require('./routes/store.routes');  

const app = express();
const PORT = process.env.PORT || 4000;

// MIDDLEWARE
app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(express.json());

// HEALTH CHECK
app.get('/health', (req, res) => {
    res.status(200).send('InvQ Backend is healthy and running');
});

// REGISTER ROUTES
app.use('/auth', authRoutes);
app.use('/templates', templateRoutes); 
app.use('/inventory', inventoryRoutes);
app.use('/alerts', alertRoutes); 
app.use('/store', storeRoutes);     

// START SERVER
async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`InvQ Backend running on http://localhost:${PORT}`);
            console.log(`Store Routes: http://localhost:${PORT}/store`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();