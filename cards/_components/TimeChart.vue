<template>
  <div @click="renderChart" class="timechart"></div>
</template>

<script>
import getD3Locale from 'i18n/d3locales';

/* global d3 */
export default {
  name: 'TimeChart',
  props: {
    data: Array,
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

      // const parseDate = d3.time.format('%Y-%m-%dT%H:%M:%SZ').parse;
      const bisectDate = d3.bisector(d => d.date).left;
      const parseDate = d3.time.format('%d.%m.%Y').parse;

      const data = this.data.reduce((acc, d) => {
        if (acc.indexOf(d.results.date) === -1) {
          // console.log(d.results.date);
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


      // svg.selectAll('.smallbarcontainer').remove();
      // svg.selectAll('.axis').remove();

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
        // .on('click', mouseclick);

      const x = d3.time.scale()
        .range([0, width]);

      const y = d3.scale.linear()
        .range([height, 0]);

      // x.domain(data.map(function(d) { return d.date; }));
      x.domain(d3.extent(data, d => d.date));
      y.domain([0, d3.max(data, d => d.occurences)]);
      // y.domain(d3.extent(data, function(d) {
      //     return d.close;
      // }));

      const xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        // .tickValues(x.domain().filter(function(d, i) { return !(i % 5); }))
        .tickFormat(locale.timeFormat('%b %y'));

      const yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

      svg.append('g')
        .attr('class', 'x axis bigdata')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

      const line = d3.svg.line()
        .x(d => x(d.date))
        .y(d => y(d.occurences));

      // data.forEach(function(d) {
      //     console.log(d);
      //     console.log(d.date);
      //     d.date = parseDate(d.date);
      //     console.log(d.date);
      //     d.close = +d.close;
      // });

      // console.log(line);
      svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', line);

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
            focus.attr('transform', `translate(${  x(d.date)  },${  y(d.occurences)  })`);
          } else if (i < 3) {
            focus.attr('transform', `translate(${  x(data[2].date)  },${  y(d.occurences)  })`);
          } else {
            focus.attr('transform', `translate(${  x(data[data.length - 4].date)  },${  y(d.occurences)  })`);
          }

          focus.select('text').text(`${locale.timeFormat('%x')(d.date)} | ${d.occurences}`);
        }
      }

      function mouseclick() {
        const x0 = x.invert(d3.mouse(this)[0] - margin.left);
        const i = bisectDate(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        if (i < data.length) {
          const d = x0 - d0.date > d1.date - x0 ? d1 : d0;

          const circle = x0 - d0.date > d1.date - x0 ? d3.selectAll('.dot circle')[0][i] : d3.selectAll('.dot circle')[0][i - 1];

          // if (d3.select(circle).classed('hovered')) {

          // } else {
          //   d3.select('.dot circle.hovered')
          //     .classed('hovered', false)
          //     .transition()
          //     .duration(200)
          //     .attr('r', 4);

          //   d3.select(circle)
          //     .classed('hovered', true)
          //     .transition()
          //     .duration(200)
          //     .ease('linear')
          //     .attr('r', 7);
          // }

          // if (i > 2 && i < data.length - 3.5) {
          //   focus.attr('transform', 'translate(' + x(d.date) + ',' + y(d.occurences) + ')');
          // } else if (i < 3) {
          //   focus.attr('transform', 'translate(' + x(data[2].date) + ',' + y(d.occurences) + ')');
          // } else {
          //   focus.attr('transform', 'translate(' + x(data[data.length - 4].date) + ',' + y(d.occurences) + ')');
          // }

          // focus.select('text').text(`${locale.timeFormat('%B %Y')(d.date)  } | ${  d.occurences}`);
          // time_query['time_filter'] = d3.select.cirle.datum();
          var thedate = d3.select(circle).datum().date;
          var filterdate = '1.' + String(thedate.getMonth() + 1) + '.' + String(thedate.getFullYear());
          // console.log(filterdate);
          time_query['time_filter'] = filterdate;
          document.location.href = generateSearchUrl(time_query);
        }
      }

      svg.selectAll('g.dot')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'dot')
        .append('circle')
        .attr('r', 4)
        .attr('cx', d => x(d.date))
        .attr('cy', d => y(d.occurences));

      let focus = svg.append('g')
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
  watch: {
    data() {
      this.renderChart();
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
    /*position: absolute;
    text-align: center;*/
    border: 0px;
    /*pointer-events: none;*/
    background-color: #525252;
    border-radius: 3px;
    padding: 2px 10px;
    /*opacity: 0;*/

    color: #ffffff;
}

.focus circle {
    fill: #009cdd;
}

.tabs-header:hover { text-decoration: none; }


</style>
