const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
    }
})

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