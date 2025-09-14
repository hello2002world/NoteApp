const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3
  },
  content: String
}, { timestamps: true }); // Adds createdAt & updatedAt

module.exports = mongoose.model('Note', noteSchema);
