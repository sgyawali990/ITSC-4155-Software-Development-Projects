require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = require('./app'); 

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).send('Backend is running');
});

async function startServer() {
    try {
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`Backend running on http://localhost:${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

console.log("Attempting to connect to:", process.env.MONGO_URI);
startServer();