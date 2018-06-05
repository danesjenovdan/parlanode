<template>
  <div class="timelinechart"></div>
</template>

<script>
/* global d3 */
function chart(rawData) {
  $('.timelinechart svg').remove();

  function getQueryParams(str) {
    return (str || document.location.search).replace(/(^\?)/, '').split('&').map(function m(n) {
      n = n.split('=');
      this[n[0]] = n[1];
      return this;
    }.bind({}))[0];
  }

  let timeQuery;
  if (typeof query !== 'undefined') {
    // eslint-disable-next-line no-undef
    timeQuery = query;
  } else if (typeof customUrl !== 'undefined') {
    // eslint-disable-next-line no-undef
    timeQuery = getQueryParams(customUrl.split('?')[1]);
    // eslint-disable-next-line no-undef
    timeQuery.q = customUrl.split('/').pop().split('?')[0];
  } else {
    timeQuery = { q: document.location.href.split('?q=')[1] };
  }

  function generateSearchUrl(queryParams) {
    let searchurl = `https://parlameter.si/seje/isci/filter/?q=${timeQuery.q}`;
    if (queryParams.people && queryParams.people.length > 0) {
      if (!searchurl.endsWith('?')) {
        searchurl = `${searchurl}&people=${queryParams.people}`;
      } else {
        searchurl = `${searchurl}people=${queryParams.people}`;
      }
    }
    if (queryParams.parties && queryParams.parties.length > 0) {
      if (!searchurl.endsWith('?')) {
        searchurl = `${searchurl}&parties=${queryParams.parties}`;
      } else {
        searchurl = `${searchurl}parties=${queryParams.parties}`;
      }
    }
    if (queryParams.time_filter && queryParams.time_filter.length > 0) {
      if (!searchurl.endsWith('?')) {
        searchurl = `${searchurl}&time_filter=${queryParams.time_filter}`;
      } else {
        searchurl = `${searchurl}time_filter=${queryParams.time_filter}`;
      }
    }
    if (queryParams.wb && queryParams.wb.length > 0) {
      if (!searchurl.endsWith('?')) {
        searchurl = `${searchurl}&wb=${queryParams.wb}`;
      } else {
        searchurl = `${searchurl}wb=${queryParams.wb}`;
      }
    }
    if (queryParams.dz) {
      if (!searchurl.endsWith('?')) {
        searchurl = `${searchurl}&dz=${queryParams.dz}`;
      } else {
        searchurl = `${searchurl}dz=${queryParams.dz}`;
      }
    }
    if (queryParams.council) {
      if (!searchurl.endsWith('?')) {
        searchurl = `${searchurl}&council=${queryParams.council}`;
      } else {
        searchurl = `${searchurl}council=${queryParams.council}`;
      }
    }
    return searchurl;
  }

  const bigdata = [];
  const dateFormatter = d3.time.format('%Y-%m-%dT%H:%M:%SZ');

  // create big data
  const bigDates = [];
  const bigOccurences = [];
  for (let i = 0; i < rawData.counts.length; i += 1) {
    if (i % 2 === 0) {
      bigDates.push(dateFormatter.parse(rawData.counts[i]));
      bigOccurences.push(rawData.counts[i + 1]);
      bigdata.push({
        date: rawData.counts[i],
        occurences: rawData.counts[i + 1],
      });
    }
  }

  bigdata.sort((x, y) => dateFormatter.parse(x.date) - dateFormatter.parse(y.date));

  // global stuff for the chart
  const margin = {
    top: 50,
    right: 30,
    bottom: 30,
    left: 30,
  };
  const width = 960 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

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

  const parseDate = d3.time.format('%Y-%m-%dT%H:%M:%SZ').parse;
  const bisectDate = d3.bisector(d => d.date).left;
  bigdata.forEach((d) => {
    d.date = parseDate(d.date);
    d.occurences = +d.occurences;
  });

  const svg = d3.select('.timelinechart').append('svg')
    .attr('class', 'smalldata')
    .attr('viewBox', '0 0 960 400')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  let focus;

  function createLineChart(data) {
    svg.selectAll('.smallbarcontainer').remove();
    svg.selectAll('.axis').remove();

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
          // noop
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

        focus.select('text').text(`${SI.timeFormat('%B %Y')(d.date)} | ${d.occurences}`);
      }
    }

    function mouseclick() {
      const x0 = x.invert(d3.mouse(this)[0] - margin.left);
      const i = bisectDate(data, x0, 1);
      const d0 = data[i - 1];
      const d1 = data[i];
      if (i < data.length) {
        const circle = x0 - d0.date > d1.date - x0 ? d3.selectAll('.dot circle')[0][i] : d3.selectAll('.dot circle')[0][i - 1];
        const thedate = d3.select(circle).datum().date;
        const filterdate = `1.${thedate.getMonth() + 1}.${thedate.getFullYear()}`;
        timeQuery.time_filter = filterdate;
        document.location.href = generateSearchUrl(timeQuery);
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
      .on('mousemove', mousemove)
      .on('click', mouseclick);

    const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickFormat(SI.timeFormat('%b %y'));

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
  }

  createLineChart(bigdata);
}

export default {
  name: 'TimeLineChart',
  props: {
    data: Object,
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      chart(this.data);
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
</style>
