<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="fullUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <div slot="info">
      <p class="info-text lead"></p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text"><span v-t="'info.content'"></span></p>
    </div>

    <!-- Card content goes here -->
    <parla-map
      :markers="filteredListings"
    />
    <div class="legenda">
      <div class="legendek"><img :src="this.icons.blue"> Celo stanovanje</div>
      <div class="legendek"><img :src="this.icons.red"> Zasebna soba</div>
      <div class="legendek"><img :src="this.icons.purple"> Deljena soba</div>
    </div>
  </card-wrapper>
</template>

<script>
import Papa from 'papaparse';
import common from 'mixins/common';
import ParlaMap from 'components/Map.vue';
import csvData from './stanovanja.csv';


export default {
  name: 'MarkerMap',
  components: {
    ParlaMap,
  },
  mixins: [common],
  data() {
    return {
      data: this.$options.cardData.data,
      headerConfig: {
        // TODO: fix this when developing card
        // best if you include a mixin from 'mixins/altHeaders'
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$t('card.title'),
      },
      ogConfig: {
        // TODO: fix this when developing card
        // best if you include a mixin from 'mixins/ogImages'
      },
      mapData: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vReH8w5UCApMkLB9xBbgKZVfCWnOYS5HbjEFc7KmRj2kpnVv2eK6QPhRKmTKKVCwcVbTtSZmNJB9775/pub?output=csv',
      // mapConfig: {
      //   zoom: 12,
      //   // center: L.latLng(46.056946, 14.505752),
      //   url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      //   attribution:
      //     '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      // },
      icons: {
        red: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIj48Zz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MDAgNjAwKSBzY2FsZSgwLjY5IDAuNjkpIHJvdGF0ZSgwKSB0cmFuc2xhdGUoLTYwMCAtNjAwKSIgc3R5bGU9ImZpbGw6I0IzMDAwMCI+PHN2ZyBmaWxsPSIjQjMwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PHBhdGggZD0iTTQ5Ljk5OSw1QzI1LjE0OCw1LDUsMjUuMTQ4LDUsNTAuMDAxQzUsNzQuODU0LDI1LjE0OCw5NSw0OS45OTksOTVDNzQuODU0LDk1LDk1LDc0Ljg1NCw5NSw1MC4wMDEgICBDOTUsMjUuMTQ4LDc0Ljg1NCw1LDQ5Ljk5OSw1eiBNNjEuMjgyLDYwLjc5NWMtNC4xMTYsNi43MTktOC4xNTksMTIuMzA1LTguMzE4LDEyLjU0M2wtMi45NjgsNC4wOTJsLTIuOTczLTQuMDkyICAgYy0wLjE2My0wLjIzOC00LjIxNi01LjgyNC04LjMzNS0xMi41NDNjLTUuODE0LTkuNDgzLTguNjQ4LTE2LjA1Ni04LjY0OC0yMC4wODdjMC0xMC4wMDEsOC45NDUtMTguMTQ0LDE5Ljk1Ni0xOC4xNDQgICBjMTAuOTgyLDAsMTkuOTM0LDguMTQzLDE5LjkzNCwxOC4xNDRDNjkuOTMsNDQuNzM5LDY3LjExMSw1MS4zMTIsNjEuMjgyLDYwLjc5NXoiPjwvcGF0aD48cGF0aCBkPSJNNDkuOTk2LDMxLjE4NmMtNS43MTIsMC0xMC4zNTIsNC4yMDQtMTAuMzUyLDkuNGMwLDUuMTk0LDQuNjM5LDkuNDE1LDEwLjM1Miw5LjQxNWM1LjY5NSwwLDEwLjMzMi00LjIyMSwxMC4zMzItOS40MTUgICBDNjAuMzI4LDM1LjM5LDU1LjY5MSwzMS4xODYsNDkuOTk2LDMxLjE4NnoiPjwvcGF0aD48L2c+PC9zdmc+PC9nPjwvZz48L3N2Zz4=',
        black: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PHBhdGggZD0iTTQ5Ljk5OSw1QzI1LjE0OCw1LDUsMjUuMTQ4LDUsNTAuMDAxQzUsNzQuODU0LDI1LjE0OCw5NSw0OS45OTksOTVDNzQuODU0LDk1LDk1LDc0Ljg1NCw5NSw1MC4wMDEgICBDOTUsMjUuMTQ4LDc0Ljg1NCw1LDQ5Ljk5OSw1eiBNNjEuMjgyLDYwLjc5NWMtNC4xMTYsNi43MTktOC4xNTksMTIuMzA1LTguMzE4LDEyLjU0M2wtMi45NjgsNC4wOTJsLTIuOTczLTQuMDkyICAgYy0wLjE2My0wLjIzOC00LjIxNi01LjgyNC04LjMzNS0xMi41NDNjLTUuODE0LTkuNDgzLTguNjQ4LTE2LjA1Ni04LjY0OC0yMC4wODdjMC0xMC4wMDEsOC45NDUtMTguMTQ0LDE5Ljk1Ni0xOC4xNDQgICBjMTAuOTgyLDAsMTkuOTM0LDguMTQzLDE5LjkzNCwxOC4xNDRDNjkuOTMsNDQuNzM5LDY3LjExMSw1MS4zMTIsNjEuMjgyLDYwLjc5NXoiPjwvcGF0aD48cGF0aCBkPSJNNDkuOTk2LDMxLjE4NmMtNS43MTIsMC0xMC4zNTIsNC4yMDQtMTAuMzUyLDkuNGMwLDUuMTk0LDQuNjM5LDkuNDE1LDEwLjM1Miw5LjQxNWM1LjY5NSwwLDEwLjMzMi00LjIyMSwxMC4zMzItOS40MTUgICBDNjAuMzI4LDM1LjM5LDU1LjY5MSwzMS4xODYsNDkuOTk2LDMxLjE4NnoiPjwvcGF0aD48L2c+PC9zdmc+',
        blue: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIj48Zz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MDAgNjAwKSBzY2FsZSgwLjY5IDAuNjkpIHJvdGF0ZSgwKSB0cmFuc2xhdGUoLTYwMCAtNjAwKSIgc3R5bGU9ImZpbGw6IzAwNTlCMyI+PHN2ZyBmaWxsPSIjMDA1OUIzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PHBhdGggZD0iTTQ5Ljk5OSw1QzI1LjE0OCw1LDUsMjUuMTQ4LDUsNTAuMDAxQzUsNzQuODU0LDI1LjE0OCw5NSw0OS45OTksOTVDNzQuODU0LDk1LDk1LDc0Ljg1NCw5NSw1MC4wMDEgICBDOTUsMjUuMTQ4LDc0Ljg1NCw1LDQ5Ljk5OSw1eiBNNjEuMjgyLDYwLjc5NWMtNC4xMTYsNi43MTktOC4xNTksMTIuMzA1LTguMzE4LDEyLjU0M2wtMi45NjgsNC4wOTJsLTIuOTczLTQuMDkyICAgYy0wLjE2My0wLjIzOC00LjIxNi01LjgyNC04LjMzNS0xMi41NDNjLTUuODE0LTkuNDgzLTguNjQ4LTE2LjA1Ni04LjY0OC0yMC4wODdjMC0xMC4wMDEsOC45NDUtMTguMTQ0LDE5Ljk1Ni0xOC4xNDQgICBjMTAuOTgyLDAsMTkuOTM0LDguMTQzLDE5LjkzNCwxOC4xNDRDNjkuOTMsNDQuNzM5LDY3LjExMSw1MS4zMTIsNjEuMjgyLDYwLjc5NXoiPjwvcGF0aD48cGF0aCBkPSJNNDkuOTk2LDMxLjE4NmMtNS43MTIsMC0xMC4zNTIsNC4yMDQtMTAuMzUyLDkuNGMwLDUuMTk0LDQuNjM5LDkuNDE1LDEwLjM1Miw5LjQxNWM1LjY5NSwwLDEwLjMzMi00LjIyMSwxMC4zMzItOS40MTUgICBDNjAuMzI4LDM1LjM5LDU1LjY5MSwzMS4xODYsNDkuOTk2LDMxLjE4NnoiPjwvcGF0aD48L2c+PC9zdmc+PC9nPjwvZz48L3N2Zz4=',
        purple: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIj48Zz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MDAgNjAwKSBzY2FsZSgwLjY5IDAuNjkpIHJvdGF0ZSgwKSB0cmFuc2xhdGUoLTYwMCAtNjAwKSIgc3R5bGU9ImZpbGw6Izc0MDBCMyI+PHN2ZyBmaWxsPSIjNzQwMEIzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PHBhdGggZD0iTTQ5Ljk5OSw1QzI1LjE0OCw1LDUsMjUuMTQ4LDUsNTAuMDAxQzUsNzQuODU0LDI1LjE0OCw5NSw0OS45OTksOTVDNzQuODU0LDk1LDk1LDc0Ljg1NCw5NSw1MC4wMDEgICBDOTUsMjUuMTQ4LDc0Ljg1NCw1LDQ5Ljk5OSw1eiBNNjEuMjgyLDYwLjc5NWMtNC4xMTYsNi43MTktOC4xNTksMTIuMzA1LTguMzE4LDEyLjU0M2wtMi45NjgsNC4wOTJsLTIuOTczLTQuMDkyICAgYy0wLjE2My0wLjIzOC00LjIxNi01LjgyNC04LjMzNS0xMi41NDNjLTUuODE0LTkuNDgzLTguNjQ4LTE2LjA1Ni04LjY0OC0yMC4wODdjMC0xMC4wMDEsOC45NDUtMTguMTQ0LDE5Ljk1Ni0xOC4xNDQgICBjMTAuOTgyLDAsMTkuOTM0LDguMTQzLDE5LjkzNCwxOC4xNDRDNjkuOTMsNDQuNzM5LDY3LjExMSw1MS4zMTIsNjEuMjgyLDYwLjc5NXoiPjwvcGF0aD48cGF0aCBkPSJNNDkuOTk2LDMxLjE4NmMtNS43MTIsMC0xMC4zNTIsNC4yMDQtMTAuMzUyLDkuNGMwLDUuMTk0LDQuNjM5LDkuNDE1LDEwLjM1Miw5LjQxNWM1LjY5NSwwLDEwLjMzMi00LjIyMSwxMC4zMzItOS40MTUgICBDNjAuMzI4LDM1LjM5LDU1LjY5MSwzMS4xODYsNDkuOTk2LDMxLjE4NnoiPjwvcGF0aD48L2c+PC9zdmc+PC9nPjwvZz48L3N2Zz4=',
      },
      listings: [],
    };
  },

  computed: {
    filteredListings() {
      return this.listings.filter(listing => parseInt(listing.lastYearsReviews, 10) > 50);
    },
    fullUrl() {
      return `${this.url}?justMe=true`;
    },
  },

  mounted() {
    this.listings = Papa.parse(csvData, {}).data.slice(1).map((listing) => {
      let icon = this.icons.black;
      let type = '';
      switch (listing[1]) {
        case 'Entire home/apt':
          icon = this.icons.blue;
          type = 'Stanovanje';
          break;
        case 'Private room':
          icon = this.icons.red;
          type = 'Zasebna soba';
          break;
        case 'Shared room':
          icon = this.icons.purple;
          type = 'Deljena soba';
          break;
        default:
          icon = this.icons.black;
          type = '';
          break;
      }

      const listingObject = {
        icon,
        latLng: [parseFloat(listing[10], 10), parseFloat(listing[11], 10)],
        reviewedMonths: listing[9],
        reviews: listing[12],
        grade: listing[13],
        price: listing[14],
        accomodates: listing[2],
        type,
        id: listing[0],
        lastYearsReviews: listing[15],
      };
      return listingObject;
    });
  },
};
</script>

<style lang="scss">
@import '~leaflet/dist/leaflet.css';
.legenda {
  width: 100%;
  margin-bottom: 5px;

  .legendek {
    display: inline-block;
    img {
      width: 40px;
      display: inline;
    }
  }
}
</style>
