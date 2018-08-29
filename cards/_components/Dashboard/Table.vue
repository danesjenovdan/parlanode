<template>
  <div class="dashboard-table">
    <div v-if="columns && columns.length" class="table-headers">
      <div class="table-row">
        <div v-for="column in columns" :key="column.id" class="table-col header">
          <slot :column="column" name="header-col">
            {{ column.label }}
          </slot>
        </div>
      </div>
    </div>
    <div class="table-contents">
      <div v-for="(item, i) in items" :key="i" class="table-row">
        <slot :item="item" :index="i" name="item">
          <div v-for="(column, c) in item" :key="c" class="table-col">
            <slot :column="column" :index="c" name="item-col">
              {{ 'text' in column ? column.text : column }}
            </slot>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardTable',
  props: {
    columns: {
      type: Array,
      default: null,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped lang="scss">
.dashboard-table {
  .table-headers,
  .table-contents {
    .table-row {
      display: flex;
      min-height: 46px;
      margin-left: -5px;
      margin-right: -5px;
      border-top: 1px solid #ccc;
      flex-wrap: wrap;
      padding: 10px 0;

      .table-col {
        flex-grow: 1;
        flex-basis: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 5px;
        padding-right: 5px;
        flex-direction: column;

        &.header {
          text-transform: uppercase;
          font-weight: 500;
        }

        label {
          width: 100%;
          font-weight: 700;
          text-transform: uppercase;
        }
      }
    }
  }
}
</style>
