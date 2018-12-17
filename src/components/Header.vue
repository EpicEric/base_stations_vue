<template>
  <v-toolbar app absolute clipped-left dark id="map-header">
    <v-toolbar-side-icon @click.stop="toggleSidebar"></v-toolbar-side-icon>
    <span class="title ml-3 mr-5">{{ title }}</span>
  </v-toolbar>
</template>
<script>
export default {
  data () {
    return {
      title: 'Nimbus – Mapa de ERBs'
    }
  },
  methods: {
    toggleSidebar () {
      this.$emit('toggleSidebar')
    }
  }
}
</script>
