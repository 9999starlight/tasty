import { recipesUrl, source } from '../../apiData'
import axios from 'axios'

const state = {
  sliderRecipes: [],
  queriedRecipes: [],
  defaultImage: require('@/assets/default_recipe.jpg'),
  singleRecipe: '',
  success: null
}

const actions = {
  fetchSliderRecipes: async ({ commit }) => {
    try {
      const response = await axios.get(`${recipesUrl}?sort=-rating`)
      //console.log(response)
      let resultsArray = []
      if (response.data.recipes.length) {
        response.data.recipes.forEach((d) => resultsArray.push(d))
        const popularArray = resultsArray.slice(0, 5)
        commit('setSliderRecipes', popularArray)
      }
    } catch (error) {
      console.log(error.response.data.message)
      //commit('setSliderRecipes', error.message)
    }
  },

  fetchQueriedRecipes: async ({ commit }, payload) => {
    try {
      const response = await axios.get(`${recipesUrl}`, {
        params: payload
      })
      console.log(response)
      let resultsArray = []
      if (!response.data.recipes.length) {
        commit('setQueriedRecipes', [])
        commit('setSuccess', false)
      } else {
        response.data.recipes.forEach((d) => resultsArray.push(d))
        commit('setQueriedRecipes', resultsArray)
        commit('setSuccess', true)
      }
    } catch (error) {
      console.log(error.response.data.message)
    }
  },

  fetchSingleRecipe: async ({ commit }, id) => {
    try {
      // console.log('client sends this id: ', id)
      const response = await axios.get(`${recipesUrl}/${id}`, {
        cancelToken: source.token,
        timeout: 5000
      })
      if (!response.data) {
        commit('setSingleRecipe', '')
      } else {
        commit('setSingleRecipe', response.data)
      }
      return response.data
    } catch {
       (thrown, error) => {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled', thrown.message)
        } else {
          console.log(error.message)
          console.log(error.response.data.message)
        }
      }
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
  },

  setSuccess(state, payload) {
    state.success = payload
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
