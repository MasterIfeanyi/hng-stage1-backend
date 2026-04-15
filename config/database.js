// config/database.js
const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }
  
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('Database connected successfully');
    return db;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

module.exports = { connectDB };