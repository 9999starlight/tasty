const express = require('express')
const router = express.Router()
const authUser = require('../middlewares/auth_user')
const {
    getAllComments,
    getSingleComment,
    addComment,
    deleteSingleComment,
    deleteMultipleComments
} = require('../controllers/comments_ctrl')
// const { commentValidation } = require('../joi_validation')

// handle GET requests - ???? admin - PROTECTED - added authUser middleware 
router.get('/', authUser, getAllComments)

// GET by id requests - ????
// router.get('/:commentId', getSingleComment)

// handle POST requests - PROTECTED - added authUser middleware 
// router.post('/', authUser, commentValidation, addComment)

// DELETE requests - PROTECTED - added authUser middleware - experimental for admin
router.delete('/:commentId', authUser, deleteSingleComment)

// delete many experimental for admin - PROTECTED - added authUser middleware 
// router.delete('/delmany/:commentauthor', authUser, deleteMultipleComments)

module.exports = router