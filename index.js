
require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const morgan = require('morgan')
app.use(express.json())
const cors = require('cors')
app.use(cors())


const mongoose = require('mongoose')

const password = process.argv[2]

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url =
    `mongodb+srv://srquitanieves:${password}@cluster0.jleqeb0.mongodb.net/agenda?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
// mongoose.connect(url)

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
})

// const Person = mongoose.model('Person', personSchema)



app.use(express.static('dist'))
//middleware
morgan.token('postData', function (req, res) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body);
    } else {
        return '*****';
    }
});

//middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        // console.log("name valitading error", error.response.data.error)
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unkn0wn endpoint' })
}

app.use(morgan(':method :url :status :res[content-length] - :response-time ms - Data: :postData'));




// Data obtained from local
// app.get('/api/persons', (request, response) => {
//     response.json(persons)
// })

// Data obtained from DB
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {

    const counter = persons.map((object, index) => {
        return 1
    }).length
    const date = new Date()

    response.send(`Phonebook has info for ${counter} people. <br/> ${date} `)

})

//search person
// app.get('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const person = persons.find(person => person.id === id)

//     if (person) {
//         response.json(person)
//     } else {
//         // response.status(404).end()
//         response.send(`The person with the id ${id} does not exists`)
//     }
// })

app.get('/api/persons/:id', (request, response) => {
    const id = (request.params.id)
    Person.findById(id)
        .then(result => {
            response.json(result)
        }).catch(error => {

            // response.status(404).end()
            console.log(error)
            response.send(`The person with the id ${id} does not exists. <br> Error: ${error}`)
        }
        )
})

// app.delete('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     persons = persons.filter(person => person.id !== id)

//     response.status(204).end()
// })

app.delete('/api/persons/:id', (request, response, next) => {
    const id = (request.params.id)

    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})


// add new person
// app.post('/api/persons', (request, response) => {
//     const person = request.body
//     const id = Math.floor(Math.random() * 1000);
//     person.id = id

//     if (!person.name) {
//         return response.status(400).json({
//             error: 'Name is empty'
//         })
//     }

//     const existingPerson = persons.find(personInArray => personInArray.name === person.name)

//     if (existingPerson) {
//         return response.status(400).json({ error: 'This person is already in the phonelist' });
//     }

//     persons = persons.concat(person)

//     console.log(person)
//     response.json(person)
// })

//add new person
app.post('/api/persons', (request, response, next) => {
    const personData = request.body
    const id = Math.floor(Math.random() * 1000);
    // person.id = id

    if (personData.name === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        // id: id,
        name: personData.name,
        number: personData.number
    });

    person.save().then(savedPerson => {
        response.status(201).json(savedPerson);
    }).catch(error => next(error))

})

//change number
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        id: body.id,
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// const PORT = 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)