<template>
  <div>
    <MapSidebar @selectRectangle="selectRectangle" @selectCircle="selectCircle" ></MapSidebar>
    <v-content>
        <div id="map"></div>
    </v-content>
  </div>
</template>

<script>
import MapSidebar from '@/components/MapSidebar'
import { HTTP } from '@/api/api.js'

export default {
  components: {
    MapSidebar
  },
  data () {
    return {
      map: null,
      clusterURL: null,
      drawControl: null,
      drawnItems: null
    }
  },
  beforeCreate () {
    if (!this.$store.getters.isAuthenticated) {
      this.$router.push('login')
    }
  },
  async mounted () {
    this.map = L.map('map')

    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);
    this.drawControl = new L.Control.Draw({
      edit: {
        featureGroup: this.drawnItems
      }
    });

    this.map.setMaxZoom(19)
    this.map.fetchID = 0  
    await this.initMap()

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map)

    this.map.on('moveend', this.moveendHandler)
    // var bounds = [[-46.7302, -23.5572], [-46.7202, -23.5472]]
    // var rectangle = L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(this.map)
    // rectangle.editing.enable()
    // this.map.fitBounds(bounds)
  },
  methods: {
    async initMap () {
      try {
        const response = await HTTP({
          url: '/api/map_info/',
          method: 'GET',
          headers: {
            'Authorization': 'Token ' + this.$store.state.authToken
          }
        })
        this.defaultLocation = response.data.location
        this.$store.state.selectedOperator = {}
        this.map.setView(this.defaultLocation, 17)
        this.clusterURL = response.data.cluster_url
        this.operatorURL = response.data.operator_url
        this.$store.state.operators = [{id: null, friendly_name: ""}]
        this.$store.state.selectedOperator = this.$store.state.operators[0]
        this.getOperatorData()
      } catch (err) {
        console.log(err)
      }
    },
    async getOperatorData () {
      try {
        const response = await HTTP({
          url: this.operatorURL,
          method: 'GET',
          headers: {
            'Authorization': 'Token ' + this.$store.state.authToken
          }
        })
        var fetchedOperators = response.data
        fetchedOperators.sort(function(a, b) {
          if (a.friendly_name > b.friendly_name) return 1;
          if (a.friendly_name < b.friendly_name) return -1;
          return 0;
        })
        this.$store.state.operators = this.$store.state.operators.concat(fetchedOperators)
      } catch (err) {
        console.log(err)
      }
    },
    moveendHandler (e) {
      this.map.fetchID = (this.map.fetchID % 9007199254740991) + 1
      this.clearMarkerLayers()
      this.map.markerClusterGroup = L.markerClusterGroup({
        showCoverageOnHover: false,
        iconCreateFunction: this.iconCreateFunction
      })
      this.map.markerClusterGroup.removeOnPan = true
      this.map.markerClusterGroup.fetchID = this.map.fetchID
      var zoom = this.map.getZoom()
      var bbox = this.map.getBounds().toBBoxString()
      var operator = this.$store.state.selectedOperator.id ? this.$store.state.selectedOperator.id : null
      console.log(this.$store.state.selectedOperator)
      var baseURL = this.clusterURL.replace(/\{\{zoom\}\}/, zoom).replace(/\{\{bbox\}\}/, bbox).replace(/\{\{operator\}\}/, operator)
      this.fetchClusters(baseURL, this.map.fetchID)
    },
    clearMarkerLayers () {
      var context = this
      this.map.eachLayer(function (layer) {
        if (layer.removeOnPan && layer.fetchID != context.map.fetchID) {
          context.map.removeLayer(layer)
        }
      })
    },
    async continueFetch(new_url, id) {
      var map = this.map
      var context = this
      if (new_url) {
        context.fetchClusters(new_url, id)
      } else {
        map.addLayer(map.markerClusterGroup)
      }
    },
    async fetchClusters (url, id) {
      // After changing pan/zoom, stop fetching from previous screen
      var map = this.map
      var context = this
      if (this.map.fetchID == id) {
        const response = await HTTP({
          url: url,
          method: 'GET',
          headers: {
            'Authorization': 'Token ' + this.$store.state.authToken
          }
        })
        var data = response.data
        // Try next page of API
        var promise = continueFetch(data.next, id)
        // Iterate over every feature and add to map
        var layer = L.featureGroup.subGroup(map.markerClusterGroup)
        L.geoJson(data, {
          onEachFeature: function onEachFeature (feature, marker) {
            var props = feature.properties
            marker.count = props.count
            // If it is not a cluster, add text data to marker
            if (props.count == 1) {
              marker.bindTooltip(`${props.data}`)
            } else {
              marker.setIcon(context.iconCreateFunction(marker))
              marker.on('click', function (e) {
                context.map.setView(e.latlng, context.map.getZoom() + 1)
              })
            }
          }
        }).addTo(layer)
        layer.removeOnPan = true
        layer.fetchID = id
        context.clearMarkerLayers()
        if (id == context.map.fetchID) {
          context.map.addLayer(layer)
        }
        return promise
      }
    },
    iconCreateFunction (cluster) {
      var count = 0
      if (cluster.getAllChildMarkers) { // markercluster plugin call
        var children = cluster.getAllChildMarkers()
        for (var i = 0; i < children.length; i++) {
          if (children[i].count) {
            count += children[i].count
          } else {
            count++
          }
        }
      } else if (cluster.count) { // custom call
        count = cluster.count
      }
      if (count == 1) { // actual marker
        return new L.Icon.Default()
      }
      // cluster icon
      var c = 'marker-cluster-'
      if (count < 100) {
        c += 'small'
      } else if (count < 1000) {
        c += 'medium'
      } else {
        c += 'large'
      }
      return new L.DivIcon({
        html: '<div><span>' + this.getTextFromCount(count) + '</span></div>',
        className: 'marker-cluster ' + c,
        iconSize: new L.Point(40, 40)
      })
    },
    getTextFromCount (count) {
      var suffix = ['', 'k', 'M']
      var suffixIndex = 0
      if (count > 10000) {
        while (count > 1000) {
          count /= 1000
          suffixIndex++
        }
      }
      if (count > 100) {
        return Math.round(count) + suffix[suffixIndex]
      }
      if (count > 10) {
        return (Math.round(count * 10) / 10) + suffix[suffixIndex]
      }
      return (Math.round(count * 100) / 100) + suffix[suffixIndex]
    },
    selectRectangle () {
      new L.Draw.Rectangle(this.map, this.drawControl.options.rectangle).enable()
      this.map.on('draw:created', this.handleSelectRectangle)
    },
    handleSelectRectangle (e) {
      var type = e.layerType
      var layer = e.layer
      alert(layer.getLatLngs())
      this.drawnItems.addLayer(layer)
    },

    selectCircle () {
      new L.Draw.Circle(this.map, this.drawControl.options.circle).enable()
      this.map.on('draw:created', this.handleSelectCircle)
    },
    handleSelectCircle (e) {
      console.log(e)
      var type = e.layerType
      var layer = e.layer
      alert(layer.getLatLng() + "\nRadio:" + layer.getRadius())
      this.drawnItems.addLayer(layer)
    },
  }
}

</script>
<style>
#map {height: 1000px; z-index: 0}
</style>
