<template>
  <li class="person-speech">
    <div class="person-container">
      <div class="name">
        <a
          :href="getSessionAgendaLink(agendaItem, agendaItem.session)"
          class="funblue-light-hover"
          >{{ agendaItem.name }}</a
        >
      </div>
    </div>
    <div class="speech">
      <!-- eslint-disable vue/no-v-html -->
      <a
        :href="getSessionAgendaLink(agendaItem, agendaItem.session)"
        class="funblue-light-hover"
        v-html="agendaItem.content"
      ></a>
      <!-- eslint-enable vue/no-v-html -->
    </div>
  </li>
</template>

<script>
import links from '@/_mixins/links.js';

export default {
  mixins: [links],
  props: {
    agendaItem: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

.person-speech {
  border-bottom: 1px solid $background;
  padding: 15px 0;
  list-style: none;
  display: flex;
  align-items: center;

  @include respond-to(mobile) {
    flex-wrap: wrap;
  }

  &:last-child {
    border-bottom: 0;
  }

  .person-container {
    flex: 2;
    display: flex;
    @include respond-to(mobile) {
      flex-grow: 1;
      flex-shrink: 0;
      flex-basis: 100%;
    }

    .name {
      text-align: left;
      font-size: 14px;
      font-weight: 300;
      padding-right: 10p;
      margin: 0 5px 0 15px;
      flex: 1;
      align-self: center;
      a {
        text-decoration: none;
      }
    }
  }

  .speech {
    flex: 4;
    margin-right: 20px;
    padding-right: 5px;

    @include respond-to(mobile) {
      padding-top: 10px;
    }

    a {
      color: $font-default;
      margin: 0;
      font-size: 14px;
      line-height: 20px;
      font-weight: 300;
      font-family: 'Roboto Slab', serif;
      padding: 0.15em 0.3em;
      -webkit-box-decoration-break: clone;
      box-decoration-break: clone;
    }

    :deep(em) {
      font-style: normal;
      font-weight: 400;
    }
  }
}
</style>
