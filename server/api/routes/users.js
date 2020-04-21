const express = require('express')
const router = express.Router()
const authUser = require('../middlewares/auth_user')
const {
    registerUser,
    loginUser,
    getSingleUser,
    deleteUser,
    updateUserImage,
    addToFavorites
} = require('../controllers/users_ctrl')
const { registerValidation, loginValidation, favoritesValidation } = require('../joi_validation')
const upload = require('../middlewares/multer')

// @desc    POST user registration
// @route   POST /users/register
// @access  PUBLIC
router.post('/register', upload.single('user_image'), registerValidation, registerUser)

// @desc    POST login user
// @route   POST /users/login
// @access  PUBLIC
router.post('/login', loginValidation, loginUser)

// @desc    GET get single user
// @route   GET /users/:userId
// @access  Private
router.get('/:userId', authUser, getSingleUser)

// @desc    PATCH update user photo
// @route   PATCH /users/:userId
// @access  Private
router.patch('/:userId', authUser, upload.single('user_image'), updateUserImage)

// @desc    PATCH update user photo
// @route   PATCH /users/:userId
// @access  Private
router.patch('/favorites/:userId', authUser, favoritesValidation, addToFavorites)

// @desc    DELETE remove user
// @route   DELETE /users/:userId
// @access  ADMIN
router.delete('/:userId', authUser, deleteUser)

module.exports = router