<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="url"
    :header-config="headerConfig"
    @backChange="backChangeCallback"
  >

    <div id="kompas">
      <p-search-dropdown
        :value="allItems"
        :groups="groups"
        :placeholder="peoplePlaceholder"
        @select="selectCallback"
        @clear="clearCallback"
      />
      <div id="visualisation"></div>
    </div>

    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text[0]'" class="info-text"></p>
      <p v-t="'info.text[1]'" class="info-text"></p>
      <p v-t="'info.text[2]'" class="info-text"></p>
    </div>

    <!-- Card content goes here -->
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import links from 'mixins/links';
import PSearchDropdown from 'components/SearchDropdown.vue';
import { defaultOgImage } from 'mixins/ogImages';
import d3 from 'd3v3';

export default {
  name: 'Kompas',

  components: { PSearchDropdown },

  mixins: [common, links],

  data() {
    const kompasData = this.$options.cardData.data.data;
    const margin = {
      top: 50,
      right: 300,
      bottom: 50,
      left: 50,
    };
    const outerWidth = 1050;
    const outerHeight = 500;
    const width = outerWidth - margin.left - margin.right;
    const height = outerHeight - margin.top - margin.bottom;

    const partyAcronyms = this.groupBy(kompasData, item => [item.person.party.acronym]);

    const x = d3.scale.linear()
      .range([0, width])
      .nice();

    const y = d3.scale.linear()
      .range([height, 0])
      .nice();

    const xMax = d3.max(kompasData, d => d.score.vT1) * 1.05;
    let xMin = d3.min(kompasData, d => d.score.vT1) > 0;
    xMin = xMin > 0 ? 0 : xMin;
    const yMax = d3.max(kompasData, d => d.score.vT2) * 1.05;
    let yMin = d3.min(kompasData, d => d.score.vT2);
    yMin = yMin > 0 ? 0 : yMin;

    x.domain([xMin, xMax]);
    y.domain([yMin, yMax]);

    const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickSize(0);

    const yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .tickSize(0);

    const zoomBeh = null;

    const people = kompasData.map((p) => {
      return {
        id: p.person.id,
        label: p.person.name,
        selected: false,
        image: this.getPersonPortrait(p.person),
        acronym: p.person.party.acronym,
      };
    });

    const parties = partyAcronyms.map((group) => {
      return {
        id: group[0].person.party.acronym,
        label: group[0].person.party.acronym,
        selected: false,
        colorClass: `${group[0].person.party.acronym.toLowerCase().replace(/[ +,]/g, '_')}-background`,
      };
    });

    const groups = [{
      label: 'Stranke',
      items: partyAcronyms.map(group => group[0].person.party.acronym),
    }].concat(partyAcronyms.map((group) => {
      return {
        label: group[0].person.party.acronym,
        items: group.map(p => p.person.id),
      };
    }));

    return {
      data: this.$options.cardData.data,
      headerConfig: {
        circleIcon: 'og-kompas',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
      ogConfig: defaultOgImage(this, { icon: 'og-kompas' }),
      margin,
      outerWidth,
      outerHeight,
      width,
      height,
      partyAcronyms,
      x,
      y,
      xAxis,
      yAxis,
      zoomBeh,
      kompasData,
      people,
      parties,
      groups,
    };
  },

  computed: {
    peoplePlaceholder() {
      const numberOfSelectedPeople = this.people.filter(p => p.selected).length;
      return numberOfSelectedPeople > 0 ? `Izbranih ${numberOfSelectedPeople} poslancev` : 'Izberi poslance';
    },

    allItems() {
      return this.people.concat(this.parties);
    },
  },

  mounted() {
    this.zoomBeh = d3.behavior.zoom()
      .x(this.x)
      .y(this.y)
      .scaleExtent([0.6, 10])
      .on('zoom', this.zoom);

    this.drawCompass();
  },

  methods: {
    measurePiwik(filter, sort, order) {
      if (typeof measure === 'function') {
        if (sort !== '') {
          measure('s', 'session-sort', `${sort} ${order}`, '');
        } else if (filter !== '') {
          measure('s', 'session-filter', filter, '');
        }
      }
    },

    groupBy(array, f) {
      const groups = {};
      array.forEach((o) => {
        const group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map(group => groups[group]);
    },

    zoom(animate) {
      const svg = d3.select('#visualisation');
      if (animate) {
        svg.selectAll('.dot')
          .transition()
          .duration(400)
          .attr('transform', d => `translate(${this.x(d.score.vT1)},${this.y(d.score.vT2)})`);
      } else {
        svg.selectAll('.dot')
          .attr('transform', d => `translate(${this.x(d.score.vT1)},${this.y(d.score.vT2)})`);
      }
    },

    moveToFront(parent, selected) {
      // move person to group front
      d3.select(parent).selectAll('.dot')
        .sort((a, b) => {
          const s = selected.person.id;
          return (a.person.id === s) - (b.person.id === s);
        });

      // move group in front of other groups
      d3.select(parent.parentNode).selectAll('.partygroup')
        .sort((a, b) => {
          const s = selected.person.party.id;
          return (a[0].person.party.id === s) - (b[0].person.party.id === s);
        });
    },

    centerCompass() {
      // translate points to [0, 0]
      this.zoomBeh.scale([0.7]);
      this.zoomBeh.translate([200, 50]);
      this.zoom(true);
    },

    showPersonPicture(datum) {
      const svg = d3.select('#visualisation'); 
      // display person image
      d3.select(`#kompas-personcard${datum.person.id}`)
        .classed('hidden', false);

      // move to front
      const element = d3.select(`#_${datum.person.id}`);
      const parent = element[0].parentNode;
      this.moveToFront(parent, datum);

      // create hull
      svg.select(`#_${datum.person.id}`)
        .attr('r', 20)
        .style('fill', d => `url(#${d.person.gov_id})`)
        .classed('turnedon', true)
        .on('click', (d) => {
          this.selectCallback(d.person.id);
        });
    },

    hidePersonPicture(datum) {
      // hide person image
      d3.select(`#kompas-personcard${datum.person.id}`)
        .classed('hidden', true);

      const svg = d3.select('#visualisation');

      // move to front
      const element = d3.select(`#_${datum.person.id}`);
      const parent = element[0].parentNode;
      this.moveToFront(parent, datum);

      // create hull
      svg.select(`#_${datum.person.id}`)
        .attr('r', 3)
        .style('fill', null)
        .classed('turnedon', false)
        .on('click', (d) => {
          this.selectCallback(d.person.id);
        });
    },

    showPartyPictures(acronym) {
      const people = this.people.filter(p => p.acronym === acronym);

      people.forEach((p) => {
        this.showPersonPicture(this.kompasData.find(pp => pp.person.id === p.id));
      });
    },

    hidePartyPictures(acronym) {
      const people = this.people.filter(p => p.acronym === acronym);

      people.forEach((p) => {
        if (!p.selected) {
          this.hidePersonPicture(this.kompasData.find(pp => pp.person.id === p.id));
        }
      });
    },

    zoomIn(datum, scale) {
      const svg = d3.select('#visualisation');

      // translate points to [0, 0]
      this.zoomBeh.scale([scale]);
      this.zoomBeh.translate([0, 0]);

      const parentBounds = svg.node().getBoundingClientRect();
      const stretchCoef = {
        x: 700 / parentBounds.width,
        y: 400 / parentBounds.height,
      };

      const newx = (parentBounds.width / 2 * stretchCoef.x) - this.x(datum.score.vT1);
      const newy = (parentBounds.height / 2 * stretchCoef.y) - this.y(datum.score.vT2);
      this.zoomBeh.translate([newx, newy]);
      this.zoom(true);
    },

    selectCallback(id) {
      // it's a person
      if (parseInt(id, 10)) {
        if (!this.people.find(p => p.id === id).selected) {
          this.people.find(p => p.id === id).selected = true;
          this.showPersonPicture(this.kompasData.find(p => p.person.id === id));
        } else {
          this.people.find(p => p.id === id).selected = false;
          this.hidePersonPicture(this.kompasData.find(p => p.person.id === id));
        }
      } else if (!this.parties.find(p => p.id === id).selected) {
        this.parties.find(p => p.id === id).selected = true;
        this.showPartyPictures(id);
      } else {
        this.parties.find(p => p.id === id).selected = false;
        this.hidePartyPictures(id);
      }
    },

    clearCallback() {
      this.parties.filter(p => p.selected).forEach((p) => {
        this.hidePartyPictures(p.id);
      });
      this.people.filter(p => p.selected).forEach((p) => {
        this.hidePersonPicture(this.kompasData.find(pp => pp.person.id === p.id));
      });
      this.allItems.filter(p => p.selected).forEach((p) => {
        p.selected = false;
      });
    },

    drawCompass() {
      const svg = d3.select('#visualisation')
        .append('svg')
        .attr('viewBox', '0 0 700 400')
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .append('g')
        .call(this.zoomBeh);

      svg.append('rect')
        .attr('width', this.width)
        .attr('height', this.height);

      svg.append('g')
        .classed('x axis', true)
        .attr('transform', `translate(0, ${this.height})`)
        .call(this.xAxis);

      svg.append('g')
        .classed('y axis', true)
        .call(this.yAxis);

      svg.selectAll('.tick')
        .each(function () {
          this.remove();
        });

      const objects = svg.append('svg')
        .classed('objects', true)
        .attr('width', this.width)
        .attr('height', this.height);

      objects.selectAll('g')
        .data(this.partyAcronyms)
        .enter()
        .append('g')
        .attr('id', (d, i) => `kompasgroup${d[0].person.party.acronym.replace(/[ +,]/g, '_')}`);

      const defs = svg.append('defs');

      this.kompasData.forEach((datum) => {
        defs.append('pattern')
          .attr('id', datum.person.gov_id)
          .attr('patternUnits', 'userSpaceOnUse')
          .attr('width', 40)
          .attr('height', 40)
          .attr('x', -20)
          .attr('y', 20)
          .append('image')
          .attr('xlink:href', `${this.slugs.urls.cdn}/img/people/square/${datum.person.gov_id}.png`)
          .attr('width', 40)
          .attr('height', 40)
          .attr('x', 0)
          .attr('y', 0);
      });

      svg.append('svg')
        .attr('width', 20)
        .attr('height', 20)
        .attr('x', this.width - 30)
        .attr('y', this.height - 30)
        .attr('viewBox', '0 0 1280 1280')
        .html('<g class="centerme" transform="translate(-2108.7199,-3554.229)"><rect style="fill: #ffffff;" transform="translate(2108.7199,3554.229)" width="1280" height="1280"></rect><path style="" d="m 2108.7199,4744.854 c 0,-58.75 0.4283,-89.375 1.25,-89.375 0.8226,0 1.25,-33.125 1.25,-96.875 l 0,-96.875 90,0 90,0 0,96.875 0,96.875 95,0 95,0 0,89.375 0,89.375 -186.25,0 -186.25,0 0,-89.375 z m 907.5001,0 0,-89.375 96.25,0 96.25,0 0,-96.875 0,-96.875 90,0 90,0 0,186.25 0,186.25 -186.25,0 -186.25,0 0,-89.375 z m -291.2501,-334.5266 c -35.2236,-4.0473 -73.0374,-18.343 -101.25,-38.2781 -15.2954,-10.8077 -42.0126,-37.5249 -52.8203,-52.8203 -24.7025,-34.9595 -39.6592,-82.1008 -39.6592,-125 0,-42.8992 14.9567,-90.0405 39.6592,-125 10.8077,-15.2954 37.5249,-42.0126 52.8203,-52.8204 22.3667,-15.8043 55.1117,-29.8695 81.875,-35.1684 48.4773,-9.598 95.5802,-3.2991 140.0001,18.7217 22.1493,10.9804 36.9714,21.8091 56.2772,41.1149 19.3057,19.3057 30.1345,34.1279 41.1148,56.2772 30.8302,62.1899 30.8302,131.5601 0,193.75 -10.9803,22.1493 -21.8091,36.9715 -41.1148,56.2772 -19.3058,19.3058 -34.1279,30.1345 -56.2772,41.1149 -37.9266,18.8018 -80.28,26.4671 -120.6251,21.8313 z m -613.75,-669.8484 0,-186.25 185,0 185,0 0,89.375 0,89.375 -95,0 -95,0 0,96.875 0,96.875 -90,0 -90,0 0,-186.25 z m 1097.5001,89.375 0,-96.875 -96.25,0 -96.25,0 0,-89.375 0,-89.375 186.25,0 186.25,0 0,186.25 0,186.25 -90,0 -90,0 0,-96.875 z" fill="#5388AA"></path></g>')
        .select('.centerme')
        .on('click', () => {
          this.centerCompass();
        });

      // tooltip start

      // Define the div for the tooltip
      const tooltipdiv = d3.select('#visualisation').append('div')
        .attr('class', 'kompastooltip');

      // tooltip end

      this.partyAcronyms.forEach((group) => {
        svg.select(`#kompasgroup${group[0].person.party.acronym.replace(/[ +,]/g, '_')}`)
          .classed('partygroup', true)
          .selectAll('.dot')
          .data(group)
          .enter()
          .append('circle')
          .classed('dot', true)
          .attr('id', d => `_${d.person.id}`)
          .attr('r', 3)
          .attr('transform', d => `translate(${this.x(d.score.vT1)},${this.y(d.score.vT2)})`)
          .classed(`${group[0].person.party.acronym.replace(/[ +,]/g, '_').toLowerCase()}-fill`, true)
          .classed(`${group[0].person.party.acronym.replace(/[ +,]/g, '_').toLowerCase()}-stroke`, true)
          // .style('stroke', function(
          .on('click', (d) => {
            this.selectCallback(d.person.id);
          })
          .on('mouseover', (d) => { // setup tooltip
            console.log(this.$el.getBoundingClientRect());

            tooltipdiv.transition()
              .duration(200)
              .style('opacity', 0.9);
            tooltipdiv.html(d.person.name)
              .style('left', (`${d3.event.pageX - (tooltipdiv.node().getBoundingClientRect().width / 2) - this.$el.getBoundingClientRect().left - 15}px`))
              .style('top', `${d3.event.pageY - this.$el.getBoundingClientRect().top - 50}px`);
          })
          .on('mouseout', (d) => {
            tooltipdiv.transition()
              .duration(200)
              .style('opacity', 0);
          });
      });

      this.$nextTick(() => this.centerCompass());
    },

    backChangeCallback(newback) {
      if (!newback) {
        this.$nextTick(() => {
          this.drawCompass();
        });
      }
    },
  },
};
</script>

<style lang="scss">
#kompas {
  width: 100%;
  position: relative;
}

.kompastooltip {
  position: absolute;
  text-align: center;
  border: 0px;
  pointer-events: none;
  background-color: #525252;
  border-radius: 3px;
  padding: 2px 10px;
  opacity: 0;

  color: #ffffff;
}

rect {
  fill: transparent;
  shape-rendering: crispEdges;
}
</style>

<style lang="scss" scoped>
.search-dropdown {
  max-width: 400px;
}
</style>
