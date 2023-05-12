<template lang='pug'>
b-row
  b-col.text-center
    div(v-if='outgoing.length > 0')
      h2 Trusts
      div(v-for='trust of outgoing')
        Button(
          variant='primary'
          @click='onRemoveTrust(trust)'
        ) {{ trust.recipient }}
    small(v-else) No trusts on selected path.
    hr
    b-dropdown(
      text='Add trust'
      variant='primary'
    )
      b-dropdown-form(style='min-width: 300px;')
        b-input-group
          b-input(v-model='newTrustRecipientInput' placeholder='Email of trustee')
          b-input-group-addon
            Button(
              variant='primary'
              @click='onAddTrust'
            ) Add trust
    hr
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { Button } from '../../components/Button.vue'
import { emailIsValid } from '../../utilities/emailIsValid'

export default {
  components: {
    Button,
  },
  computed: {
    ...mapState('trusts', [
      'outgoing',
    ]),
    recipientIsValid() {
      return emailIsValid(this.newTrustRecipientInput)
    }
  },
  data() {
    return {
      newTrustRecipientInput: '',
    }
  },
  methods: {
    ...mapActions('trusts', [
      'addTrust',
      'removeTrust',
    ]),
    async onAddTrust() {
      await this.addTrust({
        recipient: this.newTrustRecipientInput,
        path: this.fragmentPath,
      })
      this.newTrustRecipientInput = ''
    },
    onRemoveTrust(trust) {
      this.removeTrust(trust)
    },
  },
  props: {
    fragmentPath: {
      type: Array,
      required: true,
    },
  },
}
</script>
