<template>
  <div ref="chart" class="time-chart"></div>
</template>

<script>
import * as d3 from 'd3';
import getD3Locale from '@/_i18n/d3locales.js';

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
      // empty the chart container
      this.$refs.chart.textContent = '';

      d3.timeFormatDefaultLocale(getD3Locale(import.meta.env.VITE_CARD_LANG));

      const dateParser = d3.timeParse('%d.%m.%Y');
      const monthFormat = d3.timeFormat('%b %y');
      const dateFormat = d3.timeFormat('%x'); // %x = locale date format

      const data = Array.from(new Set(this.data.map((d) => d.results.date)))
        .map((date) => ({
          date: dateParser(date),
          value: this.data.filter((d) => d.results.date === date).length,
        }))
        .sort((a, b) => a.date - b.date);

      const width = 940;
      const height = 420;
      const margin = { top: 35, right: 10, bottom: 25, left: 10 };

      const svg = d3
        .select(this.$refs.chart)
        .append('svg')
        .attr('viewBox', [0, 0, width, height]);

      const x = d3
        .scaleTime()
        .domain(d3.extent(data.map((d) => d.date)))
        .range([margin.left, width - margin.right]);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .rangeRound([height - margin.bottom, margin.top]);

      // bottom axis
      svg
        .append('g')
        .attr('class', 'axis-bottom')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(monthFormat))
        .call((g) => g.selectAll('.domain').remove());

      const line = d3
        .line()
        .x((d) => x(d.date))
        .y((d) => y(d.value));

      // line
      svg
        .append('g')
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('stroke-width', 2)
        .attr('d', line);

      const bisectDate = d3.bisector((d) => d.date).left;

      let dots;
      let tooltip;
      let tooltipLine;
      let lastTooltipDatum = null;
      let lastTooltipWidth = 0;

      const tooltipHover = (elem) => {
        elem
          .on('mousemove', (e) => {
            const [pointerX, pointerY] = d3.pointer(e, elem.node());
            const hoveredDate = x.invert(pointerX);
            const i = bisectDate(data, hoveredDate);
            if (i >= data.length) {
              return;
            }

            // work out which date value is closest
            const [index, d, lineX] = (() => {
              const d1 = data[i];
              const lineX1 = x(d1.date);
              if (i === 0) {
                return [i, d1, lineX1];
              }
              const d0 = data[i - 1];
              const lineX0 = x(d0.date);
              if (Math.abs(pointerX - lineX0) < Math.abs(pointerX - lineX1)) {
                return [i - 1, d0, lineX0];
              }
              return [i, d1, lineX1];
            })();

            if (lastTooltipDatum !== d) {
              lastTooltipDatum = d;

              const bbox = tooltip
                .select('text')
                .text(`${dateFormat(d.date)} | ${d.value}`)
                .node()
                .getBBox();

              const padX = 8;
              const padY = 4;

              lastTooltipWidth = tooltip
                .select('rect')
                .attr('x', bbox.x - padX)
                .attr('y', bbox.y - padY * 1.25)
                .attr('width', bbox.width + padX * 2)
                .attr('height', bbox.height + padY * 2)
                .node()
                .getBBox().width;

              tooltipLine.attr('x1', lineX).attr('x2', lineX);

              dots
                .attr('r', (d_, idx) => (idx === index ? 4 : 2))
                .classed('hovered', (d_, idx) => idx === index);
            }

            const xPos = Math.max(
              0 + lastTooltipWidth / 2,
              Math.min(x(lastTooltipDatum.date), width - lastTooltipWidth / 2)
            );
            const yPos = Math.max(
              margin.top,
              Math.min(height - margin.bottom, pointerY)
            );

            tooltip.attr('transform', `translate(${xPos},${yPos - 15})`);
          })
          .on('mouseover', () => {
            tooltip
              .interrupt()
              .transition()
              .duration(150)
              .style('opacity', 1)
              .style('display', null);
            tooltipLine.style('display', null);
          })
          .on('mouseout', () => {
            tooltip
              .transition()
              .duration(150)
              .style('opacity', 0)
              .transition()
              .style('display', 'none');
            tooltipLine.style('display', 'none');
            dots.attr('r', 2).classed('hovered', false);
            lastTooltipDatum = null;
          });
      };

      tooltipLine = svg
        .append('line')
        .attr('x1', -100)
        .attr('x2', -100)
        .attr('y1', margin.top - 20)
        .attr('y2', height - margin.bottom)
        .style('stroke-width', 1)
        .style('stroke', '#888')
        .style('stroke-dasharray', '4 4')
        .style('fill', 'none');

      // dots
      dots = svg
        .append('g')
        .selectAll('.dot')
        .data(data)
        .join('circle')
        .attr('class', 'dot')
        .attr('r', 2)
        .attr('cx', (d) => x(d.date))
        .attr('cy', (d) => y(d.value));

      tooltip = svg
        .append('g')
        .attr('class', 'time-tooltip')
        .style('pointer-events', 'none')
        .style('user-select', 'none')
        .style('display', 'none');

      tooltip.append('rect').attr('fill', '#000').attr('rx', 3);
      tooltip
        .append('text')
        .attr('fill', '#fff')
        .attr('font-size', 14)
        .attr('text-anchor', 'middle');

      svg.call(tooltipHover);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/colors';

.time-chart :deep(svg) {
  path {
    stroke: $time-chart-passive;
  }

  .dot {
    fill: $time-chart-passive;

    &.hovered {
      fill: $time-chart-active;
    }
  }
}
</style>
