const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/notesApp');
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1); // Stop app if DB fails
  }
};

module.exports = connectDB;
