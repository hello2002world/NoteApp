const express = require('express');
const app = express();
const connectDB = require('./config/db');
const logger = require('./middleware/logger');
const notesRoutes = require('./routes/notes');
const cors = require("cors");
const PORT = 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(logger);
app.use(express.json());

// Basic routes
app.get('/', (req, res) => res.send("Hello World"));
app.get('/about', (req, res) => res.json({ name: "Mahima", role: "Frontend Developer" }));
app.get('/hello/:name', (req, res) => res.send(`Hello, ${req.params.name}!`));

// Notes CRUD routes
app.use('/notes', notesRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
