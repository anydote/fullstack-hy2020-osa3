require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/info', (req, res) => {
  const now = new Date()
  res.send(`
    <p>The phonebook contains info about ${persons.length} people.</p>
    <p>${now}</p>
  `)
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person.toJSON())
  })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  // const names = persons.map(p => p.name)

  if (!body.name) {
    return res.status(400).json({ 
      error: 'Name is missing' 
    })
  }

  if (!body.number) {
    return res.status(400).json({ 
      error: 'Number is missing' 
    })
  }

  // if (names.includes(body.name)) {
  //   return res.status(400).json({ 
  //     error: 'Name must be unique' 
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })
  
  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
