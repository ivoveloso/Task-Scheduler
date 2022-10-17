const express = require('express');
const path = require('path');
// Helper method for generating unique ids
const dataB = require('./db/db.json');
const uuid = require('./db/uuid');
const fs = require('fs');

const PORT = process.env.PORT || 3002;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET '/' will return index.html
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET request for db
app.get('/api/notes', (req, res) => {
  console.info(`GET /api/notes`);
      // Obtain existing notes
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          res.status(200).json(JSON.parse(data));
        }
      });
});

// POST request to add a note
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a review`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    // Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new note
        parsedNotes.push(newNote);

        // Write updated notes back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting review');
  }
});

app.delete('/api/notes/:category', (req, res) => {
  const requestedID = req.params.category.toLowerCase();
  console.log(requestedID);

  if (requestedID) {

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);
      
      if (requestedID) {
        for (let i = 0; i < parsedNotes.length; i++) {
          if (requestedID === parsedNotes[i].id) {
            console.log(parsedNotes);
            parsedNotes.splice(i, 1);
            console.log(parsedNotes);
            return fs.writeFile(
              './db/db.json',
              JSON.stringify(parsedNotes, null, 4),
              (writeErr) =>
                writeErr
                  ? console.error(writeErr)
                  : console.info('Successfully deleted notes!'));
          }
        }
      }
    }
  });

  console.log('1');
  res.status(201).json('Success');
} else {
  res.status(500).json('Error in posting review');
}

});

// GET '*' will return index.html 
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`https://protected-headland-50117.herokuapp.com/🚀`)
);
