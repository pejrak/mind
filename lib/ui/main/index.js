import { Authentication } from '../authentication/store'
import Main from './Main.vue'
import BootstrapVue from 'bootstrap-vue'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../../../public/external/bootstrap/css/bootstrap-lumen.min.css'

Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.use(Vuex)

const store = new Vuex.Store(Authentication)

new Vue({
  el: '#app',
  render: h => h(Main),
  store,
})
