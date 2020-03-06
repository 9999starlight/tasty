const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 20,
        match: /^[a-z0-9_-]{4,20}$/igm  // alpfanumeric, alowed _ -
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
/*     user_image: {
        type: String, reqired: false
    }, */
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema)