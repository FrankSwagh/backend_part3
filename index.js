const express = require("express");
var morgan = require('morgan')
const app = express();

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const cors = require('cors')

app.use(cors())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.get("/", (request, response) => {
  response.send("<h1>Prueba de servidor</h1>");
});

app.get("/info", (request, response) => {
  const date = Date();
  response.send(`
        <div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
        </div>`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  let person = {};
  person = persons.find((person) => person.id == id);
  person ? response.json(person) : response.status(204).end();
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id != id);
  response.status(204).end();
});

const idPerson = () => {
  return Math.floor(Math.random() * 1000);
};

app.post("/api/persons/", (request, response) => {
  const body = request.body;
  console.log(body.name);

  if (!body){
    return response.status(400).json({
      error: "content missing",
    })} else if(body.name == ""){
        return response.status(400).json({
            error: "name is required"
        })
    }else if(body.number == ""){
        return response.status(400).json({
            error: "number is required"
        })
    }else if(persons.find(p => p.name == body.name)){
        return response.status(400).json({
            error: "name must be unique"
        })
    }

  const person = {
    id: idPerson(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
