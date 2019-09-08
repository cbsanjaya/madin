import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes: routes.map(beforeEnter),

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}

/**
 * Add beforeEnter guard to the route.
 *
 * @param {Object} route
 * @param {Object}
 */
function beforeEnter (route) {
  if (route.children) {
    route.children.forEach(beforeEnter)
  }

  if (!route.authorize) {
    return route
  }

  route.beforeEnter = (to, from, next) => {
    if (!Array.isArray(route.authorize)) {
      route.authorize = [route.authorize]
    }

    route.authorize.forEach(name => {
      if (typeof name === 'function') {
        name(to, from, next)
      } else if (typeof name === 'string') {
        if (!store().getters['auth/getRoles'][name]) {
          next('/oops')
        } else {
          next()
        }
      } else {
        throw Error(`Undefined authorize [${name}]`)
      }
    })
  }

  return route
}
