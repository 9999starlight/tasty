const express = require('express')
const router = express.Router()
const authUser = require('../middlewares/auth_user')
const upload = require('../middlewares/multer')

const {
    getAllRecipes,
    getSingleRecipe,
    getRecipeByQuery,
    addNewRecipe,
    addComment,
    updateRecipe,
    deleteRecipe
} = require('../controllers/recipes_ctrl')
const { newRecipeValidation, updateRecipeValidation, commentValidation } = require('../joi_validation')

// GET requests
router.get('/all', getAllRecipes)
router.get('/single/:recipeId', getSingleRecipe)
router.get('/', getRecipeByQuery)

// POST requests - PROTECTED - added authUser middleware 
router.post('/', authUser, upload.single('image'), newRecipeValidation, addNewRecipe)
router.post('/addComment', authUser, commentValidation, addComment)

// UPDATE requests - PROTECTED - added authUser middleware
// /recipes/single/:id
router.patch('/:recipeId', authUser, updateRecipeValidation, updateRecipe)

// DELETE requests - PROTECTED - added authUser middleware 
router.delete('/:recipeId', authUser, deleteRecipe)

module.exports = router