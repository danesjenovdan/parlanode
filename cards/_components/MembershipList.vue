<template>
  <scroll-shadow ref="shadow">
    <div id="membership-list" @scroll="$refs.shadow.check($event.currentTarget)">
      <ul class="membership-list">
        <template v-if="contents.length">
          <li
            v-for="membershipItem in contents"
            :key="membershipItem.name"
            class="key"
          >
            <template v-if="name === 'Delovna telesa'">
              {{ membershipItem.name }}
            </template>
            <a
              v-else-if="membershipItem.url != null"
              :href="membershipItem.url"
              class="funblue-light-hover"
              target="_blank"
            >{{ membershipItem.name }}</a>
            <template v-else>{{ membershipItem.name }}</template>
          </li>
        </template>
        <div v-else class="no-results"><i v-t="'membership-list.no-memberships'"></i></div>
      </ul>
    </div>
  </scroll-shadow>
</template>

<script>
import ScrollShadow from 'components/ScrollShadow.vue';

export default {
  name: 'MembershipList',
  components: {
    ScrollShadow,
  },
  props: {
    name: String,
    contents: Array,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
#membership-list {
  padding: 6px 0;
  height: 123px;
  overflow-y: auto;
  margin-top: 6px;
}

.membership-list {
  padding: 0;
  list-style: none;

  .key {
    line-height: 1.3em;
    padding: 4px 0 4px 4px;
    text-align: left;
    width: 100%;
  }
}
</style>
