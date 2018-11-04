import Vue from 'vue'
import Vuex from 'vuex'

import {HTTP} from './api/api.js'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    authToken: null
  },
  mutations: {
    setAuthToken (state, newToken) {
      state.authToken = newToken
    }
  },
  getters: {
    isAuthenticated ({authToken}) {
      return authToken != null
    }
  },
  actions: {
    async loginAction ({commit}, {username, password}) {
      try {
        const response = await HTTP.post('/api-token-auth/', {
          username: username,
          password: password
        })
        commit('setAuthToken', response.data.token)
      } catch (err) {
        console.log(err)
      }
    }
  }
})
