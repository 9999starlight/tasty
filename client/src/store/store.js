import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import getRecipes from './modules/getRecipes'
import currentUser from './modules/currentUser'
import display from './modules/display'
Vue.use(Vuex)

export const store = new Vuex.Store({
  strict: true,
  // strict: process.env.NODE_ENV !== 'production',
  modules: {
    getRecipes,
    currentUser,
    display
  },
  plugins: [
    createPersistedState({
      paths: ['currentUser']
    })
  ]
})
