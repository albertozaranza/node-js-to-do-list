const express = require("express");

const server = express();

server.use(express.json());

let projects = [];
let numberOfRequests = 0;

server.use((req, res, next) => {
  numberOfRequests++;
  console.log(`Número de requisições: ${numberOfRequests}`);
  return next();
});

function checkProjectExists(req, res, next) {
  const project = projects[req.params.id];
  if (!project) {
    res.status(400).json({ erro: "Project does not exist" });
  }
  return next();
}

server.post("/projects", (req, res) => {
  const { id, title, tasks } = req.body;
  projects.push({ id, title, tasks });
  return res.json(projects);
});
server.get("/projects", (req, res) => {
  return res.json(projects);
});
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  projects[id].title = title;
  return res.json(projects);
});
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  projects.splice(id, 1);
  return res.send();
});
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  projects[id].tasks.push(title);
  return res.json(projects);
});

server.listen(3001);
