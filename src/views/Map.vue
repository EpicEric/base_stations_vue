<template>
  <div>
    <MapSidebar></MapSidebar>
    <v-content>
      <v-container fluid>
        <div>Beautiful Map</div>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import MapSidebar from '@/components/MapSidebar'
export default {
  components: {
    MapSidebar
  }
}
</script>
