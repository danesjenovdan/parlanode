<template>
  <card-wrapper :header-config="headerConfig" max-height>
    <div class="agenda-items">
      <div class="agenda-item-headers">
        <div>{{ $t('agenda-items') }}</div>
        <div>{{ $t('material') }}</div>
      </div>
      <div
        v-for="agendaItem in agendaItems"
        :key="agendaItem.id"
        class="agenda-item"
      >
        <div class="name">{{ agendaItem.name }}</div>
        <div class="material">
          <div v-for="link in agendaItem.documents" :key="link.id" class="link">
            <a :href="link.url" class="funblue-light-hover" target="_blank">
              {{ link.name }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="agenda-links">
      <div v-for="link in documents" :key="link.id" class="link">
        <a
          :href="link.url"
          class="nav-icon nav-icon-transcripts"
          target="_blank"
        >
          {{ link.name }}
        </a>
      </div>
    </div>
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { defaultHeaderConfig } from '@/_mixins/altHeaders.js';
import { defaultOgImage } from '@/_mixins/ogImages.js';
import { sessionAgendaContextUrl } from '@/_mixins/contextUrls.js';

export default {
  name: 'CardSessionAgendaItems',
  mixins: [common, sessionAgendaContextUrl],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const { cardData } = this.$root.$options.contextData;

    return {
      session: cardData?.data?.session || {},
      agendaItems: cardData?.data?.results?.agenda_items || [],
      documents: cardData?.data?.results?.documents || [],
      headerConfig: defaultHeaderConfig(this),
      ogConfig: defaultOgImage(this),
    };
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

.agenda-items {
  .agenda-item-headers,
  .agenda-item {
    display: flex;

    > div {
      flex: 1;
      padding: 0 15px;
    }
  }

  .agenda-item-headers {
    color: $font-default;
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .agenda-item {
    background: $background;
    margin: 12px 0;

    > div {
      padding: 15px;

      &:nth-child(2) {
        border-left: 2px solid $font-placeholder;
      }
    }

    .name {
      font-size: 14px;
      line-height: 20px;
      font-weight: 300;
      font-family: 'Roboto Slab', serif;
    }

    .material {
      .link {
        display: block;

        &:not(:last-child) {
          margin-bottom: 14px;
        }
      }
    }
  }
}

.agenda-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 16px 0;

  .link {
    display: block;

    a {
      display: block;
      font-size: 16px;
      font-weight: 300;
      line-height: 30px;
      padding: 10px 30px;
      color: $white;
      border: none;
      background-color: $tab-passive;

      &:hover {
        color: $white;
        background-color: $tab-hover;
        text-decoration: none;
      }

      @include respond-to(mobile) {
        font-size: 14px;
        padding: 6px 16px;
      }
    }

    .nav-icon {
      background-size: 24px 100%;
      background-repeat: no-repeat;
      background-position: 24px center;
      padding-left: 60px;

      @include respond-to(mobile) {
        padding-left: 40px;
        background-size: 18px 100%;
        background-position: 14px center !important;
      }
    }

    .nav-icon-transcripts {
      background-image: url('#{get-parlassets-url()}/icons/navigation/transcripts.svg');
      background-size: 29px 100%;
      background-position: 21px center;

      @include respond-to(mobile) {
        background-size: 22px 100%;
      }
    }
  }
}
</style>
