import {
    recipesUrl
} from '../../apiData'
import axios from 'axios'

const state = {
    fetchedRecipes: [],
    defaultImage: 'https://res.cloudinary.com/tastycloud/image/upload/v1584033348/default_recipe_irlbw6.jpg',
    singleRecipe: ''
}

const actions = {
    fetchPopularRecipes: async ({
        commit
    }) => {
        
        try {
            const response = await axios.get(
                `${ recipesUrl }/all`
            )
            // console.log(response.data.recipes)
            let resultsArray = []
            if (response.data.recipes.length) {
                response.data.recipes.forEach(d => resultsArray.push(d))
                // console.log(resultsArray)
                const popularArray = resultsArray.sort((a, b) => b.rating - a.rating).slice(0, 5)
                commit('setRecipeResults', popularArray)
            } else {
                const notFoundMessage = 'Not found' 
                commit('setRecipeResults', notFoundMessage)
            }
        } catch (error) {
            console.log(error.message)
            commit('setRecipeResults', error.message)
        }
    },

    getSingleRecipe: async ({ commit }, id) => {
        try {
            const response = await axios.get(
                `${ recipesUrl }/single/${id}`
            )
            if (response.data) {
                commit('setSingleRecipe', response.data)
            } else {
                const notFoundMessage = 'Not found' 
                commit('setSingleRecipe', notFoundMessage)
            }
        } catch (error) {
            console.log(error.message)
            commit('setSingleRecipe', error.message)
        }
    }
}

const mutations = {
    setRecipeResults(state, payload) {
        state.fetchedRecipes = payload
    },

    setSingleRecipe(state, payload) {
        state.singleRecipe = payload
    }
}

const getters = {
    fetchedRecipes(state) {
        return state.fetchedRecipes
    },

    defaultImage(state) {
        return state.defaultImage
    },

    singleRecipe(state) {
        return state.singleRecipe
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}