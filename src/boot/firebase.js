import { firestorePlugin } from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import config from '../../firebase.conf'

export default async ({ app, router, Vue }) => {
  Vue.use(firestorePlugin)

  firebase.initializeApp(config)
  Vue.prototype.$firebase = firebase
  Vue.prototype.$auth = firebase.auth()
  Vue.prototype.$db = firebase.firestore()

  router.beforeEach((to, from, next) => {
    firebase.auth().onAuthStateChanged(function (user) {
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
