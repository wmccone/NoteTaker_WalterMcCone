const express = require('express');
const path = require('path');
const dataBase = require('./db/db.json');
const fs = require('fs');
const randomId = require('random-id');

// Sets up the Express App

const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


// Basic route sends the user the HTML files

//Route for the index page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

//Route for the Notes page
app.get('/notes', (req, res) => {
    console.log("on notes")
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Displays the notes to the page
app.get('/api/notes', (req, res) => {
    //going to read the data from the database file and set it to a constant
    const fileData = JSON.parse(fs.readFileSync('./db/db.json', 'Utf8', (error, data) => {
        if (error) {
            console.error(error)
        }
        else {
            // let content = JSON.stringify(data)
            console.log(data)
        }
    }));
    //going to push the file data back to the page in a response
    res.json(fileData);
    res.end();

});

//Posts new data to the server

app.post('/api/notes', (req, res) => {
    //sets the request to a constant
    const newNote = req.body;
    //pulls the current data in the database to check against
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
    const len = 20;
    const pattern = '0';
    newNote.id = parseInt(randomId(len, pattern));
    //checks for and fixes duplicate id's in the database
    for (let i = 0; i < fileData.length; i++) {
        if (fileData[i].id === newNote.id) {
            let newId = toString(newNote.id) + '1'
            newNote.id = parseInt(newId)
            return newNote
        }
    };

    //Going to write new data to the database array
    fileData.push(newNote)

    //pushes the database array back into the db.json file
    fs.writeFileSync('./db/db.json', JSON.stringify(fileData), (error) => {
        if (error) {
            console.error(error)
        }
        else {
            console.log('Successfully updated database')
        }
    });

    //ends the response
    res.end();

});
//Set up the delete route
app.delete('/api/notes/:id', (req, res) => {
    //Parses the object data from the request
    const noteId = JSON.parse(req.params.id);
    //Retrieves the current data in the database
    const fileData = JSON.parse(fs.readFileSync('./db/db.json', 'Utf8', (error, data) => {
        if (error) {
            console.error(error)
        }
        else {
            return data
        }
    }))
    //Going to iterate through the database array to find and remove the id with the matching object
    for (let i = 0; i < fileData.length; i++) {
        if (fileData[i].id === noteId) {
            fileData.splice(i, 1)
            break;
        }
    }
    //Going to push the updated note array back to the database file
    fs.writeFileSync('./db/db.json', JSON.stringify(fileData), (error) => {
        if (error) {
            console.error(error)
        }
        else {
            console.log('Successfully updated database')
        }
    })
    //End the request on the page
    res.end()
});


// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));