import {
    recipesUrl
} from '../../apiData'
import axios from 'axios'

const state = {
    sliderRecipes: [],
    queriedRecipes: [],
    defaultImage: require('@/assets/default_recipe.jpg'),
    singleRecipe: ''
}

const actions = {
    fetchSliderRecipes: async ({
        commit
    }) => {
        try {
            const response = await axios.get(
                `${ recipesUrl }?sort=-rating`
            )
            //console.log(response)
            let resultsArray = []
            if (response.data.recipes.length) {
                response.data.recipes.forEach(d => resultsArray.push(d))
                const popularArray = resultsArray.slice(0, 5)
                commit('setSliderRecipes', popularArray)
            } else {
                const notFoundMessage = 'Not found'
                commit('setSliderRecipes', notFoundMessage)
            }
        } catch (error) {
            console.log(error.response.data.message)
            //commit('setSliderRecipes', error.message)
        }
    },

    fetchQueriedRecipes: async ({
        commit
    }, payload) => {
        try {
            const response = await axios.get(`${recipesUrl}`, {
                params: payload
              })
            console.log(response)
            let resultsArray = []
            if (response.data.recipes.length) {
                response.data.recipes.forEach(d => resultsArray.push(d))
                commit('setQueriedRecipes', resultsArray)
            }
        } catch (error) {
            console.log(error.response.data.message)
            //commit('setQueriedRecipes', error.message)
        }
    },

    fetchSingleRecipe: async ({
        commit
    }, id) => {
        try {
            console.log('client sends this id: ', id)
            const response = await axios.get(
                `${ recipesUrl }/${id}`
            )
            if (response.data) {
                commit('setSingleRecipe', response.data)
            }/*  else {
                const notFoundMessage = 'Not found'
                commit('setSingleRecipe', notFoundMessage)
            } */
            return response.data
        } catch (error) {
            console.log(error.message)
            console.log(error.response.data.message)
            //commit('setSingleRecipe', error.message)
        }
    }
}

const mutations = {
    setSliderRecipes(state, payload) {
        state.sliderRecipes = payload
    },

    setQueriedRecipes(state, payload) {
        state.queriedRecipes = payload
    },

    setSingleRecipe(state, payload) {
        state.singleRecipe = payload
    }
}

const getters = {
    getSliderRecipes(state) {
        return state.sliderRecipes
    },

    getQueriedRecipes(state) {
        return state.queriedRecipes
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
