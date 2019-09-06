import { firestoreAction } from 'vuexfire'

export default {
  namespaced: true,
  state: {
    period: null,
    localActivePeriod: null
  },

  mutations: {
    changeActivePeriod: (state, payload) => {
      state.localActivePeriod = payload
    }
  },

  actions: {
    bindPeriod: firestoreAction(({ bindFirestoreRef }, ref) => {
      return bindFirestoreRef('period', ref)
    })
  },

  getters: {
    activePeriod: state => {
      if (state.period) {
        return state.localActivePeriod ? state.localActivePeriod : state.period.active
      }

      return null
    }
  }
}
