<template lang="pug">
div
  b-navbar(
    href="#"
    variant="primary"
    type="dark"
    fixed="top"
    toggleable="md"
  )
    b-navbar-brand(to='/') Mind
    MainNavigation
    AuthenticationNavigation
  b-navbar(
    href="#"
    variant="primary"
    type="dark"
    fixed="bottom"
    toggleable="md"
  )
    PeerControls
  router-view
</template>

<script>
import MainNavigation from './components/MainNavigation.vue'
import { PeerControls } from '../peer/components/PeerControls.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import VueRouter from 'vue-router'
import { log } from '../utilities/log'
import { TEMPORARY_PATH_LABEL } from '../fragmentPaths/constants'

const logger = log('Main')

export default {
  components: {
    AuthenticationNavigation: () => import('../auth/components/AuthenticationNavigation.vue'),
    MainNavigation,
    PeerControls,
  },
  computed: {
    ...mapGetters('fragmentPaths', [
      'selectedFragmentPathName',
    ]),
    routedFragmentPath() {
      return this.$route.params?.fragmentPath ?? ''
    },
  },
  async mounted() {
    await this.getUser()
    this.selectRoutedPath()
  },
  methods: {
    ...mapActions('authentication', [
      'getUser',
    ]),
    ...mapMutations('fragmentPaths', [
      'select',
    ]),
    selectRoutedPath() {
      logger.info('selectRoutedPath', this.routedFragmentPath)
      if (!this.routedFragmentPath) {
        this.$router.push({
          path: `/on/${TEMPORARY_PATH_LABEL}`
        })
        return
      }
      if (this.routedFragmentPath !== this.selectedFragmentPathName) {
        this.select(this.routedFragmentPath)
        return
      }
      logger.info('already selected')
    },
  },
  router: new VueRouter({
    routes: [
      {
        path: '/',
        component: () => import('./components/MainContent.vue'),
      },
      {
        path: '/on/:fragmentPath',
        component: () => import('./components/MainContent.vue'),
      },
    ],
  }),
  watch: {
    routedFragmentPath(p) {
      logger.info('routedFragmentPath', p)
      // this.select(p)
      this.$nextTick(() => this.selectRoutedPath())
    },
    selectedFragmentPathName() {
      this.$nextTick(() => {
        if (this.selectedFragmentPathName !== this.routedFragmentPath) {
          this.$router.push({
            path: `/on/${this.selectedFragmentPathName}`
          })
        }
      })
    },
  }
}
</script>

<style>
.b-icon {
  margin-right: .5em;
}
body {
  padding-top: 4em;
}
</style>
