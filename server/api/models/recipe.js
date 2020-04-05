const mongoose = require('mongoose')

const recipeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    mealName: {
        type: String,
        reqired: true,
        minlength: 4,
        maxlength: 80,
        match: /^(?!\s*$).{4,80}/i
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // ref to user
        reqired: true
    },
    intro: {
        type: String,
        reqired: true,
        minlength: 4,
        maxlength: 80,
        match: /^(?!\s*$).{4,80}/i
    },
    dishType: {
        type: String,
        reqired: true,
        minlength: 3,
        maxlength: 40,
        match: /^(?!\s*$).{3,40}/i
    },
    level: {
        type: String,
        reqired: false,
        default: ''
    },
    timing: {
        type: String,
        reqired: false,
        default: ''
    },
    persons: {
        type: Number,
        reqired: true
    },
    regional: {
        type: String,
        reqired: false,
        default: ''
    },
    vegetarian: {
        type: Boolean,
        reqired: false,
        default: false
    },
    glutenFree: {
        type: Boolean,
        reqired: false,
        default: false
    },
    image: {
        type: Object,
        reqired: false,
        default: {}
    },
    ingredients: {
        type: Array,
        reqired: true
    },
    steps: {
        type: Array,
        reqired: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    rates: [{
        _id: false,
        ratedBy: {
            type: mongoose.Schema.Types.ObjectId
        },
        rate: {
            type: Number
        }
    }],
    rating: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    }] // attach related comments to recipe via ref
})

module.exports = mongoose.model('Recipe', recipeSchema)