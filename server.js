const express = require('express');
const { animals } = require('./data/animals');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    personalityTraitsArray.forEach(trait => {
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  return filteredResults;
}

function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}

function createNewAnimal(body, animalsArray) {
  const animal = body;
  animalsArray.push(animal);
  fs.writeFileSync(
    path.join(_dirname, './data/animals.json'),
    JSON.stringify({ animals: animalsArray}, null, 2)
  );

  return animal;
  
  //console.log(body);
  //return body;
}

app.get('/api/animals', (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/animals', (req, res) => {
   // console.log(req.body);
   req.body.id = animals.length.toString();
   const animal = createNewAnimal(req.body, animals);
    res.json(animal);
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});