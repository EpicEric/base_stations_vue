<template>
  <div>
  <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Mensagem
        </v-card-title>

        <v-card-text>
          {{message}}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="dialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <Header ref="header" @toggleSidebar="toggleSidebar" />
    <MapSidebar ref="sidebar" @changeOperator="moveendHandler" @selectRectangle="selectRectangle" @selectCircle="selectCircle" />
    <v-content>
      <loading :active.sync="isLoading"
                :is-full-page="false" >
        <bounce-loader :color="'#424242'" :size="'60px'" />
      </loading>
      <loading :active.sync="isOptimizing"
                :is-full-page="false" >
        <grid-loader :color="'#424242'" :size="'20px'" />
      </loading>
      <div id="map" v-bind:style="mapStyle" />
    </v-content>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet.featuregroup.subgroup'
import 'leaflet-draw'
import Loading from 'vue-loading-overlay'
import GridLoader from 'vue-spinner/src/GridLoader.vue'
import BounceLoader from 'vue-spinner/src/BounceLoader.vue'
import Header from '@/components/Header'
import MapSidebar from '@/components/MapSidebar'
import { HTTP } from '@/api/api.js'

import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'vue-loading-overlay/dist/vue-loading.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})
export default {
  components: {
    Header,
    MapSidebar,
    Loading,
    GridLoader,
    BounceLoader
  },
  data () {
    return {
      map: null,
      isLoading: true,
      isOptimizing: false,
      clusterURL: null,
      drawControl: null,
      drawnItems: null,
      dialog: false,
      message: "",
      mapStyle: {
        height: '100vh',
        'z-index': 0
      },
      markers: [],
      rectangle: {},
      numberErbs: 1
    }
  },
  beforeCreate () {
    if (!this.$store.getters.isAuthenticated) {
      this.$router.push('login')
    }
  },
  async mounted () {
    this.map = L.map('map')

    window.addEventListener('resize', this.handleResize)
    this.handleResize(null)

    this.drawnItems = new L.FeatureGroup()
    this.map.addLayer(this.drawnItems)
    this.drawControl = new L.Control.Draw({
      edit: {
        featureGroup: this.drawnItems
      }
    })

    this.map.setMaxZoom(19)
    this.map.fetchID = 0
    try {
      await this.initMap()
    } catch (err) {
      if (!/status code 401/.test(err)) {
        console.log(err)
      }
      return
    }

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png', {
      attribution: '&copy; <a href="https://carto.com/attribution/">Carto</a> (CC BY 3.0), <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> (ODbL)',
      maxNativeZoom: 19,
      maxZoom: 19
    }).addTo(this.map)

    let map = this.map
    map.on('moveend', this.moveendHandler)
    map.locate().on('locationfound', function (e) {
      map.setView([e.latitude, e.longitude], 17)
    }).on('locationerror', function (e) {
      map.setView(map.defaultLocation, 17)
    })
  },
  methods: {
    async initMap () {
      const response = await HTTP({
        url: '/api/map_info/',
        method: 'GET',
        headers: {
          'Authorization': 'Token ' + this.$store.state.authToken
        }
      })
      this.map.defaultLocation = response.data.location
      this.$store.state.selectedOperator = {}
      // this.map.setView(this.defaultLocation, 17)
      this.clusterURL = response.data.cluster_url
      this.operatorURL = response.data.operator_url
      this.$store.state.operators = [{ id: null, friendly_name: '' }]
      this.$store.state.selectedOperator = this.$store.state.operators[0]
      this.getOperatorData()
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
        fetchedOperators.sort(function (a, b) {
          if (a.friendly_name > b.friendly_name) return 1
          if (a.friendly_name < b.friendly_name) return -1
          return 0
        })
        this.$store.state.operators = this.$store.state.operators.concat(fetchedOperators)
      } catch (err) {
        console.log(err)
      }
    },
    moveendHandler (e) {
      const context = this
      const map = this.map
      map.fetchID = (this.map.fetchID % 9007199254740991) + 1
      const fetchID = this.map.fetchID
      this.clearMarkerLayers()
      map.markerClusterGroup = L.markerClusterGroup({
        showCoverageOnHover: false,
        iconCreateFunction: this.iconCreateFunction
      })
      map.markerClusterGroup.removeOnPan = true
      map.markerClusterGroup.fetchID = map.fetchID
      var zoom = map.getZoom()
      var bbox = map.getBounds().toBBoxString()
      var operator = this.$store.state.selectedOperator.id ? this.$store.state.selectedOperator.id : null
      var baseURL = this.clusterURL.replace(/\{\{zoom\}\}/, zoom).replace(/\{\{bbox\}\}/, bbox).replace(/\{\{operator\}\}/, operator)
      setTimeout(function () {
        if (fetchID === context.map.fetchID) {
          context.isLoading = true
          context.fetchClusters(baseURL, fetchID).then(() => {
            map.addLayer(map.markerClusterGroup)
            context.isLoading = false
          })
        }
      }, fetchID === 1 ? 0 : 750)
    },
    handleResize (event) {
      const context = this
      setTimeout(function () {
        let header = document.getElementById('map-header')
        if (header) {
          context.mapStyle.height = `calc(100vh - ${header.clientHeight}px)`
        }
      }, 200)
    },
    clearMarkerLayers () {
      const context = this
      this.map.eachLayer(function (layer) {
        if (layer.removeOnPan && layer.fetchID !== context.map.fetchID) {
          context.map.removeLayer(layer)
        }
      })
    },
    async fetchClusters (url, id) {
      // After changing pan/zoom, stop fetching from previous screen
      const map = this.map
      const context = this
      if (this.map.fetchID === id) {
        const response = await HTTP({
          url: url,
          method: 'GET',
          headers: {
            'Authorization': 'Token ' + this.$store.state.authToken
          }
        })
        var data = response.data
        // Try next page of API
        var promise = new Promise(function (resolve) {
          var newUrl = data.next
          if (newUrl) {
            resolve(context.fetchClusters(newUrl, id))
          } else {
            resolve()
          }
        })
        // Iterate over every feature and add to map
        var layer = L.featureGroup.subGroup(map.markerClusterGroup)
        L.geoJson(data, {
          onEachFeature: function onEachFeature (feature, marker) {
            var props = feature.properties
            marker.count = props.count
            // If it is not a cluster, add text data to marker
            if (props.count === 1) {
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
        if (id === context.map.fetchID) {
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
      if (count === 1) { // actual marker
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
    selectRectangle (numberErbs) {
      this.numberErbs = numberErbs
      new L.Draw.Rectangle(this.map, this.drawControl.options.rectangle).enable()
      this.map.on('draw:created', this.handleSelectRectangle)
    },
    async handleSelectRectangle (e) {
      // var type = e.layerType
      if (Object.keys(this.rectangle).length != 0) {
        this.drawnItems.removeLayer(this.rectangle)
      }
      this.rectangle = e.layer
      this.drawnItems.addLayer(this.rectangle)

      const min_lat = this.rectangle.getLatLngs()[0][0].lat
      const max_lat = this.rectangle.getLatLngs()[0][1].lat
      const min_long = this.rectangle.getLatLngs()[0][0].lng
      const max_long = this.rectangle.getLatLngs()[0][2].lng

      this.isOptimizing = true

      const response = await HTTP({
        url: '/api/optimization/?number_erbs='+this.numberErbs+'&min_lat='+min_lat+'&max_lat='+max_lat+'&min_long='+min_long+'&max_long='+max_long,
        method: 'GET',
        headers: {
          'Authorization': 'Token ' + this.$store.state.authToken
        }
      })
      const redIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
      const suggestions = response.data.suggestions
      if ('message' in response.data) {
        this.message = response.data.message
        this.dialog = true
      }
      if (this.markers.length != 0) {
        for(var i = 0; i < this.markers.length; i++) {
          this.map.removeLayer(this.markers[i])
        }
      }
      for (var i = 0; i < suggestions.length; i++) {
        this.markers.push(L.marker([suggestions[i][0], suggestions[i][1]], {icon: redIcon}))
        this.map.addLayer(this.markers[this.markers.length-1])
      }

      this.isOptimizing = false
    },
    toggleSidebar () {
      this.$refs.sidebar.toggleSidebar()
    },
    selectCircle () {
      new L.Draw.Circle(this.map, this.drawControl.options.circle).enable()
      this.map.on('draw:created', this.handleSelectCircle)
    },
    handleSelectCircle (e) {
      // var type = e.layerType
      var layer = e.layer
      alert(layer.getLatLng() + '\nRadio:' + layer.getRadius())
      this.drawnItems.addLayer(layer)
    }
  }
}
</script>
