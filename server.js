const express = require('express');
const path = require('path');
const dataBase = require('./db/db.json')
const fs = require('fs')
const randomId = require('random-id')

// Sets up the Express App

const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//(DATA) This code will store the note objects

// const notes = [
//     {
//         "title": "Test Title",
//         "text": "Test text"
//     },

// ]


// Basic route sends the user the HTML files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));


app.get('/notes', (req, res) => {
    console.log("on notes")
    res.sendFile(path.join(__dirname, './public/notes.html'));;
})

// Displays the notes
app.get('/api/notes', (req, res) => {

    const fileData = JSON.parse(fs.readFileSync('./db/db.json', 'Utf8', (error, data) => {
        if (error) {
            console.error(error)
        }
        else {
            // let content = JSON.stringify(data)
            console.log(data)
        }
    }))
    res.json(fileData)
    res.end()

    // res.json(data)
    // res.end()
});

//Posts new data to the server

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const fileData = JSON.parse(fs.readFileSync('./db/db.json', 'Utf8', (error, data) => {
        if (error) {
            console.error(error)
        }
        else {
            return data
        }
    })
    )
    //assigns a random id to the note
    const len = 20
    const pattern = '0'
    newNote.id = parseInt(randomId(len, pattern))
    // for(let i =0; i<fileData.length; i++){
    //     if(fileData[i].id === tempId){
    //         tempId++
    //     }
    
    fileData.push(newNote)
    fs.writeFileSync('./db/db.json', JSON.stringify(fileData), (error) => {
        if (error) {
            console.error(error)
        }
        else {
            // let content = JSON.stringify(data)
            console.log('Successfully updated database')
        }
    })
    res.end()

});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = JSON.parse(req.params.id);
    console.log(noteId)

    const fileData = JSON.parse(fs.readFileSync('./db/db.json', 'Utf8', (error, data) => {
        if (error) {
            console.error(error)
        }
        else {

            return data
        }
    }))

    for (let i = 0; i < fileData.length; i++) {
        if (fileData[i].id === noteId) {
            fileData.splice(i, 1)
            break;
        }
    }
    console.log(fileData)
    fs.writeFileSync('./db/db.json', JSON.stringify(fileData), (error) => {
        if (error) {
            console.error(error)
        }
        else {
            // let content = JSON.stringify(data)
            console.log('Successfully updated database')
        }
    })

    res.end()
});

// Starts the server to begin listening

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));