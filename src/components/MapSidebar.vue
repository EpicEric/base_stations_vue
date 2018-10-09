<template>
    <v-navigation-drawer
      fixed
      clipped
      class="grey lighten-4"
      app
      v-model="drawer"
    >
      <v-list>
        <v-list-group
          prepend-icon="visibility">
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>Filtros</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click="showOptions('operators')">
              <v-list-tile-content>
                <v-list-tile-title>Operadora</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon></v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <div class="ml-3" v-if="showOperatorsOptions">
              <v-select
              v-model="value"
              :items="operators"
              label="Operadoras"
              multiple
            ></v-select>
          </div>
          
            <v-list-tile @click="showOptions('technology')">
              <v-list-tile-content>
                <v-list-tile-title>Tecnologia</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon></v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <div class="ml-3" v-if="showTechnologiesOptions">
              <v-select
              v-model="value"
              :items="technologies"
              label="Tecnologias"
              multiple
            ></v-select>
          </div>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>Localidade</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon></v-icon>
              </v-list-tile-action>
            </v-list-tile>
            
          
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
              :key="subItem.title"
              @click=""
            >
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
        showTechnologiesOptions: false,
        showOperatorsOptions: false,
        items: [
          {
            action: 'send',
            title: 'Encontrar ponto ótimo',
            active: true,
            items: []
          },
          {
            action: 'school',
            title: 'Mapa de calor',
            items: []
          },        
        ],
        technologies: [
          '3G',
          '4G'
        ],
        operators: [
          'Claro',
          'TIM',
          'Vivo'
        ],
        states: [
          'SP'
        ]
      }
    },
    methods: {
      showOptions(option) {
        switch(option) {
          case 'technology':
            this.showTechnologiesOptions = !this.showTechnologiesOptions
            break
          case 'operators':
            this.showOperatorsOptions = !this.showOperatorsOptions
            break
        }
      }
    }
  }
</script>