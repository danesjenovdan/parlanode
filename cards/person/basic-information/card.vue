<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <div class="poslanec osnovne-informacije-poslanca">
      <div class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-skupina" aria-hidden="true"></span>
        </div>
        <div class="bordertop0">
          <span class="key">
            <span v-t="'party'"></span>:
            <a :href="getPartyLink(group)" class="funblue-light-hover">
              {{ group.acronym || group.name || 'N/A' }}
            </a>
          </span>
        </div>
      </div>

      <div class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-delaza" aria-hidden="true"></span>
        </div>
        <div class="bordertop0">
          <i18n-t :keypath="electedToDistrictKey" tag="span" class="key">
            <template #numVotes>
              <b>{{ person.number_of_points || person.number_of_voters }}</b>
            </template>
            <template #district>
              <b>{{ person?.districts?.map((d) => d.name).join(', ') }}</b>
            </template>
          </i18n-t>
        </div>
      </div>

      <div class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-mandat" aria-hidden="true"></span>
        </div>
        <div class="bordertop0">
          <span class="key">
            <span v-t="'number-of-terms'"></span>:
            <b>{{ person.number_of_mandates }}</b>
          </span>
        </div>
      </div>

      <div class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-status" aria-hidden="true"></span>
        </div>
        <div class="bordertop0">
          <span class="key">
            <span v-t="'previous-occupation'"></span>:
            <b>{{ person.previous_occupation }}</b>
          </span>
        </div>
      </div>

      <div class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-izobrazba" aria-hidden="true"></span>
        </div>
        <div class="bordertop0">
          <span class="key">
            <span v-t="'education'"></span>: <b>{{ person.education }}</b>
          </span>
        </div>
      </div>

      <div class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-starost" aria-hidden="true"></span>
        </div>
        <div class="bordertop0">
          <span class="key">
            <span v-t="'age'"></span>: <b>{{ $t('age--years', { age }) }}</b>
          </span>
        </div>
      </div>

      <div class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-omrezja" aria-hidden="true"></span>
        </div>
        <div class="bordertop0">
          <span class="key">
            <span v-t="'social-media'"></span>:
            <template v-if="person.social_networks?.length">
              <template
                v-for="social_network in person.social_networks"
                :key="`${social_network?.type}_${social_network?.url}`"
              >
                <a
                  :href="social_network?.url"
                  class="socialicon-container"
                  target="_blank"
                >
                  <div
                    :class="['parlaicon', `parlaicon-${social_network?.type}`]"
                  />
                </a>
              </template>
            </template>
            <template v-else>
              <b v-t="'no-social-media'"></b>
            </template>
          </span>
        </div>
      </div>
    </div>
  </card-wrapper>
</template>

<script>
import { parseISO, differenceInCalendarYears } from 'date-fns';
import common from '@/_mixins/common.js';
import { personOverview } from '@/_mixins/contextUrls.js';
import { personTitle } from '@/_mixins/titles.js';
import { personHeader } from '@/_mixins/altHeaders.js';
import { personOgImage } from '@/_mixins/ogImages.js';
import links from '@/_mixins/links.js';

export default {
  name: 'CardPersonBasicInformation',
  mixins: [
    common,
    personOverview,
    personTitle,
    personHeader,
    personOgImage,
    links,
  ],
  data() {
    return {
      person: this.cardData.data?.results ?? {},
      group: this.cardData.data?.results?.group ?? {},
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.person.id}?altHeader=true`;
    },
    age() {
      return differenceInCalendarYears(
        new Date(),
        parseISO(this.person.date_of_birth)
      );
    },
    electedToDistrictKey() {
      let suffix = '';
      if (this.person.preferred_pronoun === 'she') suffix = '--f';
      if (this.person.preferred_pronoun === 'he') suffix = '--m';
      if (this.person.number_of_points) {
        return `elected-to-district-with-points${suffix}`;
      }
      return `elected-to-district${suffix}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';
@import 'parlassets/scss/helper';
@import 'parlassets/scss/icons';

.parlaicon-omrezja {
  width: 30px;
  height: 30px;
  line-height: normal;
}

.parlaicon-container {
  padding: 10px 16px;
  @include respond-to(desktop) {
    min-width: 70px;
  }
}

.bordertop {
  border-top: 1px solid $background;
  padding: 10px 0;
  margin: 5px 0;
}

.bordertop0 {
  border-top: 1px solid $background;
  padding: 0;
  margin: 0;
}

.bordertop,
.bordertop0 {
  flex: 1;
}

.poslanec h3 {
  font-weight: 400;
}

.verticalmember {
  width: 100%;

  .member_data {
    text-align: left;
    h4 {
      margin: 5px 0;
    }
    a {
      color: $font-placeholder;
    }
  }

  .img-responsive {
    width: 40px;
    margin: 10px 15px 10px 0;
    @include respond-to(desktop) {
      margin-right: 25px;
    }
  }
}

.socialicon-container {
  margin-right: 10px;
}

.osnovne-informacije-poslanca {
  display: flex;
  flex-direction: column;
  height: 100%;

  .row {
    display: flex;
    flex: 1;
    margin: 0;
    min-height: 0; // firefox flex bug
    min-height: -moz-fit-content;
    min-height: fit-content;

    > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .key {
      color: $font-default;
    }
  }
}
</style>
