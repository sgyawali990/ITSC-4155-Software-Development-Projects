require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 4000;

async function startServer(){
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Backend running on http://localhost:${PORT}`);
    })
}

startServer();