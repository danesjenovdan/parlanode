<template>
  <ul>
    <li v-if="sortCallback !== undefined" class="headers">
      <template v-for="column in columns">
        <div
          v-if="column.label"
          :class="['column', column.additionalClass, { sort: sort === column.id }, { reverse: sortOrder === 'desc' }]"
          @click="sortCallback(column.id)">
          {{ column.label }}
        </div>
      </template>
    </li>
    <div v-if="items.length === 0" class="empty-dataset">Brez rezultatov.</div>
    <li v-for="item in items" class="item">
      <div
        v-for="cell, cellIndex in item"
        :class="['column', ...columns[cellIndex].additionalClass, cell && cell.value <= 0 ? 'red' : '']"
      >
        <template v-if="typeof cell === 'object' && cell.contents">
          <template v-for="content, contentIndex in cell.contents">
            <template v-if="content.link">
              <a :href="content.link">{{ content.text }}</a>
            </template>
            <template v-else>{{ content.text }}</template>{{ contentIndex < cell.contents.length - 1 ? ', ' : '' }}
          </template>
        </template>
        <template v-else-if="cell && cell.barchart">
          <div class="value">{{ cell.value }}</div>
          <div class="barcontainer">
            <div class="bar" :style="{width: cell.width + '%'}"></div>
          </div>
        </template>
        <template v-else-if="cell && cell.ticker">
          {{ cell.value > 0 ? '+' + cell.value : cell.value }}
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
.bar {
  width: 100%;
  background-color: $funblue;
  height: 18px;
}
.value {
  font-size: 16px;
  line-height: 18px;
  background-color: #ffffff;
  width: 74px;
  float: left;
  padding-right: 20px;
}
</style>
