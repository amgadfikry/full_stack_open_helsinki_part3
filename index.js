const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :req-body'));

morgan.token('req-body', (req, res) => {
  if (req.method === 'POST' && req.body) {
    return JSON.stringify(req.body);
  }
  return '-';
});

let data = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
  res.json(data)
})

app.get('/info', (req, res) => {
  const date = new Date()
  const html = `<p>Phonebook has info for ${data.length} people <br></br> ${date}</p>`
  res.send(html)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = data.find(p => p.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person  = data.find(p => p.id === id)
  if (person) {
    data = data.filter(p => p.id !== id)
    res.status(204).send("Deleted successfully")
  } else {
    res.status(400).send("Failed to Deleted")
  }
})

app.post('/api/persons', (req, res) => {
  const id = Math.floor(Math.random() * 500)
  const obj = req.body
  if (!obj.name || !obj.number) {
    return res.status(400).json({error: 'missing fields'})
  }
  const person = data.find(p => p.name === obj.name)
  if (person) {
    return res.status(409).json({ error: 'name must be unique' })
  }
  obj.id = id
  data.push(obj)
  res.json(obj)
})

const port = process.env.PORT || 3000

app.listen(port, () =>  console.log('Server is running'))
