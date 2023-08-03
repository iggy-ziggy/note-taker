const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('./helpers/uuid'); // maybe?
const noteData = require('./db/db.json');

const PORT = process.env.port || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(express.static('public'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
    // res.json(noteData);
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            review_id: uuid(),
        };

        fs.readFile(noteData, 'utf8', (err, data) => {
            if (err) {
              console.error(err);
            } else {
              const parsedData = JSON.parse(data);
              parsedData.push(newNote);
              writeToFile(parsedData);
            }
          });
        res.send('Note added!')
    } else {
        res.send('There was an error');
    }
});




app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT}`)
);