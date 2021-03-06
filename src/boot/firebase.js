import { firestorePlugin } from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import config from '../../firebase.conf'

export default async ({ app, router, store, Vue }) => {
  Vue.use(firestorePlugin)

  firebase.initializeApp(config)
  const db = firebase.firestore()

  Vue.prototype.$firebase = firebase
  Vue.prototype.$auth = firebase.auth()
  Vue.prototype.$db = db

  const periodRef = db.collection('settings').doc('period')
  store.dispatch('setting/bindPeriod', periodRef)

  router.beforeEach((to, from, next) => {
    firebase.auth().onAuthStateChanged(user => {
      if (!user && to.path !== '/auth/login') {
        next('/auth/login')
      }
      if (user) {
        if (to.path === '/auth/login') {
          next('/')
        }
      }
      next()
    })
  })
}
