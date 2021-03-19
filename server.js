const express = require('express');
const path = require('path');
const dataBase= require('./db/db.json')
const fs = require('fs')

// Sets up the Express App

const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//(DATA) This code will store the note objects

const notes = [
    {
        "title":"Test Title",
        "text":"Test text"
    },

]


// Basic route sends the user the HTML files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));


app.get('/notes', (req, res) => {
    console.log("on notes")
    res.sendFile(path.join(__dirname, './public/notes.html'));;
})

// Displays the notes
app.get('/api/notes', (req, res) => {

    fs.readFile('db/db.json', (error, data) => {
     error ? console.error(error) : res.json(data)
    })

    // res.json(data)
    // res.end()
});

//Posts new data to the server
let id = 1
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = toString(id)
    dataBase.push(req.body);
    res.end()
    return id++
    
});

app.delete('/api/notes/:id', (req, res) => {
    let noteId = req.params.id;

    for(let i = 0; i < dataBase.length; i++){
        console.log(dataBase[i].routename)
        if(dataBase[i].routename == noteId) {
            dataBase.splice(i, 1)
            break;
        }
    }
    console.log(`Deleting ${req.id}`)
    res.end()
});

// Starts the server to begin listening

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));