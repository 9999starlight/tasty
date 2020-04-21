import {
  usersUrl
} from '../../apiData'
import axios from 'axios'
import jwt from 'jsonwebtoken'

const state = {
  userToken: '',
  currentUser: null,
  isLogged: false,
  errorMessage: '',
}

const actions = {
  async signUpUser({
    commit
  }, credentials) {
    try {
      const response = await axios.post(`${usersUrl}/register`, credentials)
      // console.log(response);
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token)
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

  async loginUser({
    commit
  }, credentials) {
    try {
      const response = await axios.post(`${usersUrl}/login`, credentials)
      //console.log(response);
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token)
      }
      userSettings(
        commit,
        localStorage.getItem('userToken'),
        jwt.decode(localStorage.getItem('userToken'))
      )
      console.log(response.data)
      return response.data
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log(error.response.data.message)
        commit('setErrorMessage', error.response.data.message)
      }
    }
  },

  logoutUser({
    commit
  }) {
    commit('setUserToken', '')
    commit('setCurrentUser', null)
    commit('setIsLogged', false)
    delete axios.defaults.headers.common['Authorization']
    localStorage.removeItem('userToken')
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
  },
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
}

// private helpers

function userSettings(commit, token, user) {
  // default request header
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  console.log(user)
  commit('setCurrentUser', user)
  commit('setUserToken', token)
  commit('setIsLogged', true)
  commit('setErrorMessage', '')
}

export default {
  state,
  actions,
  mutations,
  getters,
}