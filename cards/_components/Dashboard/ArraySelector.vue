<template>
  <p-search-dropdown v-model="mappedOptions" :single="single" :small="small" />
</template>

<script>
import PSearchDropdown from '@/_components/SearchDropdown.vue';

export default {
  name: 'DashboardArraySelector',
  components: {
    PSearchDropdown,
  },
  props: {
    value: {
      type: Array,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    single: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    mappedOptions: {
      get() {
        return this.options.map((opt) => ({
          id: opt.id,
          label: opt.name,
          selected: this.value.indexOf(opt.name) !== -1,
        }));
      },
      set(newOptions) {
        const newValues = newOptions
          .filter((opt) => opt.selected)
          .map((opt) => opt.label);
        if (this.single) {
          // delete all
          this.value.splice(0, this.value.length);
        } else {
          // delete old values
          for (let i = this.value.length - 1; i >= 0; i -= 1) {
            const val = this.value[i];
            if (newValues.indexOf(val) === -1) {
              this.value.splice(i, 1);
            }
          }
        }
        // add new values
        newValues.forEach((val) => {
          if (this.value.indexOf(val) === -1) {
            this.value.push(val);
          }
        });
        // emit new value
        this.$emit('input', this.value);
      },
    },
  },
};
</script>
