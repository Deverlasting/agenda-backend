const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    // `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`
    `mongodb+srv://srquitanieves:${password}@cluster0.jleqeb0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    id: int,
    name: String,
    number: int,
})

const Person = mongoose.model('Person', noteSchema)

const person = new Person({
    id: 1,
    name: "Manolito",
    number: "666-666-666",
})

person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
})