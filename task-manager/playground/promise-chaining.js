require('../src/db/mongoose')

const User = require('../src/models/user')

// User.findByIdAndUpdate('624048cbeba1773fd0e1f068', { age: 1 }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 1 })
// }).then((userCount) => {
//     console.log(userCount)
// }).catch((err) => {
//     console.error(err)
// })

const updateAgeAndCount = async(id, age) => {
    const user = await User.findByIdAndUpdate(id, { age: 1 })
    const count = await User.countDocuments({ age })
    return count;
}

updateAgeAndCount('624048cbeba1773fd0e1f068', 1).then((count) => {
    console.log(count)
}, (error) => {
    console.error(error)
})