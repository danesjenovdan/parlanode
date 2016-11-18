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
      :placeholder="placeholder">
    <ul :class="['search-dropdown-options', { visible: this.active }]">
      <li
        v-for="item in filteredItems"
        :class="{ 'selected' : item.selected }"
        @click="toggleItem(item.id)">
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filter: '',
      active: false
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
            return a.label.localeCompare(b.label)
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
    }
  }
}
</script>
