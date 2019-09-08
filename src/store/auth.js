import { firestoreAction } from 'vuexfire'

export default {
  namespaced: true,

  state: {
    user: null
  },

  mutations: {
  },

  actions: {
    bindUser: firestoreAction(({ bindFirestoreRef }, ref) => {
      return bindFirestoreRef('user', ref)
    }),
    unbindUser: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('user')
    })
  },

  getters: {
    getRoles: (state) => {
      return Object.assign({}, {
        admin: false,
        homeroom: false,
        teacher: false,
        guardian: false,
        student: false
      }, state.user ? state.user.role : {})
    }
  }
}
