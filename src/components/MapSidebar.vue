<template>
    <v-navigation-drawer dark
      fixed
      clipped
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
              v-model="value"
              :items="operators"
            ></v-select>
          </div>

            <v-list-tile @click="swapShowOptions('technology')">
              <v-list-tile-content>
                <v-list-tile-title>Tecnologia</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon></v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <div class="ml-3" v-if="showOptions['technology']">
              <v-select
              v-model="value"
              :items="technologies"
            ></v-select>
          </div>
            <v-list-tile @click="swapShowOptions('locality')">
              <v-list-tile-content>
                <v-list-tile-title>Localidade</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon></v-icon>
              </v-list-tile-action>
            </v-list-tile>
           <template v-if="showOptions['locality']">
           <div class="ml-3">
            <v-list-tile >
                <v-list-tile-content>
                  <v-list-tile-title>Seleção retangular</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon></v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>Seleção circular</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon></v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile @click="swapShowOptions('cities')">
                <v-list-tile-content >
                  <v-list-tile-title>Seleção por cidade</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon></v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <div class="ml-3 mb-3" v-if="showOptions['cities']">
              <v-select
              v-model="value"
              :items="states"
              label="Estado"
            ></v-select>
              <v-select
              v-model="value"
              :items="cities"
              label="Cidade"
            ></v-select>
            </div></div>
          </template>
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
      showOptions: { 'technology': false, 'operator': false, 'locality': false, 'cities': false },
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
        }
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
      ],
      cities: [
        'São Paulo',
        'Guarulhos'
      ]
    }
  },
  methods: {
    swapShowOptions (option) {
      switch (option) {
        case 'technology':
          this.showOptions['technology'] = !this.showOptions['technology']
          break
        case 'operator':
          this.showOptions['operator'] = !this.showOptions['operator']
          break
        case 'locality':
          this.showOptions['locality'] = !this.showOptions['locality']
          break
        case 'cities':
          this.showOptions['cities'] = !this.showOptions['cities']
          break
      }
    }
  }
}
</script>
