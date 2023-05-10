<template lang="pug">
div
  router-view
</template>

<script>
import VueRouter from 'vue-router'
import LoginVue from './auth/Login.vue'
import Main from './main/Main.vue'

export default {
  router: new VueRouter({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'Home',
        component: Main,
      },
      {
        path: '/login',
        name: 'Login',
        component: LoginVue,
      },
    ]
  }),
}
</script>
