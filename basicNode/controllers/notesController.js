const Note = require("../modules/Note");
const mongoose = require("mongoose");

exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Notes fetched successfully",
      count: notes.length,
      notes: notes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validation
    if (!title || title.trim().length < 3) {
      return res
        .status(400)
        .json({ error: "Title must be at least 3 characters long" });
    }

    const note = new Note({ title, content });
    const savedNote = await note.save();

    res.status(201).json({
      message: "Note created successfully",
      note: savedNote,
    });
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ error: "Server error, could not create note" });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNote = await Note.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedNote) {
      return res
        .status(404)
        .json({ title: "Note Not Found", message: "Note does not exist" });
    }
    res.status(200).json({
      title: "Note Updated",
      message: `Your note "${updatedNote.title}" has been updated!`,
      note: updatedNote,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res
      .status(200)
      .json({ message: "Note deleted successfully", id: deletedNote._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchNotes = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } }
        ]
      };
    }

    const notes = await Note.find(query).sort({ updatedAt: -1 });
    res.json({ notes: notes || [] });  
  } catch (error) {
    res.status(500).json({ error: error.message, notes: [] }); 
  }
};


