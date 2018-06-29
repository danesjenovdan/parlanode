<template>
  <ul>
    <li v-if="sortCallback !== undefined" class="headers">
      <template v-for="column in columns">
        <div
          v-if="column.label"
          :key="column.id"
          :class="getColumnClasses(column)"
          @click="sortCallback(column.id)"
        >
          {{ column.label }}
        </div>
      </template>
    </li>
    <div v-if="items.length === 0" class="empty-dataset">Brez rezultatov.</div>
    <li v-for="(item, k) in items" :key="k" class="item">
      <div
        v-for="(cell, i) in item"
        :key="i"
        :class="getColumnClasses(columns[i], cell)"
      >
        <template v-if="typeof cell === 'object' && cell.contents">
          <template v-for="(content, j) in cell.contents">
            <template v-if="content.link">
              <a :href="content.link" :key="j">{{ content.text }}</a>
            </template>
            <template v-else>{{ content.text }}</template>
            {{ (cell.contents.length - j) > 1 ? ', ' : '' }}
          </template>
        </template>
        <template v-else-if="cell && cell.barchart">
          <div class="value">{{ cell.value }}</div>
          <div class="barcontainer">
            <div :style="{width: cell.width + '%'}" class="bar"></div>
          </div>
        </template>
        <template v-else-if="cell && cell.ticker">
          {{ cell.value > 0 ? '+' + cell.value : cell.value }}
        </template>
        <template v-else-if="cell.html">
          <div v-html="cell.html"></div>
        </template>
        <template v-else>
          <template v-if="['string', 'number'].indexOf(typeof cell) > -1">{{ cell }}</template>
          <template v-else>
            <template v-if="cell && cell.link">
              <a :href="cell.link">
                <img v-if="cell.image" :src="cell.image">
                <template v-else>{{ cell.text }}</template>
              </a>
            </template>
            <template v-else>
              <img v-if="cell.image" :src="cell.image">
              <template v-else>{{ cell.text }}</template>
            </template>
          </template>
        </template>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SortableTable',
  props: {
    columns: Array,
    items: Array,
    sort: String,
    sortOrder: String,
    sortCallback: Function,
  },
  methods: {
    getColumnClasses(column, cell) {
      const classes = [
        'column',
        column.additionalClass,
      ];
      if (!cell) {
        return [
          ...classes,
          { sort: this.sort === column.id },
          { reverse: this.sortOrder === 'desc' },
        ];
      }
      return [
        ...classes,
        { red: (cell && cell.value <= 0) },
      ];
    },
  },
};
</script>

<style scoped lang="scss">
@import '~parlassets/scss/colors';

.empty-dataset {
  font-size: 16px;
  font-style: italic;
  line-height: 20px;
  margin: 70px 0;
  text-align: center;
}
.session-list .item .column.ticker {
  color: $funblue;
  line-height: 18px;

  &.red {
    color: $red;
  }
}
.barchartcontainer  {
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: space-between;
  align-items: center;
  display: flex;
}

.value {
  font-size: 16px;
  line-height: 18px;
  background-color: #ffffff;
  // padding-right: 20px;
  display: flex;
  flex: 0 0 74px;
  width: 74px;
}
.barcontainer {
  display: flex;
  flex: 1 1 0%;
}
.bar {
  width: 100%;
  background-color: $funblue;
  height: 18px;
  display: flex;
  flex-wrap: nowrap;
}

.card-seznam-zakonov .session-list {
  .item {
    padding: 0;
  }
  .headers {
    margin-left: 0;
    .column {
      text-align: left;
      padding: 0 15px;

      &:first-child {
        margin-left: 0;
      }
    }
  }

  .item {
    .column {
      text-align: left;
      padding: 15px;
      font-size: 16px;

      &:first-child {
        margin-left: 0;
      }
    }
  }
}
</style>
