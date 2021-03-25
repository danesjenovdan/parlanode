<template>
  <div class="dashboard-table">
    <slot
      v-if="pages > 1"
      v-bind="{ page, pages, per: paginate }"
      name="top-pager"
    >
      <div class="table-pager">
        <dash-button @click="prevPage">&lt;</dash-button>
        {{ page + 1 }} / {{ pages }}
        <dash-button @click="nextPage">&gt;</dash-button>
      </div>
    </slot>
    <div v-if="columns && columns.length" class="table-headers">
      <div class="table-row">
        <div
          v-for="column in columns"
          :key="column.id"
          class="table-col header"
        >
          <slot :column="column" name="header-col">
            {{ column.label }}
          </slot>
        </div>
      </div>
    </div>
    <div class="table-contents">
      <div v-for="(item, i) in activeItems" :key="item.id" class="table-row">
        <slot :item="item" :index="i" name="item">
          <div v-for="(column, c) in item" :key="c" class="table-col">
            <slot :column="column" :index="c" name="item-col">
              {{ 'text' in column ? column.text : column }}
            </slot>
          </div>
        </slot>
      </div>
    </div>
    <slot
      v-if="pages > 1"
      v-bind="{ page, pages, per: paginate }"
      name="bottom-pager"
    >
      <div class="table-pager">
        <dash-button @click="prevPage">&lt;</dash-button>
        {{ page + 1 }} / {{ pages }}
        <dash-button @click="nextPage">&gt;</dash-button>
      </div>
    </slot>
  </div>
</template>

<script>
import DashButton from '@/_components/Dashboard/Button.vue';

export default {
  name: 'DashboardTable',
  components: {
    DashButton,
  },
  props: {
    columns: {
      type: Array,
      default: null,
    },
    items: {
      type: Array,
      default: () => [],
    },
    paginate: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      page: 0,
    };
  },
  computed: {
    pages() {
      return this.paginate <= 0
        ? 1
        : Math.ceil(this.items.length / this.paginate);
    },
    activeItems() {
      if (this.pages <= 1) {
        return this.items;
      }
      const begin = this.paginate * this.page;
      const end = this.paginate * (this.page + 1);
      return this.items.slice(begin, end);
    },
  },
  methods: {
    prevPage() {
      this.page = Math.max(0, this.page - 1);
    },
    nextPage() {
      this.page = Math.min(this.pages - 1, this.page + 1);
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

          > small {
            font-weight: 400;
            float: right;
          }

          > span {
            font-weight: 400;
            float: right;
            display: block;
          }
        }
      }
    }
  }

  .table-headers {
    .table-row {
      border-top: 0;
    }
  }

  .table-pager {
    margin: 10px 0;
    text-align: center;
    user-select: none;

    ::v-deep .dash-button {
      padding: 4px 11px 3px;
      margin: 0 10px;
    }
  }
}
</style>
