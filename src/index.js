require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const { v4: uuidv4 } = require('uuid');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// 3. Set up CORS (allow all origins for now)
app.use(cors({
  origin: '*'
}));

app.use(express.json());

connectDB();


// ✅ Handle favicon requests (prevents 500 errors)
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/favicon.png', (req, res) => res.status(204).end());


app.get('/', (req, res) => {
  res.json({
    message: "server is running",
    status: "success"
  });
});

app.use('/api/profiles', profileRoutes);


module.exports = app;