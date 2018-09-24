<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Cadastro</h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-3>
        <form>
          <v-layout column>
            <v-flex>
              <v-text-field
                name="usuario"
                label="Usuário"
                id="usuario"
                type="text"
                required></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                name="password"
                label="Senha"
                id="password"
                type="password"
                required></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                name="confirmPassword"
                label="Confirmar senha"
                id="confirmPassword"
                type="password"
                required></v-text-field>
            <v-text-field
                name="email"
                label="Email"
                id="email"
                type="email"
                required></v-text-field>
            <v-text-field
                name="confirmEmail"
                label="Confirmar email"
                id="confirmEmail"
                type="email"
                required></v-text-field>
            </v-flex>
            <v-flex class="text-xs-center" mt-5>
              <v-btn color="primary" type="submit">Cadastrar</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {}
</script>
