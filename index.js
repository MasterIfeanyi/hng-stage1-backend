require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 8000;

// 3. Set up CORS (allow all origins for now)
app.use(cors({
  origin: '*'
}));

app.use(express.json());

connectDB();


app.get('/', (req, res) => {
  res.json({
    message: "server is running",
    status: "success"
  });
});

// 5. Open the gates!
app.listen(PORT, () => {
  console.log(`Tower is alive at http://localhost:${PORT}`);
});