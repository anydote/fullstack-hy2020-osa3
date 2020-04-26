require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})

app.get('/info', (request, response) => {
  const now = new Date()
  response.send(`
    <p>The phonebook contains info about ${persons.length} people.</p>
    <p>${now}</p>
  `)
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  // const names = persons.map(p => p.name)

  if (!body.name) {
    return response.status(400).json({ 
      error: 'Name is missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'Number is missing' 
    })
  }

  // if (names.includes(body.name)) {
  //   return response.status(400).json({ 
  //     error: 'Name must be unique' 
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })
  
  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
