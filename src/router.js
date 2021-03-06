import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Signup from './views/Signup.vue'
import MapView from './views/Map.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    // FIXME: Activate/Deactivate back-end
    // },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: Login
    // },
    // {
    //   path: '/signup',
    //   name: 'signup',
    //   component: Signup
    // },
    // {
    //   path: '/map',
    //   name: 'map',
    //   component: MapView
    }
  ]
})
