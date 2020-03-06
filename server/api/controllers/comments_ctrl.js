const mongoose = require('mongoose')
const Comment = require('../models/comment')
const Recipe = require('../models/recipe')

exports.getAllComments = async (req, res, next) => {
    try {
        const docs = Comment.find()
        console.log("getting ALL comments from database", docs)
        const response = {
            comments: docs.map(doc => {
                return {
                    _id: doc._id,
                    commentedRecipeId: doc.commentedRecipeId,
                    author: doc.author,
                    createdAt: doc.createdAt,
                    commentBody: doc.commentBody,
                    request: {
                        type: 'GET',
                        url: `${req.protocol}://${req.get('host')}${req.originalUrl}/${doc._id}` // works wherever deployed 
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

exports.getSingleComment = async (req, res, next) => {
    const id = req.params.commentId
    try {
        const doc = await Comment.findById(id)
            .select('_id commentedRecipeId author createdAt commentBody')
        if (!doc) {
            return res.status(404).json({
                message: "Comment not found"
            })
        }
        console.log("getting single comment", doc)
        if (doc)
            res.status(200).json(doc)
        else
            res.status(404).json({
                message: "no result for reqested comment"
            })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            error,
            message: error.message
        })
    }
}

exports.deleteSingleComment = async (req, res, next) => {
    const id = req.params.commentId
    try {
        const result = await Comment.findById({
            _id: id
        })
        // pull comment id from recipe comments ref array
        await Recipe.updateOne({
            _id: result.commentedRecipeId
        }, {
            $pull: {
                comments: result._id
            }
        })
        await Comment.deleteOne({
            _id: id
        })
        res.status(200).json({
            message: `Comment is deleted`
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            error,
            message: error.message
        })
    }
}

exports.deleteMultipleComments = async (req, res, next) => {
    try {
        // mongo method deleteOne
        const result = Comment.deleteMany({
            author: req.params.author
        })
        res.status(200).json({
            message: `All ${result.author}'s comments are deleted!`
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            error,
            message: error.message
        })
    }
}