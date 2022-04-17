const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email Address')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password should not contain password')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) { throw new Error('Invalid') }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// instance method
// userSchema.methods.getPublicProfile = function() {
userSchema.methods.toJSON = function() {
    const user = this
    let userObject = user.toObject()
    delete userObject.tokens
    delete userObject.password
    return userObject
}

// instance method
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'secret12345') // used user.email as a secret
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}


// model method
userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email })

    if (!user) { throw new Error('User not found') }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) { throw new Error('Invalid password') }

    return user
}

// hash the password before saving
userSchema.pre('save', async function(next) {
    const user = this
    console.log('Before saving');
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    // important as if this is not called, it would get stuck and never go further in execution
    next()
})

const User = mongoose.model('User', userSchema)


module.exports = User;