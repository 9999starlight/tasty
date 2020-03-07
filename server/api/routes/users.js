const express = require('express')
const router = express.Router()
const authUser = require('../middlewares/auth_user')
const {
    registerUser,
    loginUser,
    getSingleUser,
    deleteUser
} = require('../controllers/users_ctrl')
const { registerValidation, loginValidation } = require('../joi_validation')
const upload = require('../middlewares/multer')


router.post('/register', upload.single('user_image'), registerValidation, registerUser)
router.post('/login', loginValidation, loginUser)
router.get('/:userId', getSingleUser)

// delete User - PROTECTED - added authUser middleware 
// router.delete('/:userId', authUser, deleteUser)

module.exports = router