<template>
  <div class="card-container card-halfling card-IME_KARTICE" :id="$options.cardData.cardData._id">
    <card-header :config="headerConfig" />

    <div class="card-content">
      <div class="card-content-front">
        <div id="viz">
          <svg viewBox="0 0 700 700">
          </svg>
        </div>
        <div id="controls"></div>
      </div>

      <card-info>
        <p class="info-text lead"></p>
        <p class="info-text heading">METODOLOGIJA</p>
        <p class="info-text"></p>
      </card-info>

      <card-embed :url="generatedCardUrl" />

      <card-share :url="shortenedCardUrl" />
    </div>
    <card-footer :link="slugs.base" />
  </div>
</template>

<script>
  /* globals window $ measure */
  import common from 'mixins/common';
  import adjacencyMatrix from 'helpers/adjacencyMatrix';
  // import 'helpers/adjacencyMatrix';

  export default {
    components: {},
    mixins: [common],
    name: 'ImeKartice',
    data() {
      return {
        data: this.$options.cardData.data,
        slugs: this.$options.cardData.urlsData,
        shortenedCardUrl: '',
        url: 'https://glej.parlameter.si/group/method/',
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
      shortenUrl() {
        return new Promise((resolve) => {
          $.get(`https://parla.me/shortner/generate?url=${window.encodeURIComponent(`${this.url}&frame=true`)}`, (
            response) => {
            this.$el.querySelector('.card-content-share button').textContent = 'KOPIRAJ';
            resolve(response);
          });
        });
      },
      measurePiwik(filter, sort, order) {
        if (typeof measure === 'function') {
          if (sort !== '') {
            measure('s', 'session-sort', `${sort} ${order}`, '');
          } else if (filter !== '') {
            measure('s', 'session-filter', filter, '');
          }
        }
      },
      createAdjacencyMatrix(data) {
        // Define the div for the tooltip
        var tooltipdiv = d3.select('#viz').append("div")
            .attr("class", "matricatooltip");

        var adjacencyMatrix = d3.layout.adjacencyMatrix()
          .size([600, 600])
          .nodes(data.nodes)
          .links(data.links)
          .directed(false)
          .nodeID(function (d) {
            return d.name
          });
        var matrixData = adjacencyMatrix();
        console.log(matrixData)
        var someColors = d3.scale.category20b();
        d3.select("svg")
          .append("g")
          .attr("transform", "translate(50,50)")
          .attr("id", "adjacencyG")
          .selectAll("rect")
          .data(matrixData)
          .enter()
          .append("rect")
          .attr("width", function (d) {
            return d.width
          })
          .attr("height", function (d) {
            return d.height
          })
          .attr("x", function (d) {
            return d.x
          })
          .attr("y", function (d) {
            return d.y
          })
          .attr('class', d => d.id)
          .style("stroke", "black")
          .style("stroke-width", "1px")
          .style("stroke-opacity", .1)
          .style("fill", function (d) {
            return someColors(d.source.group)
          })
          .style("fill-opacity", function (d) {
            return d.weight / 1000 * 0.8;
          })
          .on('mouseover', (d) => { // setup tooltip
            let text = d.source.name + ' in ' + d.target.name + ' sta v isti poslanski skupini preživela ' + d.weight + ' dni.';

            tooltipdiv.transition()
              .duration(200)
              .style('opacity', 0.9);

            tooltipdiv.html('<p>' + text + '</p>')
              .style("left", (d3.event.pageX - (tooltipdiv.node().getBoundingClientRect().width / 2) - $('#viz').offset().left + 10 + "px"))
                    .style("top", (d3.event.pageY - $('#viz').offset().top - 30) + "px");

          });
          // .on('mouseout', (d) => {
          //   tooltipdiv.transition()
          //     .duration(200)
          //     .style('opacity', 0);
          // });
        d3.select("#adjacencyG")
          .call(adjacencyMatrix.xAxis);
        d3.select("#adjacencyG")
          .call(adjacencyMatrix.yAxis);
        
        
      }
    },
    mounted() {
      this.shortenUrl();
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