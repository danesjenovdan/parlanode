<template>
  <div>
    <ul class="blue-button-list">
      <li
        v-for="item in items"
        :key="item.id"
        :class="[
          'blue-button-list-item',
          { 'is-selected': item.id === value },
        ]"
        @click="$emit('input', item.id)">
        {{ item.label }}
      </li>
    </ul>
    <div class="blue-button-list-mobile">
      <label>Izberi analizo</label>
      <div class="select">
        <select
          @change="changeSelection">
          <option
            v-for="item in items"
            :key="item.id"
            :value="item.id"
            :selected="item.id === value">
            {{ item.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    value: String,
  },
  methods: {
    changeSelection(event) {
      this.$emit('input', event.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';
@import '~parlassets/scss/colors';

.blue-button-list {
  @include show-for(desktop, flex);
  list-style: none;
  margin: 14px 0;
  padding: 0;

  &-item {
    align-items: center;
    background-color: #227497;
    border: 1px solid $grey-medium;
    box-sizing: border-box;
    color: $white;
    display: flex;
    font-size: 10px;
    height: 61px;
    line-height: 16px;
    margin-right: 3px;
    padding: 0 12px;
    text-transform: uppercase;

    @include respond-to(limbo) { font-size: 12px; }

    &.is-selected {
      background-color: $funblue;
      color: $white;
      &:hover {
        cursor: default;
        background-color: $funblue;
      }
    }

    &:last-child { margin-right: 0; }

    &:hover {
      background-color: $funblue-hover;
      color: $white;
      cursor: pointer;
    }
  }

  &-mobile {
    @include show-for(mobile, block);

    label {
      font-size: 11px;
      width: 100%;
    }

    .select {
      width: 100%;
      select { width: 100%; }
    }
  }


}
</style>
