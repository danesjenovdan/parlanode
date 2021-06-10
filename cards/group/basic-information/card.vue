<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <div class="poslanec osnovne-informacije-poslanca">
      <div
        v-for="(person, index) in group.presidents"
        :key="person.slug"
        class="row"
      >
        <div class="parlaicon-container parlaicon-containermp">
          <span
            :class="['parlaicon', 'parlaicon-vodja']"
            aria-hidden="true"
          ></span>
        </div>
        <div class="bordertop">
          <div class="verticalmember">
            <div class="row">
              <a :href="getPersonLink(person)" :title="person.name">
                <img
                  :src="getPersonPortrait(person)"
                  class="img-circle img-responsive"
                  alt=""
                />
              </a>
              <div class="member_data">
                <h3>
                  <a
                    :href="getPersonLink(person)"
                    class="funblue-light-hover"
                    >{{ person.name }}</a
                  >
                </h3>
                <h4
                  v-if="index === 0 && person.preferred_pronoun === 'she'"
                  v-t="'party-leader--f'"
                ></h4>
                <h4 v-else-if="index === 0" v-t="'party-leader--m'"></h4>
                <h4
                  v-else-if="person.preferred_pronoun === 'she'"
                  v-t="'deputy-leader--f'"
                ></h4>
                <h4 v-else v-t="'deputy-leader--m'"></h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-for="(person, index) in group.deputies"
        :key="person.slug"
        class="row"
      >
        <div class="parlaicon-container parlaicon-containermp">
          <span
            :class="['parlaicon', 'parlaicon-namestnik']"
            aria-hidden="true"
          ></span>
        </div>
        <div class="bordertop">
          <div class="verticalmember">
            <div class="row">
              <a :href="getPersonLink(person)" :title="person.name">
                <img
                  :src="getPersonPortrait(person)"
                  class="img-circle img-responsive"
                  alt=""
                />
              </a>
              <div class="member_data">
                <h3>
                  <a
                    :href="getPersonLink(person)"
                    class="funblue-light-hover"
                    >{{ person.name }}</a
                  >
                </h3>
                <h4
                  v-if="index === 0 && person.preferred_pronoun === 'she'"
                  v-t="'party-leader--f'"
                ></h4>
                <h4 v-else-if="index === 0" v-t="'party-leader--m'"></h4>
                <h4
                  v-else-if="person.preferred_pronoun === 'she'"
                  v-t="'deputy-leader--f'"
                ></h4>
                <h4 v-else v-t="'deputy-leader--m'"></h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-sedezi" aria-hidden="true"></span>
        </div>
        <div class="bordertop0">
          <span class="key">
            <span v-t="'number-of-seats'"></span>:
            <strong>{{ group.number_of_members }}</strong>
          </span>
        </div>
      </div>

      <div class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-kontakt" aria-hidden="true"></span>
        </div>
        <div class="bordertop0 contact-container">
          <span class="key">
            <span v-t="'contact'"></span>:
            <a
              :href="`mailto:${group.email}`"
              target="_blank"
              class="funblue-light-hover"
              >{{ shortEmail }}</a
            >
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
            <template v-if="group.social_networks?.length">
              <template
                v-for="social_network in group.social_networks"
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
import common from '@/_mixins/common.js';
import { partyOverview } from '@/_mixins/contextUrls.js';
import { partyTitle } from '@/_mixins/titles.js';
import { partyHeader } from '@/_mixins/altHeaders.js';
import { partyOgImage } from '@/_mixins/ogImages.js';
import links from '@/_mixins/links.js';

export default {
  name: 'CardGroupBasicInformation',
  components: {},
  mixins: [common, partyOverview, partyTitle, partyHeader, partyOgImage, links],
  data() {
    return {
      group: this.cardData.data?.results || {},
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.group.id}?altHeader=true`;
    },
    shortEmail() {
      if (this.group.email?.length) {
        if (this.group.email.length < 26) {
          return this.group.email;
        }
        const [addr, domain] = this.group.email?.split('@');
        if (addr.length < 18) {
          return this.group.email;
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
  max-height: $full-card-height;

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
</style>
