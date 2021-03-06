<template>
  <card-wrapper
    :id="$root.$options.cardData.mountId"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
    content-class="full"
    @backChange="handleBackChange"
  >
    <slot slot="info" name="info"></slot>
    <div class="prisotnost-chart"></div>
  </card-wrapper>
</template>

<script>
import d3 from 'd3v3';
import CardWrapper from 'components/Card/Wrapper.vue';
import { memberHeader, partyHeader } from 'mixins/altHeaders';
import { memberOgImage, partyOgImage } from 'mixins/ogImages';
import getD3Locale from 'i18n/d3locales';


export default {
  name: 'PrisotnostChart',
  components: {
    CardWrapper,
  },
  props: {
    cardData: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: value => ['person', 'party'].indexOf(value) > -1,
    },
    results: {
      type: Array,
      required: true,
    },
    person: {
      type: Object,
      default: () => ({}),
    },
    party: {
      type: Object,
      default: () => ({}),
    },
    generatedCardUrl: {
      type: String,
      default: '',
    },
  },
  computed: {
    headerConfig() {
      if (this.type === 'person') {
        return memberHeader.computed.headerConfig.call(this);
      }
      return partyHeader.computed.headerConfig.call(this);
    },
    ogConfig() {
      if (this.type === 'person') {
        return memberOgImage.computed.ogConfig.call(this);
      }
      return partyOgImage.computed.ogConfig.call(this);
    },
  },
  mounted() {
    this.renderChart();
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
      const width = 940 - prisotnostMargin.left - prisotnostMargin.right;
      const height = 460 - prisotnostMargin.top - prisotnostMargin.bottom;

      const locale = d3.locale(getD3Locale(process.env.CARD_LANG));

      const parseDate = d3.time.format('%Y-%m-%dT%H:%M:%S').parse;

      // preparing data for d3 consumption
      const manipulatedData = data.map(d => ({
        date: parseDate(d.date_ts),
        presence: +d.presence,
        notMember: +d.not_member || 0,
      }));

      // preparing data for d3 stack consumption
      const presentData = data.map(d => ({
        x: parseDate(d.date_ts),
        y: +d.presence || 0,
      }));
      const notMemberData = data.map(d => ({
        x: parseDate(d.date_ts),
        y: +d.not_member || 0,
      }));
      const notPresentData = data.map(d => ({
        x: parseDate(d.date_ts),
        y: 100 - (d.not_member || 0) - d.presence,
      }));
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
        .attr('viewBox', '0 0 940 470')
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .append('g')
        .attr('transform', `translate(${prisotnostMargin.left},${prisotnostMargin.top})`);

      this.renderBarChart(width, height, locale, svg, layers, manipulatedData);
    },

    renderBarChart(width, height, locale, svg, layers, data) {
      const x = d3.scale.ordinal().rangeRoundBands([0, width]);

      const y = d3.scale.linear()
        .range([height, 0]);

      // barchart domains
      x.domain(data.map(d => d.date));
      y.domain([0, 100]);

      const xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .tickFormat(locale.timeFormat('%b %y'));

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
            .text(locale.timeFormat('%B %Y')(d3.select(bars[0][0]).datum().x))
            .style('fill', '#fff')
            .attr('text-anchor', 'start')
            .attr('x', -70)
            .attr('y', -18);

          let tooltiptop = 10;

          if (Math.round(d3.select(bars[0][0]).datum().y) > 0) {
            let prisoten;
            if (this.type === 'person') {
              prisoten = this.$t(`present--${this.person.gender}`);
            } else {
              prisoten = this.$t('present--plural');
            }
            focus.append('text')
              .text(`${prisoten} | ${Math.round(d3.select(bars[0][0]).datum().y)} %`)
              .style('fill', '#fff')
              .attr('text-anchor', 'start')
              .attr('x', -70)
              .attr('y', tooltiptop);

            tooltiptop += 18;
          }
          if (Math.round(d3.select(bars[0][1]).datum().y - 0.0000000001) > 0) {
            let odsoten;
            if (this.type === 'person') {
              odsoten = this.$t(`absent--${this.person.gender}`);
            } else {
              odsoten = this.$t('absent--plural');
            }
            focus.append('text')
              .text(`${odsoten} | ${Math.round(d3.select(bars[0][1]).datum().y - 0.0000000001)} %`) // odštevamo zaradi case-a 20.5 + 79.5
              .style('fill', '#fff')
              .attr('text-anchor', 'start')
              .attr('x', -70)
              .attr('y', tooltiptop);

            tooltiptop += 18;
          }
          if (Math.round(d3.select(bars[0][2]).datum().y) > 0) {
            focus.append('text')
              .text(`${this.$t('no-term')} | ${Math.round(d3.select(bars[0][2]).datum().y)} %`)
              .style('fill', '#fff')
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
        .style('fill', '#fff');
    },
  },
};
</script>

<style lang="scss">
@import '~parlassets/scss/breakpoints';
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
        stroke: $font-placeholder;
}
.tick text {
    font-size: 10px;
}
.prisotnost-chart {
    overflow-x: auto;
    height: 100%;

    @include respond-to(desktop) {
      display: flex;
    }
}
.prisotnostchart {
    min-width: 870px;
    min-height: 435px;
    // padding-bottom: 10px;
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
    stroke: $second;
}
.prisotnost-chart .dot {
    fill: $second;
}

.focus rect {
    border: 0px;
    background-color: $font-placeholder;
    border-radius: 3px;
    padding: 2px 10px;

    color: $white;
}

.focus circle {
    fill: $second;
}

.tabs-header:hover { text-decoration: none; }


.presencething-present rect {
    fill: $time-presence-present-passive;
    stroke: $white;
    stroke-width: 1;

    &.hovered {
        fill: $time-presence-present-active;
    }
}
.presencething-notPresent rect {
    fill: $time-presence-absent-passive;
    stroke: $white;
    stroke-width: 1;

    &.hovered {
        fill: $time-presence-absent-active;
    }
}
.presencething-notMember rect {
    fill: $time-presence-no-term-passive;
    stroke: $white;
    stroke-width: 1;

    &.hovered {
        fill: $time-presence-no-term-active;
    }
}
</style>
