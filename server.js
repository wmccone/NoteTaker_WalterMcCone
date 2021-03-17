const express = require('express');
const path = require('path');
const dataBase= require('./db/db.json')

// Sets up the Express App

const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//(DATA) This code will store the note objects

const notes = [
    {
        "title":"Test Title",
        "text":"Test text"
    },

]


// Basic route sends the user the HTML files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

// Displays the notes
app.get('/api/notes', (req, res) => res.send(notes));

//Posts new data to the server

app.post('/api/notes', (req, res) => {
    console.log(`Adding ${req.body}`)
    // dataBase.push(req.body)
});

app.delete('/api/notes', (req, res) => {
    console.log(`Deleting ${req.body}`)
});

// Starts the server to begin listening

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));