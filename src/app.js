const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function isValidId(request, response, next) {

  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID.'})
  }

  return next();

}

app.get("/repositories", (request, response) => {
  
  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
 
  const { title, url, techs } = request.body;
  const repositorie = {id: uuid(), title, url, techs, likes: 0}
  
  repositories.push(repositorie);

  return response.json(repositorie);

});

app.put("/repositories/:id", isValidId, (request, response) => {
  
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  
  if (repositorieIndex < 0) {
    return response.status(400).json({error: 'Repositorie not found'});
  }

  const oldLikes = repositories[repositorieIndex].likes;
  const repositorie = { id, title, url, techs, likes: oldLikes };
  
  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);

});

app.delete("/repositories/:id", isValidId, (request, response) => {
  
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({error: 'Repositorie not found'});
  }

  repositories.splice(repositorieIndex, 1);

  return response.status(204).json();

});

app.post("/repositories/:id/like", isValidId, (request, response) => {
  
  const { id } = request.params;
  
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({error: 'Repositorie not found'});
  }

  repositories[repositorieIndex].likes = repositories[repositorieIndex].likes + 1;
  
  return response.json(repositories[repositorieIndex]);

});

module.exports = app;
