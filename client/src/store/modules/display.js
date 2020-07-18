const state = {
  editState: false,
  openSearch: false
}
const actions = {
  changeEditState({ commit }, payload) {
    commit('setEditState', payload)
  }
}
const mutations = {
  setEditState(state, payload) {
    state.editState = payload
  },
  setOpenSearch(state) {
    state.openSearch = !state.openSearch
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
