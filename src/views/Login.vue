<template>
  <v-container fluid fill-height v-on:keyup.enter="login">
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field prepend-icon="person" v-model="email" name="login" label="Login" type="text"></v-text-field>
              <v-text-field id="password" prepend-icon="lock" v-model="password" name="password" label="Password" type="password"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <span class="red--text caption" v-if="!valid">Usuário ou senha inválidos.</span>
            <v-spacer></v-spacer>
            <v-btn type="submit" dark @click="login">Login</v-btn>
          </v-card-actions>
        </v-card>
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
      password: '',
      valid: true
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
      this.valid = true
      await this.loginAction({ username: this.email, password: this.password })
      if (this.isAuthenticated) {
        this.$router.push('map')
      } else {
        this.valid = false
      }
    }
  }
}
</script>
