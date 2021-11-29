<template>
  <card-wrapper :header-config="headerConfig" max-height>
    <div class="media-reports">
      <div class="media-report-headers">
        <div>{{ $t('media') }}</div>
        <div>{{ $t('media-reports') }}</div>
      </div>
      <div
        v-for="medium in Object.keys(groupedReports)"
        :key="medium"
        class="media-report"
      >
        <div class="name">{{ groupedReports[medium][0].medium.name }}</div>
        <div class="material">
          <div
            v-for="report in groupedReports[medium]"
            :key="report.url"
            class="link"
          >
            <a :href="report.url" class="funblue-light-hover" target="_blank">
              {{ report.title }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { personOverviewContextUrl } from '@/_mixins/contextUrls.js';
import { personTitle } from '@/_mixins/titles.js';
import { personHeader } from '@/_mixins/altHeaders.js';
import { personOgImage } from '@/_mixins/ogImages.js';

import { groupBy } from 'lodash-es';

export default {
  name: 'CardPersonMediaReports',
  mixins: [
    common,
    personOverviewContextUrl,
    personTitle,
    personHeader,
    personOgImage,
  ],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const { cardData } = this.$root.$options.contextData;

    return {
      mediaReports: cardData?.data?.results || [],
    };
  },
  computed: {
    groupedReports() {
      return groupBy(this.mediaReports, (report) => report.medium.url);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

.media-reports {
  .media-report-headers,
  .media-report {
    display: flex;

    > div {
      flex: 1;
      padding: 0 15px;
    }
  }

  .media-report-headers {
    color: $font-default;
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .media-report {
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
