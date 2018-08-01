<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="url"
    :header-config="headerConfig">

    <div id="kompas">
      <p-search-dropdown
        :items="people"
        :placeholder="peoplePlaceholder"
      />
      <div id="visualisation"></div>
    </div>

    <div slot="info">
      <p class="info-text lead"></p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text"></p>
    </div>

    <!-- Card content goes here -->
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import PSearchDropdown from 'components/SearchDropdown.vue';

export default {
  components: { PSearchDropdown },

  mixins: [common],

  name: 'Kompas',

  data() {
    const kompasData = this.$options.cardData.data.data;

    const margin = {
      top: 50,
      right: 300,
      bottom: 50,
      left: 50,
    };
    const outerWidth = 1050;
    const outerHeight = 500;
    const width = outerWidth - margin.left - margin.right;
    const height = outerHeight - margin.top - margin.bottom;

    const partyAcronyms = this.groupBy(kompasData, item => [item.person.party.acronym]);

    const x = d3.scale.linear()
      .range([0, this.width])
      .nice();

    const y = d3.scale.linear()
      .range([this.height, 0])
      .nice();

    // kompasData.forEach((d) => {
    //   d.ideology1 = +d.score.vT1;
    //   d.ideology2 = +d.score.vT2;
    // });

    const xMax = d3.max(kompasData, d => d.score.vT1) * 1.05;
    let xMin = d3.min(kompasData, d => d.score.vT1) > 0;
    xMin = xMin > 0 ? 0 : xMin;
    const yMax = d3.max(kompasData, d => d.score.vT2) * 1.05;
    let yMin = d3.min(kompasData, d => d.score.vT2);
    yMin = yMin > 0 ? 0 : yMin;

    x.domain([xMin, xMax]);
    y.domain([yMin, yMax]);

    const xAxis = d3.svg.axis()
      .scale(this.x)
      .orient('bottom')
      .tickSize(0);

    const yAxis = d3.svg.axis()
      .scale(this.y)
      .orient('left')
      .tickSize(0);

    return {
      data: this.$options.cardData.data,
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
      margin,
      outerWidth,
      outerHeight,
      width,
      height,
      partyAcronyms,
      x,
      y,
      xAxis,
      yAxis,
    };
  },

  computed: {
    people() {
      return [];
    },

    peoplePlaceholder() {
      return '';
    },
  },

  mounted() {
    let parties = [];
    for (let group in this.partyAcronyms) {
      parties.push(this.partyAcronyms[group][0].person.party.acronym.replace(/ /g, '_'));
    }

    const color = d3.scale.ordinal()
      .range(['#8FCFEE', '#4FB5E6', '#AA7375', '#534961', '#4F6379', '#5388AA', '#D9776B', '#BA594C']);

    const zoomBeh = d3.behavior.zoom()
      .x(this.x)
      .y(this.y)
      .scaleExtent([0.6, 10])
      .on('zoom', zoom);

    const svg = d3.select('#visualisation')
      .append('svg')
      .attr('viewBox', '0 0 700 400')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .call(zoomBeh);

    console.log(svg);

    console.log('ping');

    svg.append('rect')
      .attr('width', this.width)
      .attr('height', this.height);

    svg.append('g')
      .classed('x axis', true)
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxis);

    svg.append('g')
      .classed('y axis', true)
      .call(this.yAxis);

    svg.selectAll('.tick')
      .each((d, i) => {
        // this.remove();
      });

    const objects = svg.append('svg')
      .classed('objects', true)
      .attr('width', this.width)
      .attr('height', this.height);

    parties = objects.selectAll('g')
      .data(this.partyAcronyms)
      .enter()
      .append('g')
      .attr('id', (d, i) => {
        return 'kompasgroup' + d[0].person.party.acronym.replace(/ /g, '_');
      });

    const defs = svg.append('defs');

    for (let i in this.data.data) {
      defs.append('pattern')
        .attr('id', this.data.data[i].person.gov_id)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 40)
        .attr('height', 40)
        .attr('x', -20)
        .attr('y', 20)
        .append('image')
        .attr('xlink:href', 'https://cdn.parlameter.si/v1/parlassets/img/people/square/' + this.data.data[i].person.gov_id + '.png')
        .attr('width', 40)
        .attr('height', 40)
        .attr('x', 0)
        .attr('y', 0);
    }

    svg.append('svg')
      .attr('width', 20)
      .attr('height', 20)
      .attr('x', this.width - 30)
      .attr('y', this.height - 30)
      .attr('viewBox', '0 0 1280 1280')
      .html('<g class="centerme" transform="translate(-2108.7199,-3554.229)"><rect style="fill: #ffffff;" transform="translate(2108.7199,3554.229)" width="1280" height="1280"></rect><path style="" d="m 2108.7199,4744.854 c 0,-58.75 0.4283,-89.375 1.25,-89.375 0.8226,0 1.25,-33.125 1.25,-96.875 l 0,-96.875 90,0 90,0 0,96.875 0,96.875 95,0 95,0 0,89.375 0,89.375 -186.25,0 -186.25,0 0,-89.375 z m 907.5001,0 0,-89.375 96.25,0 96.25,0 0,-96.875 0,-96.875 90,0 90,0 0,186.25 0,186.25 -186.25,0 -186.25,0 0,-89.375 z m -291.2501,-334.5266 c -35.2236,-4.0473 -73.0374,-18.343 -101.25,-38.2781 -15.2954,-10.8077 -42.0126,-37.5249 -52.8203,-52.8203 -24.7025,-34.9595 -39.6592,-82.1008 -39.6592,-125 0,-42.8992 14.9567,-90.0405 39.6592,-125 10.8077,-15.2954 37.5249,-42.0126 52.8203,-52.8204 22.3667,-15.8043 55.1117,-29.8695 81.875,-35.1684 48.4773,-9.598 95.5802,-3.2991 140.0001,18.7217 22.1493,10.9804 36.9714,21.8091 56.2772,41.1149 19.3057,19.3057 30.1345,34.1279 41.1148,56.2772 30.8302,62.1899 30.8302,131.5601 0,193.75 -10.9803,22.1493 -21.8091,36.9715 -41.1148,56.2772 -19.3058,19.3058 -34.1279,30.1345 -56.2772,41.1149 -37.9266,18.8018 -80.28,26.4671 -120.6251,21.8313 z m -613.75,-669.8484 0,-186.25 185,0 185,0 0,89.375 0,89.375 -95,0 -95,0 0,96.875 0,96.875 -90,0 -90,0 0,-186.25 z m 1097.5001,89.375 0,-96.875 -96.25,0 -96.25,0 0,-89.375 0,-89.375 186.25,0 186.25,0 0,186.25 0,186.25 -90,0 -90,0 0,-96.875 z" fill="#5388AA"></path></g>')
      .select('.centerme')
      .on('click', () => {
        // centerCompass();
      });

    // tooltip start

    // Define the div for the tooltip
    const tooltipdiv = d3.select('#kompas-scatter').append('div')
      .attr('class', 'kompastooltip');

    // tooltip end

    for (let group in this.partyAcronyms) {

      const currentselection = svg.select('#kompasgroup' + this.partyAcronyms[group][0].person.party.acronym.replace(/ /g, '_')).classed('partygroup', true)
        .selectAll('.dot')
        .data(this.partyAcronyms[group])
        .enter()
        .append('circle')
        .classed('dot', true)
        .attr('id', (d) => {
            return '_' + d.person.id;
        })
        .attr('r', (d) => {
            return 3;
        })
        .attr('transform', transform)
        .classed(this.partyAcronyms[group][0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-fill', true)
        .classed(this.partyAcronyms[group][0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-stroke', true)
        // .style('stroke', function(
        .on('click', (d, i) => {
          // show photo
          showPersonPicture(d);

          // move to front
          var parent = $('#_' + d.person.id).parent()[0];
          moveToFront(parent, d);
          if(typeof measure == 'function') {
              measure('kompas','person',d.person.name,'');
          }
          //     element.classed('selected', true);
          // }
        })
        .on('mouseover', (d) => { // setup tooltip
          tooltipdiv.transition()
            .duration(200)
            .style('opacity', .9);

          // console.log($(this).parents('#kompas-scatter')));
          tooltipdiv.html(d.person.name)
            .style('left', (d3.event.pageX - (tooltipdiv.node().getBoundingClientRect().width / 2) - $('#kompas-scatter').offset().left + 10 + 'px'))
            .style('top', (d3.event.pageY - $('#kompas-scatter').offset().top - 30) + 'px');
          })
        .on('mouseout', (d) => {
          tooltipdiv.transition()
            .duration(200)
            .style('opacity', 0);
        });

        // makeSwitchEvent2(currentselection); // TODO

    }

    function zoom(animate) {

        if (animate) {
            svg.selectAll('.dot')
                .transition()
                .duration(400)
                .attr('transform', transform);
        } else {
            svg.selectAll('.dot')
                .attr('transform', transform);
        }

    }

    function transform(d) {
        return 'translate(' + this.x(d.score.vT1) + ',' + this.y(d.score.vT2) + ')';
    }

    function overGroup() {};

    function offGroup() {};

    function drawSingleHull(datum) {

        // display card
        $('#kompas-personcard' + datum.person.id).removeClass('hidden').detach().prependTo('.kompas-people-wide');
        updatePeopleScroller();

        // create hull
        var hull = objects.append('path')
            .classed('hull', true)
            .classed('singlehull', true)
            .attr('data-parent', '_' + datum.person.id)
            .attr('id', function() {
                return 'singlehull' + datum.person.id;
            })
            .attr('data-id', datum.person.id);

        var vertices = [
            [this.x(datum.score.vT1), this.y(datum.score.vT2)]
        ];

        hull.datum(vertices)
            .attr('d', function(d) {
                return 'M' + d[0][0] + ',' + d[0][1] + 'L' + (d[0][0] + 0.1) + ',' + d[0][1] + 'Z';
            })
            // .style('fill', function(d) {
            //     return color(datum.person.party.acronym.replace(/ /g, '_'));
            // })
            .classed(datum.person.party.acronym.replace(/ /g, '_').toLowerCase() + '-fill', true)
            .classed(datum.person.party.acronym.replace(/ /g, '_').toLowerCase() + '-stroke', true)
            // .style('stroke', function(d) {
            //     return color(datum.person.party.acronym.replace(/ /g, '_'));
            // })
            .on('click', function() {
                d3.select('#kompas-personcard' + svg.select(this).attr('data-id')).classed('hidden', true);
                svg.select(this).remove();
            });

    }

    function moveToFront(parent, selected) {
        // move person to group front
        d3.select(parent).selectAll('.dot')
            .sort(function(a, b) {
                var s = selected.person.id;
                return (a.person.id == s) - (b.person.id == s);
            });

        // move group in front of other groups
        d3.select(parent.parentNode).selectAll('.partygroup')
            .sort(function(a, b) {
                var s = selected.person.party.id;
                return (a[0].person.party.id == s) - (b[0].person.party.id == s);
            });
    }

    function showPersonPicture(datum) {

        function hasID(element) {
            return element.id == datum.person.id;
        }

        var elementfound = kompasState.people.find(hasID);

        if (!elementfound) {
            kompasState.people.push({'id': parseInt(datum.person.id), 'name': datum.person.name});
        }
        updateShareURL();

        // display card
        $('#kompas-personcard' + datum.person.id).removeClass('hidden').detach().prependTo('.kompas-people-wide');
        updatePeopleScroller();

        // create hull
        svg.select('#_' + datum.person.id)
            .attr('r', function(d) {
                return 20;
            })
            .style('fill', function(d) {
                return 'url(#' + d.person.gov_id + ')'
            })
            .classed('turnedon', true)
            .on('click', function() {

                var _this = this;

                function hasID(element) {
                    return element.id == d3.select(_this).datum().person.id;
                }

                var elementfound = kompasState.people.find(hasID);

                if (elementfound) {
                    kompasState.people.splice(kompasState.people.indexOf(elementfound), 1);
                }
                updateShareURL();

                d3.select('#kompas-personcard' + d3.select(this).datum().person.id).classed('hidden', true);
                d3.select(this)
                    .attr('r', function(d) {
                        return 3;
                    })
                    // .style('fill', function(d) {
                    //     return color(d.person.party.acronym.replace(/ /g, '_'));
                    // })
                    .classed(d3.select(this).datum().person.party.acronym.replace(/ /g, '_').toLowerCase() + '-fill', true)
                    .style('fill', null)
                    .classed('turnedon', false)
                    .on('click', function(d) {
                        // show photo
                        showPersonPicture(d);

                        // move to front
                        var parent = $('#_' + d.person.id).parent()[0];
                        moveToFront(parent, d);
                    });

                // if all party members are hidden, disable partyswitch
                var partyacronym = datum.person.party.acronym.replace(/ /g, '_');

                if ($(svg.select('#kompasgroup' + partyacronym)[0]).children('.turnedon').length === 0) {
                    var hoverclassname = partyacronym.toLowerCase() + '-hover';
                    var backgroundclassname = partyacronym.toLowerCase() + '-background';
                    $('#partyswitch-' + partyacronym)
                        .removeClass('turnedon')
                    $('#partyswitch-' + partyacronym)
                        .removeClass(hoverclassname);
                    $('#partyswitch-' + partyacronym)
                        .removeClass(backgroundclassname);
                    }

            });
    }

    function centerCompass() {

        // translate points to [0, 0]
        zoomBeh.scale([0.8]);
        zoomBeh.translate([50, 50]);
        zoom(true);
    }

    function zoomIn(datum, scale) {
        var point = svg.select('#_' + datum.person.id);

        // translate points to [0, 0]
        zoomBeh.scale([scale]);
        zoomBeh.translate([0, 0]);

        var parentBounds = svg.node().getBoundingClientRect();
        var stretchCoef = {
            'x': 700/parentBounds.width,
            'y': 400/parentBounds.height
        };
        var newx = (parentBounds.width / 2 * stretchCoef.x - this.x(datum.score.vT1));
        var newy = (parentBounds.height / 2  * stretchCoef.y - this.y(datum.score.vT2));
        zoomBeh.translate([newx, newy]);
        zoom(true);
    }

    function drawHull(group, dataset) {
        var hull = objects.append('path')
            .attr('class', 'hull')
            .attr('id', function() {
                return 'kompashull' + dataset[0].person.party.acronym.replace(/ /g, '_');
            })
            .classed('hidden', true);

        var vertices = dataset.map(function(d) {
            return [this.x(d.score.vT1), this.y(d.score.vT2)];
        });

        if (vertices.length > 2) {
            hull.datum(d3.geom.hull(vertices))
                .attr('d', function(d) {
                    return 'M' + d.join('L') + 'Z';
                })
                // .style('fill', function(d) {
                //     return color(dataset[0].person.party.acronym.replace(/ /g, '_'));
                // })
                // .style('stroke', function(d) {
                //     return color(dataset[0].person.party.acronym.replace(/ /g, '_'));
                // });
                .classed(dataset[0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-fill', true)
                .classed(dataset[0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-stroke', true)
        } else if (vertices.length === 2) {
            hull.datum(vertices)
                .attr('d', function(d) {
                    return 'M' + d.join('L') + 'Z';
                })
                // .style('fill', function(d) {
                //     return color(dataset[0].person.party.acronym.replace(/ /g, '_'));
                // })
                // .style('stroke', function(d) {
                //     return color(dataset[0].person.party.acronym.replace(/ /g, '_'));
                // });
                .classed(dataset[0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-fill', true)
                .classed(dataset[0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-stroke', true)
        } else {
            hull.datum(vertices)
                .attr('d', function(d) {
                    return 'M' + d[0][0] + ',' + d[0][1] + 'L' + (d[0][0] + 0.1) + ',' + d[0][1] + 'Z';
                })
                // .style('fill', function(d) {
                //     return color(dataset[0].person.party.acronym.replace(/ /g, '_'));
                // })
                // .style('stroke', function(d) {
                //     return color(dataset[0].person.party.acronym.replace(/ /g, '_'));
                // });
                .classed(dataset[0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-fill', true)
                .classed(dataset[0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-stroke', true)
        }

        makeSwitchEvent(dataset[0].person.party.acronym.replace(/ /g, '_'));
    }
  },

  methods: {
    measurePiwik(filter, sort, order) {
      if (typeof measure === 'function') {
        if (sort !== '') {
          measure('s', 'session-sort', `${sort} ${order}`, '');
        } else if (filter !== '') {
          measure('s', 'session-filter', filter, '');
        }
      }
    },

    groupBy(array, f) {
      const groups = {};
      array.forEach((o) => {
        const group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map((group) => {
        return groups[group];
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#kompas {
  width: 100%;
  position: relative;
}
</style>
