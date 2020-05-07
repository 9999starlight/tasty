const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const mongoPass = process.env.MONGO_PASS
 // enable findByIdAndUpdate without deprication warning:
mongoose.set('useFindAndModify', false)

mongoose.connect(`mongodb+srv://irenamongo:${mongoPass}@tasty-eyv2p.mongodb.net/test?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected!'))
    .catch(err => {
        console.log(`MongoDB connection Error: ${err.message}`);
    })
mongoose.set('useCreateIndex', true) // to ignore warning: DeprecationWarning: collection.ensureIndex is deprecated

// middlewares
app.use(morgan('tiny')) // base url, time, etc in console
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: false
}))
// added to limit file upload
/* app.use(bodyParser.urlencoded({ extended: false, limit: 1024 * 1024 * 2, type: 'application/x-www-form-urlencoded' })) */

app.use(bodyParser.json()) // parse data from client


// Import routes
const recipesRoutes = require('./api/routes/recipes')
const commentsRoutes = require('./api/routes/comments')
const usersRoutes = require('./api/routes/users')

app.use('/recipes', recipesRoutes)
app.use('/comments', commentsRoutes)
app.use('/users', usersRoutes)

// handle & forward reqest errors
app.use((res, req, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})
// get error
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`server is running on port ${port}`))