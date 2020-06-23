const mongoose = require('mongoose')
const Recipe = require('../models/recipe')
const Comment = require('../models/comment')
const User = require('../models/user')
const cloudinary = require('cloudinary')
require('../middlewares/cloudinary')
const { returnUserImage } = require('../helpers/imageFunction')

exports.getRecipes = async (req, res, next) => {
  try {
    const queryObj = {
      ...req.query
    } // copy query object and then exclude fields
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach((el) => delete queryObj[el])
    let query = Recipe.find(queryObj)

    // Sorting
    if (req.query.sort) {
      query = query.sort(req.query.sort)
    }

    const docs = await query.populate({
      // Get comment's author info
      path: 'author',
      select: 'username user_image createdRecipes _id'
    })
    //console.log("getting recipes ", docs)
    const response = {
      recipes: docs.map((doc) => {
        /* let image = ''
        if (doc.author.user_image) {
          image = doc.author.user_image.url
        } */
        return {
          author: {
            username: doc.author.username,
            image: returnUserImage(doc.author)
          },
          mealName: doc.mealName,
          intro: doc.intro,
          _id: doc._id,
          level: doc.level,
          dishType: doc.dishType,
          vegetarian: doc.vegetarian,
          glutenFree: doc.glutenFree,
          image: doc.image.url,
          rating: doc.rating,
          rates: doc.rates,
          createdAt: doc.createdAt,
          comments: doc.comments,
          request: {
            type: 'GET',
            url: `${req.protocol}://${req.get('host')}/recipes/${doc._id}` // works wherever deployed
          }
        }
      })
    }
    const docsCount = await query.countDocuments()
    res.status(200).json({ response, docsCount })
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
  // console.log('server gets this id: ', id)
  try {
    const doc = await Recipe.findById(id)
      .populate({
        // Get comment's author info
        path: 'author',
        select: 'username user_image createdRecipes _id'
      })
      .populate({
        path: 'comments',
        // Get comment's author info
        populate: {
          path: 'author',
          select: 'username user_image _id'
        }
      })
    //console.log("getting single recipe" + doc)
    if (doc) res.status(200).json(doc)
    else
      res.status(404).json({
        message: 'no result for reqested recipe'
      })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      error,
      message: error.message
    })
  }
}

exports.addNewRecipe = async (req, res, next) => {
  try {
    // console.log(req.body)
    let imageresult = ''
    if (req.file)
      imageresult = await cloudinary.v2.uploader.upload(
        req.file.path,
        {
          folder: 'recipes'
        },
        (error, result) => {
          console.log(result, error)
        }
      )
    const recipe = new Recipe({
      _id: new mongoose.Types.ObjectId(),
      mealName: req.body.mealName,
      author: req.userData.userId,
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
      steps: req.body.steps
    })
    const result = await recipe.save()
    const updateUserRecipes = await User.findByIdAndUpdate(
      {
        _id: result.author
      },
      {
        $push: {
          createdRecipes: result._id
        }
      },
      { new: true }
    )
    /* let userImage = ''
    if (updateUserRecipes.user_image) {
      userImage = updateUserRecipes.user_image.url
    } */
    //console.log(result)
    res.status(201).json({
      message: 'New recipe created successfully!',
      createdRecipe: result,
      updatedUser: {
        username: updateUserRecipes.username,
        userId: updateUserRecipes._id,
        isAdmin: updateUserRecipes.isAdmin,
        isDisabled: updateUserRecipes.isDisabled,
        createdAt: updateUserRecipes.createdAt,
        createdRecipes: updateUserRecipes.createdRecipes,
        favorites: updateUserRecipes.favorites,
        user_image: returnUserImage(updateUserRecipes)
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
  try {
    const id = req.params.recipeId
    const recipeForUpdate = await Recipe.findById(id)
    if (!recipeForUpdate) {
      return res.status(404).json({
        message: 'Recipe not found'
      })
    }
    if (
      !req.userData.isAdmin &&
      req.userData.userId != recipeForUpdate.author
    ) {
      return res.status(401).json({
        message: `Unauthorized - access denied!`
      })
    }
    let imageresult = ''
    if (req.file) {
      if (!recipeForUpdate.image.id) {
        imageresult = await cloudinary.v2.uploader.upload(
          req.file.path,
          {
            folder: 'recipes'
          },
          (error, result) => {
            console.log(error)
          }
        )
      } else {
        await cloudinary.v2.uploader.destroy(
          recipeForUpdate.image.id,
          (error, result) => {
            console.log(error)
          }
        )
        imageresult = await cloudinary.v2.uploader.upload(
          req.file.path,
          {
            folder: 'recipes'
          },
          (error, result) => {
            console.log(error)
          }
        )
      }
      req.body.image = {
        url: imageresult.secure_url,
        id: imageresult.public_id
      }
    }
    const updated = await Recipe.findByIdAndUpdate(
      {
        _id: id
      },
      {
        $set: req.body
      },
      { new: true }
    )
    res.status(200).json({
      message: 'Updated successfully',
      updatedRecipe: {
        _id: updated._id,
        createdAt: updated.createdAt,
        mealName: updated.mealName,
        author: updated.author,
        intro: updated.intro,
        dishType: updated.dishType,
        level: updated.level,
        timing: updated.timing,
        persons: updated.persons,
        regional: updated.regional,
        vegetarian: updated.vegetarian,
        glutenFree: updated.glutenFree,
        image: {
          url: imageresult.secure_url,
          id: imageresult.public_id
        },
        ingredients: updated.ingredients,
        steps: updated.steps,
        rates: updated.rates,
        rating: updated.rating,
        comments: updated.comments
      }
    })
    console.log(updated)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      error,
      message: error.message
    })
  }
}

exports.addRating = async (req, res, next) => {
  try {
    const id = req.params.recipeId
    const recipeForRate = await Recipe.findById(id)
    if (!recipeForRate) {
      return res.status(404).json({
        message: 'Recipe not found'
      })
    }
    // restricton - user can't rate his own recipe
    if (req.userData.userId == recipeForRate.author) {
      return res.status(401).json({
        message: `You can't rate your recipe`
      })
    }
    // restriction - user can rate single recipe only once
    let findUserId = recipeForRate.rates.find(
      (rt) => rt.ratedBy == req.userData.userId
    )
    if (findUserId) {
      return res.status(401).json({
        message: `You have already rated this recipe`
      })
    }

    await Recipe.updateOne(
      {
        _id: id
      },
      {
        $push: {
          rates: {
            ratedBy: req.userData.userId,
            rate: req.body.rate
          }
        }
      }
    )
    // calculate and save overall rating
    const setRating = await Recipe.findById(id)
    const summed =
      setRating.rates.reduce((total, rt) => total + rt.rate, 0) /
      setRating.rates.length
    // console.log(summed)

    const summedRating = await Recipe.updateOne(
      {
        _id: id
      },
      {
        $set: {
          rating: summed.toFixed(1)
        }
      }
    )
    // console.log('rating: ' + summed)
    res.status(200).json({
      message: 'Recipe has been rated',
      summedRating
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      error,
      message: error.message
    })
  }
}

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId)
    if (!recipe) {
      return res.status(404).json({
        message: 'Recipe not found'
      })
    }
    // console.log('recipe log: ' + recipe)
    if (!req.userData.isAdmin && req.userData.userId != recipe.author) {
      return res.status(401).json({
        message: `Unauthorized - access denied!`
      })
    }
    if (recipe.image.id) {
      await cloudinary.v2.uploader.destroy(recipe.image.id, (error, result) => {
        console.log(result, error)
      })
    }
    await Comment.deleteMany({
      commentedRecipeId: recipe._id
    })
    await User.updateMany({
      $pull: {
        favorites: recipe._id
      }
    })
    const updatedUser = await User.findByIdAndUpdate(
      {
        _id: recipe.author
      },
      {
        $pull: {
          createdRecipes: recipe._id
        }
      },
      { new: true }
    )

    await recipe.remove()
    /* let userImage = ''
    if (updatedUser.user_image) {
      userImage = updatedUser.user_image.url
    } */
    res.status(200).json({
      message: recipe.mealName + ' deleted!',
      userUpdate: {
        username: updatedUser.username,
        userId: updatedUser._id,
        isAdmin: updatedUser.isAdmin,
        isDisabled: updatedUser.isDisabled,
        createdAt: updatedUser.createdAt,
        createdRecipes: updatedUser.createdRecipes,
        favorites: updatedUser.favorites,
        user_image: returnUserImage(updatedUser)
      }
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      error: error
    })
  }
}
