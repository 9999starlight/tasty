import { usersUrl } from '../../apiData'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import router from '../../router'

const state = {
  userToken: '',
  currentUser: null,
  isLogged: false,
  errorMessage: '',
  defaultUserImage: require('@/assets/default_user.png')
}

const actions = {
  async signUpUser({ commit }, credentials) {
    try {
      const response = await axios.post(`${usersUrl}/register`, credentials)
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token)
        // set deafult Axios headers for current user's requests
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${response.data.token}`
      }
      userSettings(
        commit,
        localStorage.getItem('userToken'),
        jwt.decode(localStorage.getItem('userToken'))
      )
      return response.data
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 409)
      ) {
        console.log(error.response.data.message)
        commit('setErrorMessage', error.response.data.message)
      }
    }
  },

  async loginUser({ commit }, credentials) {
    try {
      const response = await axios.post(`${usersUrl}/login`, credentials)
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token)
        // set deafult Axios headers for current user's requests
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${response.data.token}`
      }
      userSettings(
        commit,
        localStorage.getItem('userToken'),
        jwt.decode(localStorage.getItem('userToken'))
      )
      return response.data
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log(error.response.data.message)
        commit('setErrorMessage', error.response.data.message)
      }
    }
  },

  logoutUser({ commit }) {
    commit('setUserToken', '')
    commit('setCurrentUser', null)
    commit('setIsLogged', false)
    localStorage.removeItem('userToken')
    delete axios.defaults.headers.common['Authorization']
    router.push('/login')
  },

  updateUser({ commit }, payload) {
    commit('setCurrentUser', payload)
  }
}

const mutations = {
  setUserToken(state, payload) {
    state.userToken = payload
  },

  setCurrentUser(state, payload) {
    state.currentUser = payload
  },

  setIsLogged(state, payload) {
    state.isLogged = payload
  },

  setErrorMessage(state, payload) {
    state.errorMessage = payload
  }
}

const getters = {
  getUserToken(state) {
    return state.userToken
  },
  getCurrentUser(state) {
    return state.currentUser
  },

  getIsLogged(state) {
    return state.isLogged
  },

  getErrorMessage(state) {
    return state.errorMessage
  },

  getDefaultUserImage(state) {
    return state.defaultUserImage
  }
}

function userSettings(commit, token, user) {
  commit('setCurrentUser', user)
  commit('setUserToken', token)
  commit('setIsLogged', true)
  commit('setErrorMessage', '')
}

export default {
  state,
  actions,
  mutations,
  getters
}
