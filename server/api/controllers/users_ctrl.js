const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// user Schema
const User = require('../models/user')


exports.registerUser = async (req, res, next) => {
    try {
        const checkUsername = await User.find({
            username: req.body.username
        })
        if (checkUsername.length) {
            return res.status(409).json({
                message: 'Username already exists!'
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            password: hashPassword
        })
        const savedUser = await user.save()
        console.log(savedUser)
        res.status(201).json({
            message: 'User created'
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            error,
            message: error.message
        })
    }
}

exports.loginUser = async (req, res, next) => {
    try {
        const user = await User.find({
            username: req.body.username
        })
        // check if username exists
        if (!user.length) {
            return res.status(401).json({
                message: `Invalid username or password or there is no user record`
            })
        }
        // if user exists, compare password
        await bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: `Invalid username or password or there is no user record`
                })
            }
            if (result) {
                const token = jwt.sign({
                        username: user[0].username,
                        userId: user[0]._id
                    },
                    process.env.JWT_KEY, {
                        expiresIn: '2h'
                    }
                )
                return res.status(200).json({
                    message: 'Successfully logged in',
                    token
                })
            }
            return res.status(401).json({
                message: `Invalid username or password or there is no user record`
            })
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            error,
            message: error.message
        })
    }
}

exports.getSingleUser = async (req, res, next) => {
    try {
        const id = req.params.userId
        const doc = await User.findById(id)
                // console.log('getting user: ', doc)
                if (doc)
                    res.status(200).json(doc)
                else
                    res.status(404).json({
                        message: "no result for reqested user"
                    })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            error,
            message: error.message
        })
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId)
        // console.log('user log: ' + user)
        if (user.image) {
            await cloudinary.uploader.destroy(user.image.id);
        }
        await user.remove()
        res.status(200).json({
            message: 'User deleted'
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            error,
            message: error.message
        })
    }
}