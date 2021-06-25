<template lang="pug">
div
  b-input-group
    b-input-group-prepend
      b-input-group-text
        b-icon-search
        span Component
    b-input(
      type="text"
      v-model="componentSearchInput"
    )
    b-input-group-append
      b-button(
        variant="primary"
        :disabled="checking || !componentValid"
        @click="triggerComponentAddition"
      ) Add
  .spacer
  div(
    v-if="pathComponents.length > 0"
  )
    b-button(
      v-for="pathComponent of pathComponents"
      :key="`path-component-${pathComponent}`"
      @click="triggerComponentRemoval(pathComponent)"
    ) {{ pathComponent }}
    .spacer
    b-button(
      variant="primary"
      :disabled='!pathIsValid || pathAlreadyAdded'
      @click="submitNewPath"
    ) Save path: #[strong {{ pathLabel }}]
  b-alert(
    v-else
    show
  ) Add components to path.

</template>
<script>
import { capitaliseFirstLetter as capFirst } from '../../../format/strings'
import { mapMutations, mapState } from 'vuex'
import { fragmentPathComponentExists } from '../actions'
import { pathsMatching } from '../../fragments/pathsMatching'

export default {
  computed: {
    ...mapState('fragmentPaths', [
      'available'
    ]),
    pathAlreadyAdded() {
      return this.available.some(path => pathsMatching({
        parent: path,
        path: this.pathComponents,
      }))
    },
    pathIsValid() {
      return (
        this.pathComponents.length > 1 &&
        this.pathComponents.length < 5
      )
    },
    pathLabel() {
      return this.pathComponents.map(capFirst).join(' - ')
    }
  },
  data() {
    return {
      checking: false,
      componentSearchInput: '',
      componentSearchTimer: null,
      componentValid: false,
      pathComponents: [],
    }
  },
  methods: {
    ...mapMutations('fragmentPaths', [
      'createFragmentPath'
    ]),
    async checkComponentExistence() {
      if (this.componentSearchInput.length > 1) {
        this.checking = true
        const startInput = `${this.componentSearchInput}`
        const {
          data: { success }
        } = await fragmentPathComponentExists(
          startInput
        )
        if (
          success &&
          startInput === this.componentSearchInput
        ) {
          this.componentValid = true
        }
        this.checking = false
      }
    },
    submitNewPath() {
      this.createFragmentPath([...this.pathComponents])
      this.pathComponents = []
      this.$emit('submitted')
    },
    triggerComponentAddition() {
      this.pathComponents.push(this.componentSearchInput)
      this.componentSearchInput = ''
    },
    triggerComponentCheck() {
      clearTimeout(this.componentSearchTimer)
      this.componentSearchTimer = setTimeout(() => {
        this.checkComponentExistence()
      }, 400)
    },
    triggerComponentRemoval(componentName) {
      const componentIndex = this.pathComponents.findIndex(
        c => c === componentName
      )
      this.pathComponents.splice(componentIndex, 1)
    },
  },
  watch: {
    componentSearchInput(value) {
      this.componentValid = false
      this.triggerComponentCheck()
    }
  }
}
</script>
