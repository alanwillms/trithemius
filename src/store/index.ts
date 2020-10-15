import { createStore } from 'vuex'

const state = {
  textBeingEdited: '',
}

const mutations = {
  storeTextBeingEdited(state: any, payload: string) {
    state.textBeingEdited = payload
  },
}

const actions = {
  setTextBeingEdited({ commit }: { commit: any }, payload: string) {
    commit('storeTextBeingEdited', payload)
  },
}

const getters = {
  textBeingEdited: (state: any) => state.textBeingEdited,
}

export default createStore({
  state,
  actions,
  mutations,
  getters,
})
