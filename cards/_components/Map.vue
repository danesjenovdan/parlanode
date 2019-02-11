<template>
  <div class="map-container">
    <l-map
      ref="myMap"
      :zoom="mapConfig.zoom"
      :url="mapConfig.url"
      :center="mapConfig.center"
    >
      <l-tile-layer
        :key="tileProviders[0].name"
        :name="tileProviders[0].name"
        :visible="tileProviders[0].visible"
        :url="tileProviders[0].url"
        :attribution="tileProviders[0].attribution"
        layer-type="base"
      />
      <l-marker
        v-for="listing in markers"
        :key="listing.id"
        :lat-lng="listing.latLng"
      >
        <l-icon
          :icon-url="listing.icon"
        />
        <l-popup>
          <p>
            <span class="bold">{{ listing.type }}</span><br><br>  
            <span class="bold">Cena:</span> {{ listing.price }}€<br>
            <span class="bold">Skupna ocena:</span> {{ listing.grade !== '\\N' ? listing.grade : 0 }} / 5<br>
            <span class="bold">Število vseh ocen:</span> {{ listing.reviews }}<br>
            <span class="bold">Število ležišč:</span> {{ listing.accomodates }}
          </p>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
/* global Vue */
if (typeof window !== 'undefined') {
  // eslint-disable-next-line global-require
  const { L, LMap, LTileLayer, LMarker, LIcon, LPopup } = require('vue2-leaflet');

  Vue.component('l-map', LMap);
  Vue.component('l-tile-layer', LTileLayer);
  Vue.component('l-marker', LMarker);
  Vue.component('l-icon', LIcon);
  Vue.component('l-popup', LPopup);
}

export default {
  // TODO: remove eslint comment
  // eslint-disable-next-line vue/name-property-casing
  name: 'ParlaMap',
  props: {
    mapConfig: {
      type: Object,
      required: false,
      default: () => {
        return {
          zoom: 12,
          center: [46.056946, 14.505752],
          url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        };
      },
    },
    markers: {
      type: Array,
      required: false,
      default: [],
    }
  },
  data() {
    return {
      tileProviders: [
        {
          name: 'OpenStreetMap',
          visible: true,
          attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        },
        {
          name: 'OpenTopoMap',
          visible: false,
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
          attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        },
      ],
      icons: {
        red: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIj48Zz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MDAgNjAwKSBzY2FsZSgwLjY5IDAuNjkpIHJvdGF0ZSgwKSB0cmFuc2xhdGUoLTYwMCAtNjAwKSIgc3R5bGU9ImZpbGw6I0IzMDAwMCI+PHN2ZyBmaWxsPSIjQjMwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PHBhdGggZD0iTTQ5Ljk5OSw1QzI1LjE0OCw1LDUsMjUuMTQ4LDUsNTAuMDAxQzUsNzQuODU0LDI1LjE0OCw5NSw0OS45OTksOTVDNzQuODU0LDk1LDk1LDc0Ljg1NCw5NSw1MC4wMDEgICBDOTUsMjUuMTQ4LDc0Ljg1NCw1LDQ5Ljk5OSw1eiBNNjEuMjgyLDYwLjc5NWMtNC4xMTYsNi43MTktOC4xNTksMTIuMzA1LTguMzE4LDEyLjU0M2wtMi45NjgsNC4wOTJsLTIuOTczLTQuMDkyICAgYy0wLjE2My0wLjIzOC00LjIxNi01LjgyNC04LjMzNS0xMi41NDNjLTUuODE0LTkuNDgzLTguNjQ4LTE2LjA1Ni04LjY0OC0yMC4wODdjMC0xMC4wMDEsOC45NDUtMTguMTQ0LDE5Ljk1Ni0xOC4xNDQgICBjMTAuOTgyLDAsMTkuOTM0LDguMTQzLDE5LjkzNCwxOC4xNDRDNjkuOTMsNDQuNzM5LDY3LjExMSw1MS4zMTIsNjEuMjgyLDYwLjc5NXoiPjwvcGF0aD48cGF0aCBkPSJNNDkuOTk2LDMxLjE4NmMtNS43MTIsMC0xMC4zNTIsNC4yMDQtMTAuMzUyLDkuNGMwLDUuMTk0LDQuNjM5LDkuNDE1LDEwLjM1Miw5LjQxNWM1LjY5NSwwLDEwLjMzMi00LjIyMSwxMC4zMzItOS40MTUgICBDNjAuMzI4LDM1LjM5LDU1LjY5MSwzMS4xODYsNDkuOTk2LDMxLjE4NnoiPjwvcGF0aD48L2c+PC9zdmc+PC9nPjwvZz48L3N2Zz4=',
        black: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PHBhdGggZD0iTTQ5Ljk5OSw1QzI1LjE0OCw1LDUsMjUuMTQ4LDUsNTAuMDAxQzUsNzQuODU0LDI1LjE0OCw5NSw0OS45OTksOTVDNzQuODU0LDk1LDk1LDc0Ljg1NCw5NSw1MC4wMDEgICBDOTUsMjUuMTQ4LDc0Ljg1NCw1LDQ5Ljk5OSw1eiBNNjEuMjgyLDYwLjc5NWMtNC4xMTYsNi43MTktOC4xNTksMTIuMzA1LTguMzE4LDEyLjU0M2wtMi45NjgsNC4wOTJsLTIuOTczLTQuMDkyICAgYy0wLjE2My0wLjIzOC00LjIxNi01LjgyNC04LjMzNS0xMi41NDNjLTUuODE0LTkuNDgzLTguNjQ4LTE2LjA1Ni04LjY0OC0yMC4wODdjMC0xMC4wMDEsOC45NDUtMTguMTQ0LDE5Ljk1Ni0xOC4xNDQgICBjMTAuOTgyLDAsMTkuOTM0LDguMTQzLDE5LjkzNCwxOC4xNDRDNjkuOTMsNDQuNzM5LDY3LjExMSw1MS4zMTIsNjEuMjgyLDYwLjc5NXoiPjwvcGF0aD48cGF0aCBkPSJNNDkuOTk2LDMxLjE4NmMtNS43MTIsMC0xMC4zNTIsNC4yMDQtMTAuMzUyLDkuNGMwLDUuMTk0LDQuNjM5LDkuNDE1LDEwLjM1Miw5LjQxNWM1LjY5NSwwLDEwLjMzMi00LjIyMSwxMC4zMzItOS40MTUgICBDNjAuMzI4LDM1LjM5LDU1LjY5MSwzMS4xODYsNDkuOTk2LDMxLjE4NnoiPjwvcGF0aD48L2c+PC9zdmc+',
        blue: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIj48Zz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MDAgNjAwKSBzY2FsZSgwLjY5IDAuNjkpIHJvdGF0ZSgwKSB0cmFuc2xhdGUoLTYwMCAtNjAwKSIgc3R5bGU9ImZpbGw6IzAwNTlCMyI+PHN2ZyBmaWxsPSIjMDA1OUIzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PHBhdGggZD0iTTQ5Ljk5OSw1QzI1LjE0OCw1LDUsMjUuMTQ4LDUsNTAuMDAxQzUsNzQuODU0LDI1LjE0OCw5NSw0OS45OTksOTVDNzQuODU0LDk1LDk1LDc0Ljg1NCw5NSw1MC4wMDEgICBDOTUsMjUuMTQ4LDc0Ljg1NCw1LDQ5Ljk5OSw1eiBNNjEuMjgyLDYwLjc5NWMtNC4xMTYsNi43MTktOC4xNTksMTIuMzA1LTguMzE4LDEyLjU0M2wtMi45NjgsNC4wOTJsLTIuOTczLTQuMDkyICAgYy0wLjE2My0wLjIzOC00LjIxNi01LjgyNC04LjMzNS0xMi41NDNjLTUuODE0LTkuNDgzLTguNjQ4LTE2LjA1Ni04LjY0OC0yMC4wODdjMC0xMC4wMDEsOC45NDUtMTguMTQ0LDE5Ljk1Ni0xOC4xNDQgICBjMTAuOTgyLDAsMTkuOTM0LDguMTQzLDE5LjkzNCwxOC4xNDRDNjkuOTMsNDQuNzM5LDY3LjExMSw1MS4zMTIsNjEuMjgyLDYwLjc5NXoiPjwvcGF0aD48cGF0aCBkPSJNNDkuOTk2LDMxLjE4NmMtNS43MTIsMC0xMC4zNTIsNC4yMDQtMTAuMzUyLDkuNGMwLDUuMTk0LDQuNjM5LDkuNDE1LDEwLjM1Miw5LjQxNWM1LjY5NSwwLDEwLjMzMi00LjIyMSwxMC4zMzItOS40MTUgICBDNjAuMzI4LDM1LjM5LDU1LjY5MSwzMS4xODYsNDkuOTk2LDMxLjE4NnoiPjwvcGF0aD48L2c+PC9zdmc+PC9nPjwvZz48L3N2Zz4=',
        purple: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIj48Zz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MDAgNjAwKSBzY2FsZSgwLjY5IDAuNjkpIHJvdGF0ZSgwKSB0cmFuc2xhdGUoLTYwMCAtNjAwKSIgc3R5bGU9ImZpbGw6Izc0MDBCMyI+PHN2ZyBmaWxsPSIjNzQwMEIzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PHBhdGggZD0iTTQ5Ljk5OSw1QzI1LjE0OCw1LDUsMjUuMTQ4LDUsNTAuMDAxQzUsNzQuODU0LDI1LjE0OCw5NSw0OS45OTksOTVDNzQuODU0LDk1LDk1LDc0Ljg1NCw5NSw1MC4wMDEgICBDOTUsMjUuMTQ4LDc0Ljg1NCw1LDQ5Ljk5OSw1eiBNNjEuMjgyLDYwLjc5NWMtNC4xMTYsNi43MTktOC4xNTksMTIuMzA1LTguMzE4LDEyLjU0M2wtMi45NjgsNC4wOTJsLTIuOTczLTQuMDkyICAgYy0wLjE2My0wLjIzOC00LjIxNi01LjgyNC04LjMzNS0xMi41NDNjLTUuODE0LTkuNDgzLTguNjQ4LTE2LjA1Ni04LjY0OC0yMC4wODdjMC0xMC4wMDEsOC45NDUtMTguMTQ0LDE5Ljk1Ni0xOC4xNDQgICBjMTAuOTgyLDAsMTkuOTM0LDguMTQzLDE5LjkzNCwxOC4xNDRDNjkuOTMsNDQuNzM5LDY3LjExMSw1MS4zMTIsNjEuMjgyLDYwLjc5NXoiPjwvcGF0aD48cGF0aCBkPSJNNDkuOTk2LDMxLjE4NmMtNS43MTIsMC0xMC4zNTIsNC4yMDQtMTAuMzUyLDkuNGMwLDUuMTk0LDQuNjM5LDkuNDE1LDEwLjM1Miw5LjQxNWM1LjY5NSwwLDEwLjMzMi00LjIyMSwxMC4zMzItOS40MTUgICBDNjAuMzI4LDM1LjM5LDU1LjY5MSwzMS4xODYsNDkuOTk2LDMxLjE4NnoiPjwvcGF0aD48L2c+PC9zdmc+PC9nPjwvZz48L3N2Zz4=',
      },
    };
  },
};
</script>

<style lang="scss">
@import '~leaflet/dist/leaflet.css';

.vue2leaflet-map {
  height: 500px !important;
  margin-bottom: 5px;
}

.leaflet-popup-tip-container {
  display: none;
}

.bold {
  font-weight: 700;
}
</style>
