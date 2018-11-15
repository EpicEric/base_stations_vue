<template>
  <v-container>
    <v-layout row class="text-xs-center">
      <v-flex xs4 class="grey lighten-4">
        <v-container style="position: relative;top: 15%;" class="text-xs-center">
          <v-card flat>
            <v-card-title primary-title>
              <h4>Login</h4>
            </v-card-title>
            <v-form>
            <v-text-field prepend-icon="person" v-model="email" name="Email" label="Email"></v-text-field>
            <v-text-field prepend-icon="lock" v-model="password" name="Senha" label="Senha" type="password"></v-text-field>
            <v-card-actions>
              <v-btn primary large block @click="login">Login</v-btn>
            </v-card-actions>
            </v-form>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    ...mapGetters([
      'isAuthenticated'
    ])
  },
  methods: {
    ...mapActions([
      'loginAction'
    ]),
    async login () {
      await this.loginAction({ username: this.email, password: this.password })
      if (this.isAuthenticated) {
        this.$router.push('mapa')
      }
    }
  }
}
</script>
