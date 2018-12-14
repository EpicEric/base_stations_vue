<template>
  <v-toolbar app absolute clipped-left dark id="map-header">
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <span class="title ml-3 mr-5">{{ title }}</span>
  </v-toolbar>
</template>
<script>
export default {
  data () {
    return {
      title: 'Mapa de ERBs'
    }
  }
}
</script>
