<template>
  <div class="timechart" @click="renderChart"></div>
</template>

<script>
import getD3Locale from 'i18n/d3locales';

export default {
  name: 'TimeChart',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    data() {
      this.renderChart();
    },
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      $('.timechart svg').remove();

      // global stuff for the chart
      const margin = {
        top: 50,
        right: 30,
        bottom: 30,
        left: 30,
      };
      const width = 960 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const locale = d3.locale(getD3Locale(process.env.CARD_LANG));

      const bisectDate = d3.bisector(d => d.date).left;
      const parseDate = d3.time.format('%d.%m.%Y').parse;

      const data = this.data.reduce((acc, d) => {
        if (acc.indexOf(d.results.date) === -1) {
          acc.push(d.results.date);
        }
        return acc;
      }, [])
        .map(date => ({
          date: parseDate(date),
          occurences: this.data.filter(d => d.results.date === date).length,
        }))
        .sort((a, b) => a.date - b.date);

      const svg = d3.select('.timechart').append('svg')
        .attr('class', 'smalldata')
        .attr('viewBox', '0 0 960 400')
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      let focus;

      const x = d3.time.scale()
        .range([0, width]);

      const y = d3.scale.linear()
        .range([height, 0]);

      x.domain(d3.extent(data, d => d.date));
      y.domain([0, d3.max(data, d => d.occurences)]);

      function mousemove() {
        const x0 = x.invert(d3.mouse(this)[0] - margin.left);
        const i = bisectDate(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        if (i < data.length) {
          const d = x0 - d0.date > d1.date - x0 ? d1 : d0;

          const circle = x0 - d0.date > d1.date - x0 ? d3.selectAll('.dot circle')[0][i] : d3.selectAll('.dot circle')[0][i - 1];

          if (d3.select(circle).classed('hovered')) {
            //
          } else {
            d3.select('.dot circle.hovered')
              .classed('hovered', false)
              .transition()
              .duration(200)
              .attr('r', 4);

            d3.select(circle)
              .classed('hovered', true)
              .transition()
              .duration(200)
              .ease('linear')
              .attr('r', 7);
          }

          if (i > 2 && i < data.length - 3.5) {
            focus.attr('transform', `translate(${x(d.date)},${y(d.occurences)})`);
          } else if (i < 3) {
            focus.attr('transform', `translate(${x(data[2].date)},${y(d.occurences)})`);
          } else {
            focus.attr('transform', `translate(${x(data[data.length - 4].date)},${y(d.occurences)})`);
          }

          focus.select('text').text(`${locale.timeFormat('%x')(d.date)} | ${d.occurences}`);
        }
      }

      d3.select(svg.node().parentNode).append('rect')
        .attr('class', 'overlay')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('fill', 'transparent')
        .on('mouseover', () => {
          focus.style('display', null);
        })
        .on('mouseout', () => {
          focus.style('display', 'none');
        })
        .on('mousemove', mousemove);

      const xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .tickFormat(locale.timeFormat('%b %y'));

      svg.append('g')
        .attr('class', 'x axis bigdata')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

      const line = d3.svg.line()
        .x(d => x(d.date))
        .y(d => y(d.occurences));

      svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', line);

      svg.selectAll('g.dot')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'dot')
        .append('circle')
        .attr('r', 4)
        .attr('cx', d => x(d.date))
        .attr('cy', d => y(d.occurences));

      focus = svg.append('g')
        .attr('class', 'focus')
        .style('display', 'none');

      focus.append('rect')
        .attr('width', 150)
        .attr('height', 25)
        .attr('y', -35)
        .attr('x', -75)
        .style('rx', 3)
        .style('yx', 3);

      focus.append('text')
        .style('fill', '#ffffff')
        .attr('text-anchor', 'middle')
        .attr('y', -18);
    },
  },
};
</script>

<style lang="scss">
@import '~parlassets/scss/colors';

.axis path,
.axis line {
  fill: none;
  stroke: grey;
  stroke-width: 1;
  shape-rendering: crispEdges;
  stroke-dasharray: 1, 3;
}

.tick line {
  stroke-width: 0;
}

.bigdata .tick text {
  opacity: 0;
  transition: all 0.2s ease-in;
}

.smalldata .line {
  fill: none;
  stroke-width: 2;
  stroke: #009cdd;
}

.smalldata .dot {
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

.tabs-header:hover {
  text-decoration: none;
}
</style>
