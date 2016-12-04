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
const ITEM_HEIGHT = 23
const ITEM_COUNT = 10

export default {
  data() {
    return {
      filter: '',
      active: false,
      focused: -1
    }
  },
  watch: {
    filter() {
      this.focus(this.focused);
    }
  },
  computed: {
    filteredItems() {
      var currentFilter = this.filter
      return this.items
        .filter(function(item) {
          return item.selected || item.label.toLowerCase().indexOf(currentFilter.toLowerCase()) > -1
        })
        .sort(function(a, b) {
          if (Boolean(a.selected) === Boolean(b.selected)) {
            return a.label.localeCompare(b.label, 'sl')
          }
          else {
            return a.selected && !b.selected ? -1 : 1
          }
        })
    },
    selectedIds() {
      return this.filteredItems
        .filter((item) => item.selected)
        .map((item) => item.id)
    }
  },
  directives: {
    clickOutside: {
      bind(el, binding) {
        const handler = function(e) {
          if (!el.contains(e.target) && el !== e.target) {
            binding.value(e)
          }
        }
        el.__vueClickOutside__ = handler
        document.addEventListener('click', handler)
      },
      unbind(el) {
        document.removeEventListener('click', el.__vueClickOutside__)
        el.__vueClickOutside__ = null
      }
    }
  },
  props: {
    items: { type: Array, required: true },
    placeholder: { type: String, required: true }
  },
  methods: {
    toggleItem(selectedItemId) {
      var clickedIndex = -1
      this.items.forEach(function(item, index) {
        if (item.id === selectedItemId) {
          clickedIndex = index
        }
      })
      var itemClone = JSON.parse(JSON.stringify(this.items[clickedIndex]))
      itemClone.selected = !itemClone.selected
      this.items.splice(clickedIndex, 1, itemClone)
    },
    toggleDropdown(state) {
      if (state === false) {
        this.filter = ''
      }
      this.active = state
    },
    clearSelection() {
      this.selectedIds.forEach(this.toggleItem)
    },
    focus(index, withKeyboard) {
      this.focused = Math.max(Math.min(this.filteredItems.length - 1, index), -1)

      if (!withKeyboard) return

      var optionListEl = this.$el.lastChild,
      focusedPosition = this.focused * ITEM_HEIGHT;

      if (focusedPosition < optionListEl.scrollTop) {
        optionListEl.scrollTop -= ITEM_HEIGHT
      }
      else if (focusedPosition > optionListEl.scrollTop + (ITEM_COUNT - 1) * ITEM_HEIGHT) {
        optionListEl.scrollTop += ITEM_HEIGHT
      }
    }
  }
}
</script>
