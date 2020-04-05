import {
    recipesUrl
} from '../../apiData'
import axios from 'axios'

const state = {
    fetchedRecipes: [],
    defaultImage: require('@/assets/default_recipe.jpg'),
    singleRecipe: ''
}

const actions = {
    fetchPopularRecipes: async ({
        commit
    }) => {
        try {
            const response = await axios.get(
                `${ recipesUrl }?sort=-rating`
            )
            // console.log(response.data.recipes)
            let resultsArray = []
            if (response.data.recipes.length) {
                response.data.recipes.forEach(d => resultsArray.push(d))
                const popularArray = resultsArray.slice(0, 5)
                commit('setRecipeResults', popularArray)
            } else {
                const notFoundMessage = 'Not found'
                commit('setRecipeResults', notFoundMessage)
            }
        } catch (error) {
            console.log(error.message)
            //commit('setRecipeResults', error.message)
        }
    },

    fetchSingleRecipe: async ({
        commit
    }, id) => {
        try {
            const response = await axios.get(
                `${ recipesUrl }/${id}`
            )
            if (response.data) {
                commit('setSingleRecipe', response.data)
            } else {
                const notFoundMessage = 'Not found'
                commit('setSingleRecipe', notFoundMessage)
            }
        } catch (error) {
            console.log(error.message)
            //commit('setSingleRecipe', error.message)
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
    getFetchedRecipes(state) {
        return state.fetchedRecipes
    },

    getDefaultImage(state) {
        return state.defaultImage
    },

    getSingleRecipe(state) {
        return state.singleRecipe
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}