import { Authentication } from '../authentication/store'
import { Fragments } from '../fragments/store'
import { FragmentPaths } from '../fragmentPaths/store'
import Main from './Main.vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../../../public/external/bootstrap/css/bootstrap-lumen.min.css'
import '../../../public/styles/styles.css'
import { Trusts } from '../trusts/store'

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
    trusts: {
      namespaced: true,
      ...Trusts,
    }
  }
})

export const VueApplication = new Vue({
  el: '#app',
  render: h => h(Main),
  store,
})
