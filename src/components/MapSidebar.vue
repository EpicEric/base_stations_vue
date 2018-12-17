<template>
    <v-navigation-drawer dark
      fixed
      clipped
      app
      v-model="drawer"
      ref="drawer">
      <v-list>
        <v-list-tile class="close-button-tile"
                     @click="toggleSidebar">
          <v-list-tile-action>
            <v-icon>close</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Esconder menu</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-group
          prepend-icon="visibility">
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>Filtros</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click="swapShowOptions('operator')">
              <v-list-tile-content>
                <v-list-tile-title>Operadora</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon></v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <div class="ml-3" v-if="showOptions['operator']">
              <v-select
                @input="operatorChange"
                :items="operatorsToOptions()"
                v-model="$store.state.selectedOperator"
              ></v-select>
          </div>
          </v-list-group>
          <v-list-group
            v-for="item in items"
            v-model="item.active"
            :key="item.title"
            :prepend-icon="item.action"
            no-action
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile
              v-for="subItem in item.items"
              :key="subItem.title">
              <v-list-tile-content>
                <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-icon>{{ subItem.action }}</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
  data () {
    return {
      drawer: true,
      showOptions: { 'operator': false },
      items: [
        {
          action: 'send',
          title: 'Encontrar ponto ótimo',
          active: false,
          items: []
        }
      ]
    }
  },
  methods: {
    swapShowOptions (option) {
      switch (option) {
        case 'operator':
          this.showOptions['operator'] = !this.showOptions['operator']
          break
      }
    },
    operatorsToOptions () {
      return this.$store.state.operators.map(function (operator) {
        var newOperator = { toString: function () { return operator.friendly_name } }
        for (var key in operator) {
          newOperator[key] = operator[key]
        }
        return newOperator
      })
    },
    operatorChange (newOperator) {
      this.$emit('changeOperator')
    },
    toggleSidebar () {
      if (this.sidebarIsMobile()) {
        this.drawer = !this.drawer
      }
    },
    sidebarIsMobile () {
      return /v-navigation-drawer--is-mobile/.test(this.$refs.drawer.$el.className)
    }
  }
}
</script>
<style>
.close-button-tile {
  display: none;
}
.v-navigation-drawer--is-mobile .close-button-tile {
  display: block;
}
</style>
