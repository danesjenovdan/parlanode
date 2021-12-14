<template>
  <div ref="chart" class="pie-chart"></div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'PieChart',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    data() {
      this.$nextTick(this.renderChart);
    },
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      // empty the chart container
      this.$refs.chart.textContent = '';

      const sortedData = this.data
        .slice()
        .filter((d) => d.value > 0)
        .sort((a, b) => b.value - a.value);

      const pie = d3
        .pie()
        .sort(null)
        .value((data) => data.value);

      const pieArcs = pie(sortedData);

      const width = 435;
      const height = 520;

      const svgGroup = d3
        .select(this.$refs.chart)
        .append('svg')
        .attr('viewBox', [0, 0, width, height])
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

      const radius = Math.min(width, height) / 2;
      const radiusScale = 0.7;
      const outerRadiusScale = 0.9;

      const arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(radius * radiusScale);

      const edgeArc = d3
        .arc()
        .innerRadius(radius * radiusScale + 4)
        .outerRadius(radius * radiusScale + 4);

      const outerArc = d3
        .arc()
        .innerRadius(radius * outerRadiusScale)
        .outerRadius(radius * outerRadiusScale);

      function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
      }

      function isBottom(d) {
        const a = midAngle(d) - Math.PI / 2;
        return a > 0 && a < Math.PI;
      }

      const segmentHover = (elem) =>
        elem
          .on('mouseover', (e, d) => {
            svgGroup
              .selectAll(
                '.pie-segments path, .pie-lines polyline, .pie-labels text'
              )
              .interrupt()
              .transition()
              .duration(0)
              .style('opacity', 0.33);
            svgGroup
              .selectAll(`[data-group="${d.data.group.slug}"]`)
              .interrupt()
              .transition()
              .duration(0)
              .style('opacity', 1);
          })
          .on('mouseout', () => {
            svgGroup
              .selectAll(
                '.pie-segments path, .pie-lines polyline, .pie-labels text'
              )
              .transition()
              .delay(250)
              .duration(0)
              .style('opacity', 1);
          });

      svgGroup
        .append('g')
        .attr('class', 'pie-segments')
        .attr('stroke', 'white')
        .selectAll('path')
        .data(pieArcs)
        .join('path')
        .attr('data-group', (d) => d.data.group.slug)
        .attr('d', arc)
        .attr('fill', (d) => d.data.group.color) // TODO this is probably too dependent on there being groups in data
        .call(segmentHover);

      svgGroup
        .append('g')
        .attr('class', 'pie-labels')
        .selectAll('text')
        .data(pieArcs)
        .join('text')
        .attr('data-group', (d) => d.data.group.slug)
        .text((d) => d.data.group.name)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', (d) => (isBottom(d) ? 'auto' : 'hanging'))
        .attr('fill', '#000')
        .attr('x', (d, i, a) => {
          let x = outerArc.centroid(d)[0];
          const w = a[i].getComputedTextLength();
          if (x + w / 2 > width / 2) {
            x = width / 2 - w / 2;
          } else if (x - w / 2 < -(width / 2)) {
            x = -(width / 2) + w / 2;
          }
          return x;
        })
        .attr('y', (d) => {
          const dir = isBottom(d) ? 1 : -1;
          const pos = radius * radiusScale * dir + 2 * dir * 20;
          return pos;
        })
        .style('cursor', 'default')
        .call(segmentHover);

      function overlap(node1, node2) {
        if (node1 === node2) {
          return false;
        }

        const bbox1 = node1.getBBox();
        const bbox2 = node2.getBBox();

        const left1 = bbox1.x - 5;
        const top1 = bbox1.y;
        const right1 = bbox1.x + bbox1.width + 5;
        const bottom1 = bbox1.y + bbox1.height;

        const left2 = bbox2.x - 5;
        const top2 = bbox2.y;
        const right2 = bbox2.x + bbox2.width + 5;
        const bottom2 = bbox2.y + bbox2.height;

        if (left1 > right2 || left2 > right1) {
          return false;
        }

        if (top1 > bottom2 || top2 > bottom1) {
          return false;
        }

        return true;
      }

      function overlapAny(node, nodes) {
        return Array.from(nodes).some((n) => overlap(n, node));
      }

      svgGroup.selectAll('.pie-labels text').each((d, i, nodes) => {
        const node = nodes[i];
        while (overlapAny(node, nodes)) {
          const dir = node.getBBox().y < 0 ? -1 : 1;
          node.setAttribute('y', +node.getAttribute('y') + dir * 20);
        }
      });

      svgGroup
        .append('g')
        .attr('class', 'pie-lines')
        .selectAll('polyline')
        .data(pieArcs)
        .join('polyline')
        .attr('data-group', (d) => d.data.group.slug)
        .attr('stroke', '#888')
        .attr('fill', 'none')
        .attr('points', (d) => {
          const labelBBox = svgGroup
            .select(`text[data-group="${d.data.group.slug}"]`)
            .node()
            .getBBox();

          const edgePoint = edgeArc.centroid(d);
          const outerPoint = outerArc.centroid(d);

          const labelPoint = isBottom(d)
            ? [outerPoint[0], labelBBox.y - 4]
            : [outerPoint[0], labelBBox.y + 20];

          if (
            Math.hypot(
              edgePoint[0] - outerPoint[0],
              edgePoint[1] - outerPoint[1]
            ) >
            Math.hypot(
              edgePoint[0] - labelPoint[0],
              edgePoint[1] - labelPoint[1]
            )
          ) {
            return [edgePoint, labelPoint];
          }

          return [edgePoint, outerPoint, labelPoint];
        });

      const svgGroupBBox = svgGroup.node().getBBox();
      const translateY = -svgGroupBBox.y + (height - svgGroupBBox.height) / 2;
      svgGroup.attr('transform', `translate(${width / 2},${translateY})`);
    },
  },
};
</script>
