const mongoose = require('mongoose')

const { Schema } = mongoose

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    profilePic: {
        type: String,
        default: '',
    },
    isVerified: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('users', UserSchema)