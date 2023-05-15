import { Authentication } from './auth/store.js'
import { Fragments } from './fragments/store.js'
import { FragmentPaths } from './fragmentPaths/store.js'
import App from './App.vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../../public/external/bootstrap/css/bootstrap-lumen.min.css'
import '../../public/styles/styles.css'
import { Trusts } from './trusts/store.js'
import { PeerStore } from './peer/store.js'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueRouter)
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    authentication: {
      namespaced: true,
      ...Authentication,
    },
    fragments: {
      namespaced: true,
      ...Fragments,
    },
    fragmentPaths: {
      namespaced: true,
      ...FragmentPaths,
    },
    peers: {
      namespaced: true,
      ...PeerStore,
    },
    trusts: {
      namespaced: true,
      ...Trusts,
    }
  }
})

export const VueApplication = new Vue({
  el: '#app',
  render: h => h(App),
  store,
})
