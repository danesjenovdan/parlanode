<template>
  <card-wrapper
    :id="$root.$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    @backChange="handleBackChange"
  >
    <slot name="info" slot="info"></slot>
    <div class="prisotnost-chart"></div>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { memberOverview } from 'mixins/contextUrls';
import { memberTitle } from 'mixins/titles';

/* globals d3 */
export default {
  name: 'ScoreAvgMax',

  mixins: [common, memberOverview, memberTitle],

  props: {
    cardData: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: value => ['poslanec', 'party'].indexOf(value) > -1,
    },
    results: {
      type: Array,
      required: true,
    },
    person: Object,
    party: Object,
    generatedCardUrl: String,
  },

  computed: {
    headerConfig() {
      let specifics;
      if (this.type === 'poslanec') {
        specifics = {
          heading: this.person.name,
          subheading: `${this.person.party.acronym} | ${this.person.party.is_coalition ? 'koalicija' : 'opozicija'}`,
          circleImage: this.person.gov_id,
        };
      } else {
        specifics = {
          heading: this.party.name,
          subheading: `${this.party.acronym} | ${this.party.is_coalition ? 'koalicija' : 'opozicija'}`,
          circleText: this.party.acronym,
          circleClass: `${this.party.acronym.replace(/ /g, '_').toLowerCase()}-background`,
        };
      }

      return Object.assign({}, specifics, {
        alternative: JSON.parse(this.cardData.cardData.altHeader || 'false'),
        title: this.cardData.cardData.name,
      });
    },

    cardGroup: () => this.cardData.cardData.group,

    cardMethod: () => this.cardData.cardData.method,
  },

  methods: {
    handleBackChange(newBack) {
      if (newBack === null) {
        this.$nextTick(this.renderChart);
      }
    },
    renderChart() {
      const data = this.results;
      const dateFormatter = d3.time.format('%Y-%m-%dT%H:%M:%S');
      data.sort((x, y) => dateFormatter.parse(x.date_ts) - dateFormatter.parse(y.date_ts));

      // global stuff for the chart
      const prisotnostMargin = {
        top: 10,
        right: 0,
        bottom: 0,
        left: 40,
      };
      const width = 960 - prisotnostMargin.left - prisotnostMargin.right;
      const height = 400 - prisotnostMargin.top - prisotnostMargin.bottom;

      const SI = d3.locale({
        decimal: ',',
        thousands: ' ',
        grouping: [3],
        currency: ['EUR', ''],
        dateTime: '%d. %m. %Y %H:%M',
        date: '%d. %m. %Y',
        time: '%H:%M:%S',
        periods: ['AM', 'PM'],
        days: ['nedelja', 'ponedeljek', 'torek', 'sreda', 'četrtek', 'petek', 'sobota'],
        shortDays: ['ned', 'pon', 'tor', 'sre', 'čet', 'pet', 'sob'],
        months: ['januar', 'februar', 'marec', 'april', 'maj', 'junij', 'julij', 'avgust', 'september', 'oktober', 'november', 'december'],
        shortMonths: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'],
      });

      const parseDate = d3.time.format('%Y-%m-%dT%H:%M:%S').parse;

      // preparing data for d3 consumption
      const manipulatedData = data.map((d) => {
        return {
          date: parseDate(d.date_ts),
          presence: +d.presence,
          notMember: +d.not_member,
        };
      });

      // preparing data for d3 stack consumption
      const presentData = data.map((d) => {
        return {
          x: parseDate(d.date_ts),
          y: +d.presence,
        };
      });
      const notMemberData = data.map((d) => {
        return {
          x: parseDate(d.date_ts),
          y: +d.not_member,
        };
      });
      const notPresentData = data.map((d) => {
        return {
          x: parseDate(d.date_ts),
          y: 100 - d.not_member - d.presence,
        };
      });
      const layers = [{
        name: 'present',
        values: presentData,
      }, {
        name: 'notPresent',
        values: notPresentData,
      }, {
        name: 'notMember',
        values: notMemberData,
      }];

      const svg = d3.select('.prisotnost-chart').append('svg')
        .attr('class', 'prisotnostchart')
        .attr('viewBox', '0 0 960 400')
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .append('g')
        .attr('transform', `translate(${prisotnostMargin.left},${prisotnostMargin.top})`);

      this.renderBarChart(width, height, SI, svg, layers, manipulatedData);
    },

    renderBarChart(width, height, SI, svg, layers, data) {
      const x = d3.scale.ordinal().rangeRoundBands([0, width]);

      const y = d3.scale.linear()
        .range([height, 0]);

      // barchart domains
      x.domain(data.map(d => d.date));
      y.domain([0, 100]);

      const xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .tickFormat(SI.timeFormat('%b %y'));

      const yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .tickValues([0, 25, 50, 75, 100])
        .tickFormat(d => `${d} %`)
        .innerTickSize(-(width))
        .outerTickSize(0);

      // create stack
      const stack = d3.layout.stack()
        .values(d => d.values);

      const presencething = svg.selectAll('.presencething')
        .data(stack(layers))
        .enter()
        .append('g')
        .attr('class', d => `presencething-${d.name}`);

      let focus;

      presencething.selectAll('rect')
        .data(d => d.values)
        .enter()
        .append('rect')
        .attr('x', d => x(d.x))
        .attr('y', d => y(d.y + d.y0))
        .attr('data-time', d => d.x)
        .attr('height', d => y(d.y0) - y(d.y + d.y0))
        .attr('width', x.rangeBand())
        .on('mouseover', (d) => {
          const bars = svg.selectAll(`rect[data-time="${d.x}"]`).classed('hovered', true);
          if (x(d.x) < 14) {
            focus.attr('transform', `translate(${x(d.x) + 110},${y(80)})`)
              .style('display', null)
              .selectAll('text')
              .remove();
          } else if (x(d.x) > 748) {
            focus.attr('transform', `translate(${x(d.x) - 70},${y(80)})`)
              .style('display', null)
              .selectAll('text')
              .remove();
          } else {
            focus.attr('transform', `translate(${x(d.x) + 110},${y(80)})`)
              .style('display', null)
              .selectAll('text')
              .remove();
          }

          focus.append('text')
            .text(SI.timeFormat('%B %Y')(d3.select(bars[0][0]).datum().x))
            .style('fill', '#ffffff')
            .attr('text-anchor', 'start')
            .attr('x', -70)
            .attr('y', -18);

          let tooltiptop = 10;

          if (Math.round(d3.select(bars[0][0]).datum().y) > 0) {
            focus.append('text')
              .text(`${this.person.gender === 'm' ? 'Prisoten' : 'Prisotna'} | ${Math.round(d3.select(bars[0][0]).datum().y)} %`)
              .style('fill', '#ffffff')
              .attr('text-anchor', 'start')
              .attr('x', -70)
              .attr('y', tooltiptop);

            tooltiptop += 18;
          }
          if (Math.round(d3.select(bars[0][1]).datum().y - 0.0000000001) > 0) {
            focus.append('text')
              .text(`${this.person.gender === 'm' ? 'Odsoten' : 'Odsotna'} | ${Math.round(d3.select(bars[0][1]).datum().y - 0.0000000001)} %`) // odštevamo zaradi case-a 20.5 + 79.5
              .style('fill', '#ffffff')
              .attr('text-anchor', 'start')
              .attr('x', -70)
              .attr('y', tooltiptop);

            tooltiptop += 18;
          }
          if (Math.round(d3.select(bars[0][2]).datum().y) > 0) {
            focus.append('text')
              .text(`Brez mandata | ${Math.round(d3.select(bars[0][2]).datum().y)} %`)
              .style('fill', '#ffffff')
              .attr('text-anchor', 'start')
              .attr('x', -70)
              .attr('y', tooltiptop);
          }
        })
        .on('mouseleave', (d) => {
          svg.selectAll(`rect[data-time="${d.x}"]`).classed('hovered', false);
          focus.style('display', 'none');
        });

      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

      svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(0,0)')
        .call(yAxis);

      focus = svg.append('g')
        .attr('class', 'focus')
        .style('display', 'none');

      focus.append('rect')
        .attr('width', 140)
        .attr('height', 90)
        .attr('y', -35)
        .attr('x', -75)
        .style('rx', 3)
        .style('yx', 3);

      focus.append('rect')
        .attr('width', 130)
        .attr('height', 1.5)
        .attr('y', -9)
        .attr('x', -70)
        .style('fill', '#ffffff');
    },
  },
  mounted() {
    this.renderChart();
  },
};
</script>

<style lang="scss">
@import '~parlassets/scss/colors';

.axis path,
.axis line {
    fill: none;
    stroke: grey;
    stroke-width: 0.5;
    shape-rendering: crispEdges;
    stroke-dasharray: 2, 2;
}
.tick line {
        stroke-width: 1;
        stroke: $black;
}
.tick text {
    font-size: 10px;
}
.prisotnost-chart {
    overflow-x: auto;
}
.prisotnostchart {
    min-width: 870px;
    padding-bottom: 10px;
}
.prisotnost-chart .domain {
    display: none;
}
.prisotnost-chart .x.axis {
    display: none;
}
.prisotnost-chart .x.axis .tick text {
    opacity: 0;
    transition: all 0.2s ease-in;
}

.prisotnost-chart .line {
    fill: none;
    stroke-width: 2;
    stroke: #009cdd;
}
.prisotnost-chart .dot {
    fill: #009cdd;
}

.focus rect {
    border: 0px;
    background-color: #525252;
    border-radius: 3px;
    padding: 2px 10px;

    color: #ffffff;
}

.focus circle {
    fill: #009cdd;
}

.tabs-header:hover { text-decoration: none; }


.presencething-present rect {
    fill: #bfe4f4;
    stroke: #ffffff;
    stroke-width: 1;

    &.hovered {
        fill: #009cdd;
    }
}
.presencething-notPresent rect {
    fill: #feefec;
    stroke: #ffffff;
    stroke-width: 1;

    &.hovered {
        fill: $red;
    }
}
.presencething-notMember rect {
    fill: #ececec;
    stroke: #ffffff;
    stroke-width: 1;

    &.hovered {
        fill: #a1a1a1;
    }
}
</style>
