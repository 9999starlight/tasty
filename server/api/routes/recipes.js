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

// GET
// @desc    Get all recipes
// @route   GET /recipes/all
// @access  Public
router.get('/all', getAllRecipes)
// @desc    Get single recipe
// @route   GET /recipes/single/:recipeId
// @access  Public
router.get('/single/:recipeId', getSingleRecipe)
// @desc    Get recipe by query
// @route   GET ?...
// @access  Public
router.get('/', getRecipeByQuery)

// POST
// @desc    POST recipe
// @route   POST
// @access  Private
router.post('/', authUser, upload.single('image'), newRecipeValidation, addNewRecipe)
// @desc    POST comment
// @route   POST /addComment
// @access  Private
router.post('/addComment', authUser, commentValidation, addComment)

// UPDATE
// @desc    PATCH recipe
// @route   PATCH /:recipeId
// @access  Private
router.patch('/:recipeId', authUser, updateRecipeValidation, updateRecipe)

// DELETE
// @desc    DELETE recipe
// @route   DELETE /:recipeId
// @access  Private
router.delete('/:recipeId', authUser, deleteRecipe)

module.exports = router