
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
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
})

// const Person = mongoose.model('Person', personSchema)


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.use(express.static('dist'))

morgan.token('postData', function (req, res) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body);
    } else {
        return '*****';
    }
});


app.use(morgan(':method :url :status :res[content-length] - :response-time ms - Data: :postData'));


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unkn0wn endpoint' })
}

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

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        // response.status(404).end()
        response.send(`The person with the id ${id} does not exists`)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

// add new person
app.post('/api/persons', (request, response) => {
    const person = request.body
    const id = Math.floor(Math.random() * 1000);
    person.id = id

    if (!person.name) {
        return response.status(400).json({
            error: 'Name is empty'
        })
    }

    const existingPerson = persons.find(personInArray => personInArray.name === person.name)

    if (existingPerson) {
        return response.status(400).json({ error: 'This person is already in the phonelist' });
    }


    persons = persons.concat(person)



    console.log(person)
    response.json(person)
})


app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// const PORT = 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)