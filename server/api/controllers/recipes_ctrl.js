const mongoose = require('mongoose')
const Recipe = require('../models/recipe')
const Comment = require('../models/comment')
// const sharp = require('sharp')
const cloudinary = require('cloudinary')
require('../middlewares/cloudinary')

// GET
exports.getAllRecipes = async (req, res, next) => {
    try {
        const docs = await Recipe.find()
        //console.log("getting ALL from database", docs)
        //const orgUrl = req.originalUrl.slice(0, 8)
        const response = {
            recipes: docs.map(doc => {
                return {
                    author: doc.author,
                    mealName: doc.mealName,
                    intro: doc.intro,
                    _id: doc._id,
                    level: doc.level,
                    image: doc.image.url,
                    rating: doc.rating,
                    request: {
                        type: 'GET',
                        url: `${req.protocol}://${req.get('host')}/recipes/single/${doc._id}` // works wherever deployed 
                    }
                }
            })
        }
        res.status(200).json(response)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            error,
            message: error.message
        })
    }
}

exports.getSingleRecipe = async (req, res, next) => {
    const id = req.params.recipeId
    try {
        const doc = await Recipe.findById(id)
            .populate('author') // get author info
            .populate({
            path: 'comments',
            // Get comment's author info
            populate: { path: 'author' }
          })
        //.select('mealName author intro rating')// dodati sve za single recipe
        console.log("getting single recipe" + doc)
        if (doc)
            res.status(200).json(doc)
        else
            res.status(404).json({
                message: "no result for reqested recipe"
            })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            error,
            message: error.message
        })
    }
}

exports.getRecipeByQuery = async (req, res, next) => {
    const query = req.query
    try {
        const docs = await Recipe.find(query)
        console.log("getting by query", docs)
        const response = {
            recipes: docs.map(doc => {
                return {
                    author: doc.author,
                    mealName: doc.mealName,
                    intro: doc.intro,
                    _id: doc._id,
                    level: doc.level,
                    image: doc.image.url,
                    rating: doc.rating,
                    request: {
                        type: 'GET',
                        url: `${req.protocol}://${req.get('host')}/recipes/single/${doc._id}` // works wherever deployed 
                    }
                }
            })
        }
        res.status(200).json(response)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            error,
            message: error.message
        })
    }
}

exports.addNewRecipe = async (req, res, next) => {
    // create new recipe
    try {
        let imageresult = ''
        if (req.file)
            imageresult = await cloudinary.uploader.upload(req.file.path)
        const recipe = new Recipe({
            _id: new mongoose.Types.ObjectId(),
            mealName: req.body.mealName,
            author: req.body.author, // author._id
            intro: req.body.intro,
            dishType: req.body.dishType,
            level: req.body.level,
            timing: req.body.timing,
            persons: req.body.persons,
            regional: req.body.regional,
            vegetarian: req.body.vegetarian,
            glutenFree: req.body.glutenFree,
            image: {
                url: imageresult.secure_url,
                id: imageresult.public_id
            },
            ingredients: req.body.ingredients,
            steps: req.body.steps,
            rating: req.body.rating
        })
        const result = await recipe.save()
        //console.log(result)
        res.status(201).json({
            message: 'new recipe created',
            // created
            createdRecipe: result
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            error,
            message: error.message
        })
    }
}

exports.addComment = async (req, res, next) => {
    try {
        // check if recipe id exists in recipe collection
        const commentedRecipe = await Recipe.findById(req.body.commentedRecipeId)
        if (!commentedRecipe) {
            return res.status(404).json({
                message: "Recipe not found"
            });
        }
        // if recipe id exists create new comment
        const comment = new Comment({
            _id: mongoose.Types.ObjectId(),
            // commentAuthorId: ,
            commentedRecipeId: req.body.commentedRecipeId,
            author: req.body.author,
            // authorImage: ,
            createdAt: new Date(),
            commentBody: req.body.commentBody
        })
        const result = await comment.save()
        const updateRecipeWithComment = await Recipe.updateOne({
            _id: req.body.commentedRecipeId
        }, {
            $push: {
                comments: result._id
            }
        })
        console.log("updated " + updateRecipeWithComment)
        res.status(201).json({
            message: "Comment saved",
            createdComment: {
                _id: result._id,
                commentedRecipeId: result.commentedRecipeId,
                author: result.author,
                createdAt: result.createdAt,
                commentBody: result.commentBody
            },
            request: {
                type: 'GET',
                url: `${req.protocol}://${req.get('host')}${req.originalUrl}/${result._id}`
            }
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            error,
            message: error.message
        })
    }
}

exports.updateRecipe = async (req, res, next) => {
    const id = req.params.recipeId
    try {
        const result = await Recipe.updateOne({
            _id: id
        }, {
            $set: req.body
        })
        res.status(200).json({
            message: "Updated successfully",
            result
        })
        //res.status(200).json(result);
        console.log(result)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            error,
            message: error.message
        })
    }
}

exports.deleteRecipe = async (req, res) => {
    // console.log(req.params.recipeId)
    try {
        const recipe = await Recipe.findById(req.params.recipeId)
        // console.log('recipe log: ' + recipe)
        if (recipe.image.id) {
            await cloudinary.uploader.destroy(recipe.image.id);
        }
        await recipe.remove()
        res.status(200).json(recipe.mealName + 'DELETED!')
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            error: error
        })
    }
}