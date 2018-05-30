<template>
  <div class="partychart2"></div>
</template>

<script>
/* global d3, query, customUrl */
function chart(rawData) {
  $('.partychart2 svg').remove();

  function getQueryParams(str) {
    return (str || document.location.search).replace(/(^\?)/, '').split('&').map(function m(n) {
      n = n.split('=');
      this[n[0]] = n[1];
      return this;
    }.bind({}))[0];
  }

  let pgQuery;
  if (typeof query !== 'undefined') {
    pgQuery = query;
  } else if (typeof customUrl !== 'undefined') {
    pgQuery = getQueryParams(customUrl.split('?')[1]);
    pgQuery.q = customUrl.split('/').pop().split('?')[0];
  } else {
    pgQuery = {
      q: document.location.href.split('?q=')[1],
    };
  }

  $.getJSON('https://data.parlameter.si/v1/getAllPGsExt/', (response) => {
    const parties = response;

    let sum = 0;
    rawData.forEach((d, i) => {
      if (i % 2 === 1) {
        sum += d;
      }
    });

    const data = [];

    let firstpiece;
    let secondpiece;
    rawData.forEach((d, i) => {
      if (i % 2 === 0) {
        firstpiece = d;
      } else {
        secondpiece = d;
        data.push({
          party: firstpiece,
          occurences: secondpiece,
          percentage: Number.isNaN(secondpiece / sum) ? 0 : Math.round((secondpiece / sum) * 100),
        });
      }
    });

    const margin = {
      top: 60,
      right: 60,
      bottom: 60,
      left: 60,
    };
    const width = 400 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    const color = d3.scale.ordinal()
      .range([
        '#8FCFEE',
        '#4FB5E6',
        '#AA7375',
        '#534961',
        '#4F6379',
        '#5388AA',
        '#D9776B',
        '#BA594C',
      ]);

    const arc = d3.svg.arc()
      .outerRadius(radius - 30)
      .innerRadius(0);

    const pie = d3.layout.pie()
      .sort(null)
      .value(d => d.occurences);

    const svg = d3.select('.partychart2').append('svg')
      .attr('viewBox', '0 0 400 450')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${(width / 2) + margin.left},${(height / 2) + margin.top})`);

    const piedata = pie(data.filter(d => parties[d.party]));

    const g = svg.selectAll('.arc')
      .data(piedata)
      .enter()
      .append('g')
      .attr('class', 'arc');

    g.append('path')
      .attr('d', arc)
      .style('fill', d => color(d.data.party));

    const labels = svg.selectAll('text').data(piedata)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('x', (d) => {
        const a = (d.startAngle + ((d.endAngle - d.startAngle) / 2)) - (Math.PI / 2);
        d.cx = Math.cos(a) * (radius - 75);
        d.x = Math.cos(a) * (radius + 20);
        return d.x;
      })
      .attr('y', (d) => {
        const a = (d.startAngle + ((d.endAngle - d.startAngle) / 2)) - (Math.PI / 2);
        d.cy = Math.sin(a) * (radius - 75);
        d.y = Math.sin(a) * (radius + 20);
        return d.y;
      })
      .text(d => `${parties[d.data.party].acronym}`)
      .style('display', (d) => {
        if (+d.data.percentage === 0) {
          return 'none';
        }
        return 'block';
      })
      .classed('partylabel', true);

    const alpha = 0.5;
    const spacingY = 20;
    const spacingX = 20;

    function relax() {
      let again = false;
      labels.each(function e() {
        const a = this;
        const da = d3.select(a);
        const y1 = da.attr('y');
        const x1 = da.attr('x');

        labels.each(function e2() {
          const b = this;
          if (a === b) {
            return;
          }
          const db = d3.select(b);
          const y2 = db.attr('y');
          const x2 = db.attr('x');

          const deltaY = y1 - y2;
          const deltaX = x1 - x2;

          // handle Y spacing
          if (Math.abs(deltaY) > spacingY) {
            return;
          }
          // if we didn't break until now, labels are overlapping
          again = true;
          let sign = deltaY > 0 ? 1 : -1;
          let adjust = sign * alpha;
          da.attr('y', +y1 + adjust);
          db.attr('y', +y2 - adjust);

          // handle X spacing
          if (Math.abs(deltaX) > spacingX) {
            return;
          }
          // if we didn't break until now, labels are overlapping
          again = true;
          sign = deltaX > 0 ? 1 : -1;
          adjust = sign * alpha;
          da.attr('x', +x1 + adjust);
          db.attr('x', +x2 - adjust);
        });
      });

      if (again) {
        setTimeout(relax, 20);
      }
    }

    relax();
  });
}

export default {
  name: 'PieChart',
  props: {
    data: Array,
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
.partychart2 {
  height: 100%;
}
</style>
