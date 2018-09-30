<template>
  <div>
    <MapSidebar></MapSidebar>
    <v-content>
      <v-container>
        <div id="map"></div>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import MapSidebar from '@/components/MapSidebar'
export default {
  components: {
    MapSidebar
  },
  mounted() {
      var map = L.map('map').setView([51.505, -0.09], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)

      L.marker([51.5, -0.09]).addTo(map)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup()
  }
}
</script>
<style>
#map {height: 1000px; z-index: 0}
</style>
