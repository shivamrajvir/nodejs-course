const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization')
        console.log(token)
        const decoded = jwt.verify(token, 'secret12345')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            throw new Error('Invalid Tokenx`')
        }
        req.token = token
        req.user = user
        next()
    } catch (err) {
        console.error(err)
        res.status(401).send({ error: 'Not authenticated' })
    }
}

module.exports = auth;