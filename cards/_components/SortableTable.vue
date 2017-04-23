<template>
  <ul>
    <li class="headers">
      <template v-for="column in columns">
        <div
          v-if="column.label"
          :class="['column', column.additionalClass, { sort: sort === column.id }, { reverse: sortOrder === 'desc' }]"
          @click="sortCallback(column.id)">
          {{ column.label }}
        </div>
      </template>
    </li>
    <div v-if="items.length === 0" class="no-results">Brez rezultatov.</div>
    <li v-for="item in items" class="item">
      <div
        v-for="cell, cellIndex in item"
        :class="['column', ...columns[cellIndex].additionalClass]"
      >
        <template v-if="cell.contents">
          <template v-for="content, contentIndex in cell.contents">
            <template v-if="content.link">
              <a :href="content.link">{{ content.text }}</a>
            </template>
            <template v-else>{{ content.text }}</template>{{ contentIndex < cell.contents.length - 1 ? ', ' : '' }}
          </template>
        </template>
        <template v-else>
          <template v-if="typeof cell === 'string'">{{ cell }}</template>
          <template v-else>
            <template v-if="cell.link">
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
