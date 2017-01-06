<template>
  <div
    class="search-dropdown"
    v-click-outside="function() { toggleDropdown(false) }">
    <div
      v-if="selectedIds.length > 0"
      class="search-dropdown-clear"
      @click="clearSelection">×</div>
    <input
      class="search-dropdown-input"
      type="text"
      v-model="filter"
      @focus="toggleDropdown(true)"
      @keydown.enter.prevent="toggleItem(filteredItems[focused].id)"
      @keydown.up.prevent="focus(focused - 1, true)"
      @keydown.down.prevent="focus(focused + 1, true)"
      :placeholder="placeholder">
    <ul
      :class="['search-dropdown-options', { visible: this.active }]"
      @mouseleave="focus(-1)">
      <li
        v-for="item, index in filteredItems"
        :class="{ selected : item.selected, focused : focused === index }"
        @click="toggleItem(item.id)"
        @mouseenter="focus(index)">
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script>
/* globals document */
const ITEM_HEIGHT = 23;
const ITEM_COUNT = 10;

export default {
  data: () => ({
    filter: '',
    active: false,
    focused: -1,
  }),
  watch: {
    filter() {
      this.focus(this.focused);
    },
  },
  computed: {
    filteredItems() {
      const currentFilter = this.filter;
      return this.items
        .filter(item =>
          item.selected || item.label.toLowerCase().indexOf(currentFilter.toLowerCase()) > -1,
        )
        .sort((a, b) => {
          if (Boolean(a.selected) === Boolean(b.selected)) {
            return a.label.localeCompare(b.label, 'sl');
          }
          return a.selected && !b.selected ? -1 : 1;
        });
    },
    selectedIds() {
      return this.filteredItems
        .filter(item => item.selected)
        .map(item => item.id);
    },
  },
  directives: {
    clickOutside: {
      bind(el, binding) {
        const handler = (e) => {
          if (!el.contains(e.target) && el !== e.target) {
            binding.value(e);
          }
        };
        // eslint-disable-next-line no-param-reassign
        el.vueClickOutside = handler;
        document.addEventListener('click', handler);
      },
      unbind(el) {
        document.removeEventListener('click', el.vueClickOutside);
        // eslint-disable-next-line no-param-reassign
        el.vueClickOutside = null;
      },
    },
  },
  props: {
    items: { type: Array, required: true },
    placeholder: { type: String, required: true },
  },
  methods: {
    toggleItem(selectedItemId) {
      let clickedIndex = -1;
      this.items.forEach((item, index) => {
        if (item.id === selectedItemId) {
          clickedIndex = index;
        }
      });
      const itemClone = JSON.parse(JSON.stringify(this.items[clickedIndex]));
      itemClone.selected = !itemClone.selected;
      this.items.splice(clickedIndex, 1, itemClone);
    },
    toggleDropdown(state) {
      if (state === false) {
        this.filter = '';
      }
      this.active = state;
    },
    clearSelection() {
      this.selectedIds.forEach(this.toggleItem);
    },
    focus(index, withKeyboard) {
      this.focused = Math.max(Math.min(this.filteredItems.length - 1, index), -1);

      if (!withKeyboard) return;

      const optionListEl = this.$el.lastChild;
      const focusedPosition = this.focused * ITEM_HEIGHT;

      if (focusedPosition < optionListEl.scrollTop) {
        optionListEl.scrollTop -= ITEM_HEIGHT;
      } else if (focusedPosition > optionListEl.scrollTop + ((ITEM_COUNT - 1) * ITEM_HEIGHT)) {
        optionListEl.scrollTop += ITEM_HEIGHT;
      }
    },
  },
};
</script>
