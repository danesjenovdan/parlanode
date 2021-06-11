<template>
  <div class="compass-container">
    <p-search-dropdown
      :model-value="dropdownItems"
      :groups="groups"
      :placeholder="dropdownPlaceholder"
      @select="onSelect"
      @clear="onClearSelection"
    />
    <div ref="chart" class="compass-visualisation"></div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import { groupBy } from 'lodash-es';
import links from '@/_mixins/links.js';
import PSearchDropdown from '@/_components/SearchDropdown.vue';

export default {
  name: 'Compass',
  components: {
    PSearchDropdown,
  },
  mixins: [links],
  cardInfo: {
    doubleWidth: true,
  },
  props: {
    compassData: {
      type: Object,
      required: true,
    },
  },
  data() {
    const groupedByParty = Object.values(
      groupBy(this.compassData, (item) => item.person?.group?.slug)
    );

    const parties = groupedByParty.map((item) => ({
      id: item[0].person?.group?.slug,
      label: item[0].person?.group?.acronym,
      selected: false,
      colorClass: `${(item[0].person?.group?.acronym || '')
        .toLowerCase()
        .replace(/[ +,]/g, '_')}-background`,
    }));

    const people = this.compassData.map((item) => ({
      id: item.person?.slug,
      label: item.person?.name,
      selected: false,
      image: this.getPersonPortrait(item.person),
    }));

    const partiesGroup = {
      label: this.$t('parties'),
      items: groupedByParty.map((item) => item[0].person?.group?.slug),
    };
    const peopleGroups = groupedByParty.map((item) => ({
      label: item[0].person?.group?.acronym,
      items: item.map((p) => p.person?.slug),
    }));
    const groups = [partiesGroup, ...peopleGroups];

    return {
      groupedByParty,
      parties,
      people,
      groups,
    };
  },
  computed: {
    dropdownPlaceholder() {
      const numSelectedPeople = this.people.filter((p) => p.selected).length;
      const numSelectedParties = this.parties.filter((p) => p.selected).length;
      if (!numSelectedPeople && !numSelectedParties) {
        return this.$t('select-mps');
      }
      return this.$t('selected-mps', {
        num: numSelectedPeople + numSelectedParties,
      });
    },
    dropdownItems() {
      return [...this.parties, ...this.people];
    },
  },
  mounted() {
    this.renderCompass();
  },
  methods: {
    onSelect(id) {
      const person = this.people.find((p) => p.id === id);
      if (person) {
        if (!person.selected) {
          person.selected = true;
          this.showPersonPicture(
            this.compassData.find((p) => p.person.slug === id)
          );
        } else {
          person.selected = false;
          this.hidePersonPicture(
            this.compassData.find((p) => p.person.slug === id)
          );
        }
        return;
      }

      const party = this.parties.find((p) => p.id === id);
      if (party) {
        if (!party.selected) {
          party.selected = true;
          this.showPartyPictures(party.id);
        } else {
          party.selected = false;
          this.hidePartyPictures(party.id);
        }
      }
    },
    onClearSelection() {
      this.parties
        .filter((p) => p.selected)
        .forEach((p) => {
          this.hidePartyPictures(p.id);
          p.selected = false;
        });
      this.people
        .filter((p) => p.selected)
        .forEach((p) => {
          this.hidePersonPicture(
            this.compassData.find((pp) => pp.person.slug === p.id)
          );
          p.selected = false;
        });
    },
    renderCompass() {
      // empty the chart container
      this.$refs.chart.textContent = '';

      const width = 940;
      const height = 493;
      const margin = { top: 10, right: 10, bottom: 10, left: 10 };

      let objects;
      let dots;
      let images;

      const zoom = d3
        .zoom()
        .scaleExtent([0.8, 10])
        .on('zoom', ({ transform }) => {
          objects.attr('transform', transform);
          dots
            .attr('r', (d, i, g) => {
              const on = d3.select(g[i]).classed('turnedon');
              return (on ? 25 : 4) / transform.k;
            })
            .attr('stroke-width', 1 / transform.k);
          images
            .attr('width', 50 / transform.k)
            .attr('height', 50 / transform.k);
        });

      const svg = d3
        .select(this.$refs.chart)
        .append('svg')
        .attr('viewBox', [0, 0, width, height])
        .call(zoom);

      const resetZoom = () => {
        svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
      };

      const xMax = d3.max(this.compassData, (d) => d.score?.vT1);
      const xMin = d3.min(this.compassData, (d) => d.score?.vT1);
      const yMax = d3.max(this.compassData, (d) => d.score?.vT2);
      const yMin = d3.min(this.compassData, (d) => d.score?.vT2);

      const x = d3
        .scaleLinear()
        .domain([xMin, xMax])
        .range([margin.left, width - margin.right])
        .nice();

      const y = d3
        .scaleLinear()
        .domain([yMin, yMax])
        .range([height - margin.bottom, margin.top])
        .nice();

      let tooltip;

      const tooltipHover = (dot) => {
        dot
          .on('mouseover', (e, d) => {
            const bbox = tooltip
              .select('text')
              .text(d.person.name)
              .node()
              .getBBox();

            const padX = 8;
            const padY = 4;

            tooltip
              .select('rect')
              .attr('x', bbox.x - padX)
              .attr('y', bbox.y - padY * 1.25)
              .attr('width', bbox.width + padX * 2)
              .attr('height', bbox.height + padY * 2);

            const currentZoom = d3
              .zoomTransform(objects.node())
              .translate(x(d.score.vT1), y(d.score.vT2));

            tooltip.attr(
              'transform',
              `translate(${currentZoom.x},${currentZoom.y - 15})`
            );

            tooltip
              .interrupt()
              .transition()
              .duration(150)
              .style('opacity', 1)
              .style('display', null);
          })
          .on('mouseout', () => {
            tooltip
              .transition()
              .duration(150)
              .style('opacity', 0)
              .transition()
              .style('display', 'none');
          });
      };

      objects = svg.append('g').attr('class', 'objects');

      dots = objects
        .append('g')
        .selectAll('.dot')
        .data(this.compassData)
        .join('circle')
        .attr('class', (d) => {
          const partyClass = (d.person?.group?.acronym || '')
            .replace(/[ +,]/g, '_')
            .toLowerCase();
          return `dot ${partyClass}-stroke ${partyClass}-fill`;
        })
        .attr('id', (d) => `person-${d.person?.slug}`)
        .attr('r', 4)
        .attr('cx', (d) => x(d.score?.vT1))
        .attr('cy', (d) => y(d.score?.vT2))
        .style('cursor', 'pointer')
        .on('click', (e, d) => {
          this.onSelect(d.person?.slug);
        })
        .call(tooltipHover);

      tooltip = svg
        .append('g')
        .attr('class', 'compass-tooltip')
        .style('pointer-events', 'none')
        .style('display', 'none');

      tooltip.append('rect').attr('fill', '#000').attr('rx', 3);
      tooltip
        .append('text')
        .attr('fill', '#fff')
        .attr('font-size', 14)
        .attr('text-anchor', 'middle');

      images = svg
        .append('defs')
        .selectAll('pattern')
        .data(this.compassData)
        .join('pattern')
        .attr('id', (d) => `image-${d.person?.slug}`)
        .attr('patternUnits', 'objectBoundingBox')
        .attr('width', 1)
        .attr('height', 1)
        .append('image')
        .attr('xlink:href', (d) => this.getPersonPortrait(d.person))
        .attr('width', 50)
        .attr('height', 50);

      const resetIcon = svg
        .append('svg')
        .attr('width', 35)
        .attr('height', 35)
        .attr('x', width - 50)
        .attr('y', height - 50)
        .attr('viewBox', [15, 15, 70, 70])
        .style('cursor', 'pointer')
        .on('click', resetZoom);

      resetIcon
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 100)
        .attr('height', 100)
        .attr('fill', 'rgba(0,0,0,0.15)');

      resetIcon
        .append('path')
        .attr(
          'd',
          'M79 28a7 7 0 00-7-7h-9v6h9a1 1 0 011 1v9h6zm0 44v-9h-6v9a1 1 0 01-1 1h-9v6h9a7 7 0 007-7zm-58-9v9a7 7 0 007 7h9v-6h-9a1 1 0 01-1-1v-9zm16-42h-9a7 7 0 00-7 7v9h6v-9a1 1 0 011-1h9z'
        );

      this.$nextTick(() => {
        svg.transition().duration(750).call(zoom.scaleTo, 0.9);
        // TODO: state
      });
    },
    showPersonPicture(datum) {
      const currentZoom = d3.zoomTransform(d3.select('.objects').node());

      d3.select('.compass-visualisation svg')
        .select(`#person-${datum.person?.slug}`)
        .attr('r', 25 / currentZoom.k)
        .style('fill', (d) => `url(#image-${d.person?.slug})`)
        .classed('turnedon', true)
        .raise();
    },
    hidePersonPicture(datum) {
      const currentZoom = d3.zoomTransform(d3.select('.objects').node());

      d3.select('.compass-visualisation svg')
        .select(`#person-${datum.person?.slug}`)
        .attr('r', 4 / currentZoom.k)
        .style('fill', null)
        .classed('turnedon', false)
        .raise();
    },
    showPartyPictures(id) {
      this.compassData.forEach((datum) => {
        if (datum.person?.group.slug === id) {
          this.showPersonPicture(datum);
        }
      });
    },
    hidePartyPictures(id) {
      this.compassData.forEach((datum) => {
        if (datum.person?.group.slug === id) {
          this.hidePersonPicture(datum);
        }
      });
    },
  },
};
</script>
