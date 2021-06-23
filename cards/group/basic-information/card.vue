<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig">
    <div class="poslanec osnovne-informacije-poslanca">
      <div v-if="results.presidents?.length" class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-vodja" aria-hidden="true" />
        </div>
        <div class="bordertop">
          <template v-for="person in results.presidents" :key="person.slug">
            <person-with-position :person="person" position="president" />
          </template>
        </div>
      </div>

      <div v-if="results.deputies?.length" class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-namestnik" aria-hidden="true" />
        </div>
        <div class="bordertop">
          <template v-for="person in results.deputies" :key="person.slug">
            <person-with-position :person="person" position="deputy" />
          </template>
        </div>
      </div>

      <div class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-sedezi" aria-hidden="true" />
        </div>
        <div class="bordertop">
          <span class="key">
            <span v-t="'number-of-seats'"></span>:
            <strong>{{ results.number_of_members }}</strong>
          </span>
        </div>
      </div>

      <div v-if="results.email" class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-kontakt" aria-hidden="true" />
        </div>
        <div class="bordertop contact-container">
          <span class="key">
            <span v-t="'contact'"></span>:
            <a
              :href="`mailto:${results.email}`"
              target="_blank"
              class="funblue-light-hover"
              >{{ shortEmail }}</a
            >
          </span>
        </div>
      </div>

      <div v-if="results.social_networks?.length" class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-omrezja" aria-hidden="true" />
        </div>
        <div class="bordertop">
          <span class="key">
            <span v-t="'social-media'"></span>:
            <template v-if="results.social_networks?.length">
              <template
                v-for="social_network in results.social_networks"
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

      <div v-if="results.members?.length" class="row">
        <div class="parlaicon-container parlaicon-top">
          <span class="parlaicon parlaicon-clanstva" aria-hidden="true" />
        </div>
        <div class="bordertop">
          <template v-for="person in results.members" :key="person.slug">
            <person-with-position :person="person" position="member" />
          </template>
        </div>
      </div>
    </div>
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { partyOverview } from '@/_mixins/contextUrls.js';
import { partyTitle } from '@/_mixins/titles.js';
import { partyHeader } from '@/_mixins/altHeaders.js';
import { partyOgImage } from '@/_mixins/ogImages.js';
import links from '@/_mixins/links.js';
import PersonWithPosition from '@/_components/PersonWithPosition.vue';

export default {
  name: 'CardGroupBasicInformation',
  components: {
    PersonWithPosition,
  },
  mixins: [common, partyOverview, partyTitle, partyHeader, partyOgImage, links],
  data() {
    return {
      results: this.cardData.data?.results || {},
      group: this.cardData.data?.group || {},
    };
  },
  computed: {
    shortEmail() {
      if (this.results.email?.length) {
        if (this.results.email.length < 26) {
          return this.results.email;
        }
        const [addr, domain] = this.results.email?.split('@');
        if (addr.length < 18) {
          return this.results.email;
        }
        return `${addr.slice(0, 17)}…@${domain}`;
      }
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';
@import 'parlassets/scss/helper';
@import 'parlassets/scss/icons';

.parlaicon-vodja {
  background-image: url('#{get-parlassets-url()}/icons/vodja.svg');
}
.parlaicon-namestnik {
  background-image: url('#{get-parlassets-url()}/icons/namestnik.svg');
}
.parlaicon-sedezi {
  background-image: url('#{get-parlassets-url()}/icons/sedezi.svg');
}
.parlaicon-kontakt {
  background-image: url('#{get-parlassets-url()}/icons/kontakt.svg');
}
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

  &.parlaicon-top {
    justify-content: flex-start !important;
    padding-top: 27px;
  }
}

.bordertop {
  border-top: 1px solid $background;
  padding: 10px 0;
  flex: 1;
}

.poslanec {
  padding: 0;
}

.socialicon-container {
  margin-right: 10px;
}

.osnovne-informacije-poslanca {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: $full-card-height;
  overflow-y: auto;

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

.contact-container {
  overflow: hidden;

  .key {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.person-list .person {
  flex-wrap: wrap;

  .column.portrait {
    margin: 0 8px 8px 0;

    img {
      width: 40px;
      height: 40px;
    }
  }
}
</style>
