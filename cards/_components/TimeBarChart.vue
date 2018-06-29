<template>
  <div class="timebarchart"></div>
</template>

<script>
/* global d3 */
function chart(rawData) {
  $('.timebarchart svg').remove();

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

  const smalldata = [];
  const dateFormatter = d3.time.format('%Y-%m-%dT%H:%M:%SZ');

  // create small data
  for (let i = 0; i < rawData.counts.length; i += 1) {
    if (i % 2 === 0 && i > rawData.counts.length - 25) {
      smalldata.push({
        date: rawData.counts[i],
        occurences: rawData.counts[i + 1],
      });
    }
  }

  smalldata.sort((x, y) => dateFormatter.parse(x.date) - dateFormatter.parse(y.date));

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
  smalldata.forEach((d) => {
    d.date = parseDate(d.date);
    d.occurences = +d.occurences;
  });

  const svg = d3.select('.timebarchart').append('svg')
    .attr('class', 'smalldata')
    .attr('viewBox', '0 0 960 400')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  function createSmallChart(data) {
    svg.selectAll('.dot').remove();
    svg.selectAll('.smalldata g path').remove();
    svg.selectAll('.axis').remove();
    svg.on('mousemove', null);

    const x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);

    const y = d3.scale.linear()
      .range([height, 0]);

    x.domain(data.map(d => d.date));
    y.domain([0, d3.max(data, d => d.occurences)]);

    const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickFormat(SI.timeFormat('%b %y'));

    svg.append('g')
      .attr('class', 'x axis smalldata')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    const barcontainers = svg.selectAll('.smallbarcontainer')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'smallbarcontainer');

    barcontainers.append('text')
      .text(d => d.occurences)
      .attr('x', d => x(d.date))
      .attr('y', d => y(d.occurences))
      .attr('width', x.rangeBand)
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${x.rangeBand() / 2}, -4)`);

    barcontainers.append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.date))
      .attr('width', x.rangeBand())
      .attr('y', d => y(d.occurences))
      .attr('height', d => height - y(d.occurences));
  }

  createSmallChart(smalldata);
}

export default {
  name: 'TimeBarChart',
  props: {
    data: Object,
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
      chart(this.data);
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

.bar {
  fill: #ccebf8;
}

.smallbarcontainer text {
  fill: #009cdd;
  font-weight: 300;
  transition: all 0.2s ease-out;
}

.smallbarcontainer:hover {
  .bar {
    fill: #009cdd;
  }

  text {
    font-size: 1.2em;
  }
}
</style>
