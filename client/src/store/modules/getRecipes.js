import { recipesUrl, source } from '../../apiData'
import axios from 'axios'

const state = {
  sliderRecipes: [],
  queriedRecipes: [],
  defaultImage: require('@/assets/default_recipe.jpg'),
  singleRecipe: '',
  success: null,
  editState: false
  // recipeForEdit: null
}

const actions = {
  fetchSliderRecipes: async ({ commit }) => {
    try {
      const result = await axios.get(`${recipesUrl}?sort=-rating`)
      //console.log(result)
      let resultsArray = []
      if (result.data.response.recipes.length) {
        result.data.response.recipes.forEach((d) => resultsArray.push(d))
        const popularArray = resultsArray.slice(0, 5)
        commit('setSliderRecipes', popularArray)
      }
    } catch (error) {
      console.log(error.result.data.message)
      //commit('setSliderRecipes', error.message)
    }
  },

  fetchQueriedRecipes: async ({ commit }, payload) => {
    try {
      const results = await axios.get(`${recipesUrl}`, {
        params: payload
      })
      // console.log(results)
      let resultsArray = []
      if (!results.data.response.recipes.length) {
        commit('setQueriedRecipes', [])
        commit('setSuccess', false)
      } else {
        results.data.response.recipes.forEach((d) => resultsArray.push(d))
        commit('setQueriedRecipes', resultsArray)
        commit('setSuccess', true)
      }
      // console.log(results.data.docsCount)
    } catch (error) {
      console.log(error.results.data.message)
      //console.log(error.message)
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
    } catch (error) {
       (thrown, error) => {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled', thrown.message)
        } else {
          console.log(error.message)
          console.log(error.response.data.message)
        }
      }
    }
  },

  changeEditState({ commit }, payload) {
    commit('setEditState', payload)
  },

  clearSingleRecipe({ commit }, payload) {
    commit('setSingleRecipe', payload)
  }

  /* clearQuery({ commit }, payload) {
    commit('setQueriedRecipes', payload)
  } */
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
  },

  setEditState(state, payload) {
    state.editState = payload
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
  },

  getEditState(state) {
    return state.editState
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
