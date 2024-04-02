// const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//     console.log('give password as argument')
//     process.exit(1)
// }

// const password = process.argv[2]
// const id = process.argv[3]
// const name = process.argv[4]
// const number = process.argv[5]


// const url =
//     // `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`
//     `mongodb+srv://srquitanieves:${password}@cluster0.jleqeb0.mongodb.net/agenda?retryWrites=true&w=majority&appName=Cluster0`

// mongoose.set('strictQuery', false)
// mongoose.connect(url)



// const personSchema = new mongoose.Schema({
//     id: Number,
//     name: String,
//     number: String,
// })

// const Person = mongoose.model('Person', personSchema)

// const person = new Person({
//     id: id,
//     name: name,
//     number: number,
// })

// if (process.argv.length === 3) {
//     Person.find({}).then(results => {
//         console.log('All data in database:')
//         results.forEach(person => {
//             console.log(person)
//         })
//         mongoose.connection.close()
//     }).catch(error => {
//         console.error('Error fetching data:', error)
//         mongoose.connection.close()
//     })
//     process.exit(1)
// }

// person.save().then(result => {
//     console.log(`Added ${name} number: ${number} to phonebook`)
//     mongoose.connection.close()
// })

const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const id = process.argv[3]
const name = process.argv[4]
const number = process.argv[5]

const url = `mongodb+srv://srquitanieves:${password}@cluster0.jleqeb0.mongodb.net/agenda?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

// personSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//         returnedObject.id = returnedObject._id.toString()
//         delete returnedObject._id
//         delete returnedObject.__v
//     }
// })

if (process.argv.length === 3) {
    // Si solo se proporciona la contraseña, mostrar todos los datos de la base de datos
    Person.find({}).then(results => {
        console.log('Phonebook:')
        results.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    }).catch(error => {
        console.error('Error fetching data:', error)
        mongoose.connection.close()
    })
} else if (process.argv.length === 6) {
    // Si se proporcionan todos los datos (id, nombre y número), guardar en la base de datos
    const person = new Person({
        id: id,
        name: name,
        number: number,
    })

    person.save().then(result => {
        console.log(`Added ${name} number: ${number} to phonebook`)
        mongoose.connection.close()
    }).catch(error => {
        console.error('Error saving person:', error)
        mongoose.connection.close()
    })
} else {
    console.log('Invalid number of arguments. Please provide only password or password, id, name, and number.')
    process.exit(1)
}
