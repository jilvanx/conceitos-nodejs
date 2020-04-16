const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validRequest(request, response, next) {
  const { method } = request;
  const { title, url, techs } = request.body;

  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {

    if (!title) {
      return response.status(400).json({error: 'Invalid repository title'});
    }

    if (!url) {
      return response.status(400).json({error: 'Invalid repository url'});
    }

    if (!Array.isArray(techs)) {
      return response.status(400).json({error: 'Invalid repository techs'});
    }

    if (techs.length <= 0) {
      return response.status(400).json({error: 'Repository techs quantity invalid'});
    }
  
  }
  
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", validRequest, (request, response) => {
  const { title, url, techs, likes } = request.body;

  repository = {id: uuid(), title, url, techs, likes: 0};

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  let repository = repositories.find(repo => repo.id === id);

  if (!repository) {
    return response.status(400).json({error: 'Repository not found.'});
  }

  repository = {...repository, title, url, techs}

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found.'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found.'});
  }

  repositories[repositoryIndex].likes += 1;
  
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
