<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig">

    <div slot="info">
      <p class="info-text lead"></p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text"></p>
    </div>

    <div id="viz">
      <svg viewBox="0 0 700 700">
      </svg>
    </div>
    <div id="controls"></div>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import adjacencyMatrix from 'helpers/adjacencyMatrix';
// import 'helpers/adjacencyMatrix';

export default {
  components: {},
  mixins: [common],
  name: 'ObcasnikClanstva',
  data() {
    return {
      data: this.$options.cardData.data,
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
    };
  },
  methods: {
    createAdjacencyMatrix(data) {
      // Define the div for the tooltip
      const tooltipdiv = d3.select('#viz').append('div')
        .attr('class', 'matricatooltip');

      const adjacencyMatrixInst = d3.layout.adjacencyMatrix()
        .size([600, 600])
        .nodes(data.nodes)
        .links(data.links)
        .directed(false)
        .nodeID(d => d.name);
      const matrixData = adjacencyMatrixInst();
      const someColors = d3.scale.category20b();
      d3.select('svg')
        .append('g')
        .attr('transform', 'translate(50,50)')
        .attr('id', 'adjacencyG')
        .selectAll('rect')
        .data(matrixData)
        .enter()
        .append('rect')
        .attr('width', d => d.width)
        .attr('height', d => d.height)
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('class', d => d.id)
        .style('stroke', 'black')
        .style('stroke-width', '1px')
        .style('stroke-opacity', 0.1)
        .style('fill', d => someColors(d.source.group))
        .style('fill-opacity', d => d.weight / 1000 * 0.8)
        .on('mouseover', (d) => { // setup tooltip
          const text = `${d.source.name} in ${d.target.name} sta v isti poslanski skupini preživela ${d.weight} dni.`;

          tooltipdiv.transition()
            .duration(200)
            .style('opacity', 0.9);

          tooltipdiv.html(`<p>${text}</p>`)
            .style('left', `${d3.event.pageX - (tooltipdiv.node().getBoundingClientRect().width / 2) - $('#viz').offset().left + 10}px`)
            .style('top', `${d3.event.pageY - $('#viz').offset().top - 30}px`);
        });
      // .on('mouseout', (d) => {
      //   tooltipdiv.transition()
      //     .duration(200)
      //     .style('opacity', 0);
      // });
      d3.select('#adjacencyG')
        .call(adjacencyMatrixInst.xAxis);
      d3.select('#adjacencyG')
        .call(adjacencyMatrixInst.yAxis);
    },
  },
  mounted() {
    d3.layout.adjacencyMatrix = adjacencyMatrix;

    const adjacencyData = this.data;
    // adjacencyData.nodes = this.data.nodes.sort((a, b) => {
    //   return a.group - b.group;
    // });
    // adjacencyData.links = this.data.links.sort((a, b) => {
    //   return a.source - b.source;
    // });

    this.createAdjacencyMatrix(adjacencyData);
  },
};
</script>

<style lang="scss">
  // svg {
  //     height: 1400px;
  //     width: 1400px;
  //     border: 1px solid gray;
  //   }
  g.am-axis text {
    font-size: 8px;
  }

  .domain {
    fill: none;
  }

  .tick>line {
    stroke: black;
    stroke-width: 1px;
    stroke-opacity: .25;
  }

  .matricatooltip {
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
</style>
