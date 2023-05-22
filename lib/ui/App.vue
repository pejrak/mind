<template lang="pug">
div
  router-view
</template>

<script>
import VueRouter from 'vue-router'

export default {
  router: new VueRouter({
    routes: [
      {
        path: '/',
        name: 'Home',
        component: () => import('./main/Main.vue'),
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('./auth/Login.vue'),
      },
    ]
  }),
}
</script>
