import { recipesUrl } from '../../apiData'
import axios from 'axios'

const state = {
  queriedRecipes: [],
  defaultImage: require('@/assets/default_recipe.jpg'),
  singleRecipe: '',
  success: null
}

const actions = {
  fetchQueriedRecipes: async ({ commit }, payload) => {
    try {
      const results = await axios.get(`${recipesUrl}`, {
        params: payload
      })
      let resultsArray = []
      if (!results.data.response.recipes.length) {
        commit('setQueriedRecipes', [])
        commit('setSuccess', false)
      } else {
        results.data.response.recipes.forEach((d) => resultsArray.push(d))
        commit('setQueriedRecipes', resultsArray)
        commit('setSuccess', true)
      }
    } catch (error) {
      console.log(error.response.data.message)
    }
  },

  fetchSingleRecipe: async ({ commit }, id) => {
    try {
      const response = await axios.get(`${recipesUrl}/${id}`, {
        timeout: 5000
      })
      if (!response.data) {
        commit('setSingleRecipe', '')
      } else {
        commit('setSingleRecipe', response.data)
      }
      return response.data
    } catch (error) {
      console.log(error.message)
      console.log(error.response.data.message)
    }
  },

  clearSingleRecipe({ commit }, payload) {
    commit('setSingleRecipe', payload)
  }
}

const mutations = {
  setQueriedRecipes(state, payload) {
    state.queriedRecipes = payload
  },

  setSingleRecipe(state, payload) {
    state.singleRecipe = payload
  },

  setSuccess(state, payload) {
    state.success = payload
  }
}

const getters = {
  getQueriedRecipes(state) {
    return state.queriedRecipes
  },

  getDefaultImage(state) {
    return state.defaultImage
  },

  getSingleRecipe(state) {
    return state.singleRecipe
  },

  getSuccess(state) {
    return state.success
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
