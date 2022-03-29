<template>
  <scroll-shadow ref="shadow">
    <div
      id="membership-list"
      :class="{ 'no-tabs': noTabs }"
      @scroll="$refs.shadow.check($event.currentTarget)"
    >
      <empty-state v-if="!contents?.length" small />
      <ul v-else class="membership-list">
        <template v-if="contents.length">
          <li
            v-for="membershipItem in contents"
            :key="membershipItem?.name"
            class="key"
          >
            <template v-if="name === 'Delovna telesa'">
              {{ membershipItem?.name }}
            </template>
            <a
              v-else-if="membershipItem?.url != null"
              :href="membershipItem?.url"
              class="funblue-light-hover"
              target="_blank"
              >{{ membershipItem?.name }}</a
            >
            <template v-else>{{ membershipItem?.name }}</template>
          </li>
        </template>
      </ul>
    </div>
  </scroll-shadow>
</template>

<script>
import ScrollShadow from '@/_components/ScrollShadow.vue';
import EmptyState from '@/_components/EmptyState.vue';

export default {
  name: 'MembershipList',
  components: {
    ScrollShadow,
    EmptyState,
  },
  props: {
    name: {
      type: String,
      default: '',
    },
    contents: {
      type: Array,
      default: () => [],
    },
    noTabs: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
#membership-list {
  height: 125px;
  overflow-y: auto;

  &.no-tabs {
    height: 180px;
  }
}

.membership-list {
  margin: 0;
  padding: 0;
  list-style: none;

  .key {
    line-height: 1.3em;
    margin: 4px 0;
    text-align: left;
    width: 100%;
  }
}
</style>
