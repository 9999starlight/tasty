import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import getRecipes from './modules/getRecipes'
import currentUser from './modules/currentUser'
Vue.use(Vuex)

export const store = new Vuex.Store({
  strict: true,
  // strict: process.env.NODE_ENV !== 'production',
  modules: {
    getRecipes,
    //postRequests,
    currentUser
  },
  plugins: [
    createPersistedState({
      paths: ['currentUser']
    })
  ]
})