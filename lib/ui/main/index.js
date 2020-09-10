import Vue from 'vue'
import Main from './Main.vue'
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../../../public/external/bootstrap/css/bootstrap-lumen.min.css'

Vue.use(BootstrapVue)
console.log('hello?')

new Vue({
  el: '#app',
  render: h => h(Main)
})
