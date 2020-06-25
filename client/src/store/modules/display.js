const state = {
  editState: false,
  openSearch: false,
}
const actions = {
  changeEditState({ commit }, payload) {
    commit('setEditState', payload)
  },
  toggleSearch({ commit }, payload) {
    commit('setOpenSearch', payload)
  }
}
const mutations = {
  setEditState(state, payload) {
    state.editState = payload
  },
  setOpenSearch(state, payload) {
    state.openSearch = payload
  }
}
const getters = {
  getEditState(state) {
    return state.editState
  },
  getOpenSearch(state) {
    return state.openSearch
  }
}
export default {
  state,
  actions,
  mutations,
  getters
}
