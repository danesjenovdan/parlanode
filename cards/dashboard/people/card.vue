<template>
  <div>
    <dash-wrapper :id="$options.cardData.cardData._id">
      <div id="dash-people-list">
        <div v-if="people != null">
          <input
            id="mpsOnly"
            v-model="mpsOnly"
            type="checkbox"
            class="checkbox"
          >
          <label for="mpsOnly">{{ $t('only-mps') }}</label>
        </div>
        <dash-table
          :items="mappedItems"
          :columns="columns"
          :paginate="50"
        >
          <template slot="item-col" slot-scope="{ column, index }">
            <template v-if="index === 0">
              <img :src="getPersonPortrait(column.person)" class="img-circle person-portrait">
              <span class="person-name">{{ column.person.name }}</span>
            </template>
            <template v-if="index === 1">
              <dash-button @click="openInfoModal(column.person)">
                {{ $t('edit-info') }}
              </dash-button>
            </template>
            <template v-if="index === 2">
              <dash-button @click="openTfidfModal(column.person)">
                TFIDF
              </dash-button>
            </template>
            <template v-if="(index === 3)">
              <dash-button @click="openMembershipsModal(column.person)">
                {{ $t('edit-memberships') }}
              </dash-button>
            </template>
          </template>
        </dash-table>
        <div v-if="error">Error: {{ error.message }}</div>
        <div v-else-if="people === null" class="nalagalnik"></div>
      </div>
    </dash-wrapper>
    <dash-fancy-modal
      v-if="tfidfModalOpen && tfidfModalData"
      :data="tfidfModalData"
      @closed="closeTfidfModal"
    >
      <template slot="modal-data" slot-scope="{ loadedData }">
        <modal-content-tfidf :data="loadedData.data" />
      </template>
    </dash-fancy-modal>
    <dash-fancy-modal
      v-if="infoModalOpen && infoModalData"
      :data="infoModalData"
      @closed="closeInfoModal"
    >
      <template slot="modal-data" slot-scope="{ loadedData }">
        <modal-content-person-info :loaded-data="loadedData" />
      </template>
    </dash-fancy-modal>
    <dash-fancy-modal
      v-if="membershipsModalOpen && membershipsModalData"
      :data="membershipsModalData"
      @closed="closeMembershipsModal"
    >
      <template slot="modal-data" slot-scope="{ loadedData }">
        <modal-content-person-memberships :loaded-data="loadedData" />
      </template>
    </dash-fancy-modal>
  </div>
</template>

<script>
import { assign, sortBy, zip, groupBy, map } from 'lodash';
import common from 'mixins/common';
import links from 'mixins/links';
import DashWrapper from 'components/Dashboard/Wrapper.vue';
import DashTable from 'components/Dashboard/Table.vue';
import DashButton from 'components/Dashboard/Button.vue';
import DashFancyModal from 'components/Dashboard/FancyModal.vue';
import ModalContentTfidf from 'components/Dashboard/ModalContentTfidf.vue';
import ModalContentPersonInfo from 'components/Dashboard/ModalContentPersonInfo.vue';
import ModalContentPersonMemberships from 'components/Dashboard/ModalContentPersonMemberships.vue';
import parlapi from 'mixins/parlapi';

export default {
  name: 'DashboardPeople',
  components: {
    DashWrapper,
    DashTable,
    DashButton,
    DashFancyModal,
    ModalContentTfidf,
    ModalContentPersonInfo,
    ModalContentPersonMemberships,
  },
  mixins: [
    common,
    links,
    parlapi,
  ],
  data() {
    return {
      mpsOnly: true,
      people: null,
      tfidfModalOpen: false,
      tfidfModalData: null,
      infoModalOpen: false,
      infoModalData: null,
      membershipsModalOpen: false,
      membershipsModalData: null,
      error: null,
    };
  },
  computed: {
    columns() {
      return [
        { id: 'name', label: this.$t('name') },
        { id: 'info', label: 'INFO' },
        { id: 'tfidf', label: 'TFIDF' },
        { id: 'memberships', label: this.$t('edit-memberships') },
      ];
    },
    mappedItems() {
      if (this.people) {
        return this.people.map(person => [
          { person },
          { person },
          { person },
          { person },
        ]);
      }
      return [];
    },
  },
  watch: {
    mpsOnly() {
      this.fetchPeople();
    },
  },
  mounted() {
    this.fetchPeople();
  },
  methods: {
    fetchPeople() {
      this.people = null;
      this.error = null;

      (
        this.mpsOnly
          ? this.$parlapi.getPeopleMpsOnly()
          : this.$parlapi.getPeople()
      )
        .then((people) => {
          this.people = sortBy(people.data.results, ['name']);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          this.error = error;
        });
    },
    openTfidfModal(person) {
      this.tfidfModalData = {
        title: `TFIDF - ${person.name}`,
        loadData: async () => {
          const data = await this.$parlapi.getPersonTFIDF(person.id);
          const tfidf = data.data.results.length && data.data.results[0];
          return {
            id: tfidf.id,
            data: tfidf.data,
          };
        },
        saveData: tfidf => this.$parlapi.patchPersonTFIDF(tfidf.id, tfidf),
      };
      this.tfidfModalOpen = true;
    },
    closeTfidfModal() {
      this.tfidfModalData = null;
      this.tfidfModalOpen = false;
    },
    openInfoModal(person) {
      this.infoModalData = {
        title: `INFO - ${person.name}`,
        loadData: async () => {
          const socialLinks = await this.$parlapi.getPersonSocialLinks(person.id);
          const facebook = socialLinks.data.results.filter(link => link.tags.indexOf('fb') !== -1);
          const twitter = socialLinks.data.results.filter(link => link.tags.indexOf('tw') !== -1);
          return {
            person: {
              name: person.name,
              honorific_prefix: person.honorific_prefix,
              given_name: person.given_name,
              additional_name: person.additional_name,
              patronymic_name: person.patronymic_name,
              family_name: person.family_name,
              honorific_suffix: person.honorific_suffix,
              voters: person.voters,
              mandates: person.mandates,
              previous_occupation: person.previous_occupation,
              education: person.education,
              education_level: person.education_level,
              districts: person.districts,
              birth_date: person.birth_date,
              gov_id: person.gov_id,
            },
            socials: {
              facebook: facebook.map(e => e.url).join('\n'),
              twitter: twitter.map(e => e.url).join('\n'),
            },
          };
        },
        saveData: async (personInfo) => {
          const mapSocialUrls = (urls, tag, note) => urls
            .split('\n')
            .map(url => url.trim())
            .filter(Boolean)
            .map(url => ({
              tags: ['social', tag],
              url,
              note,
              name: '',
              person: person.id,
            }));

          const socialLinks = await this.$parlapi.getPersonSocialLinks(person.id);
          const fbs = socialLinks.data.results.filter(link => link.tags.indexOf('fb') !== -1);
          const tws = socialLinks.data.results.filter(link => link.tags.indexOf('tw') !== -1);

          const newFbs = mapSocialUrls(personInfo.socials.facebook, 'fb', 'FB');
          const newTws = mapSocialUrls(personInfo.socials.twitter, 'tw', 'TW');

          const updateLink = async ([link, newLink]) => {
            if (link && newLink) {
              assign(link, newLink);
              await this.$parlapi.patchLink(link.id, link);
            } else if (link) {
              await this.$parlapi.deleteLink(link.id);
            } else if (newLink) {
              const linkRes = await this.$parlapi.postLink(newLink);
              newLink.id = linkRes.data.id;
            }
          };

          await Promise.all(zip(fbs, newFbs).map(updateLink));
          await Promise.all(zip(tws, newTws).map(updateLink));

          assign(person, personInfo.person);
          return this.$parlapi.patchPerson(person.id, person);
        },
      };
      this.infoModalOpen = true;
    },
    closeInfoModal() {
      this.infoModalData = null;
      this.infoModalOpen = false;
    },
    openMembershipsModal(person) {
      this.membershipsModalData = {
        title: `${this.$t('edit-memberships')} - ${person.name}`,
        loadData: async () => {
          const orgs = await this.$parlapi.getAllOrganisations();
          const membershipsData = await this.$parlapi.getPersonMemberships(person.id);
          const memberships = sortBy(membershipsData.data.results, ['start_time']);
          return {
            orgs: sortBy(orgs.data.results, ['_name']),
            org_groups: map(groupBy(orgs.data.results, 'classification'), (val, key) => ({
              label: key,
              items: val.map(o => o.id),
            })),
            memberships: memberships.map((membership) => {
              const start = membership.start_time ? membership.start_time.split('T') : ['', ''];
              const end = membership.end_time ? membership.end_time.split('T') : ['', ''];
              return {
                id: membership.id,
                start_date: start[0],
                start_time: start[1],
                end_date: end[0],
                end_time: end[1],
                organization: membership.organization,
                on_behalf_of: membership.on_behalf_of,
                label: membership.label,
                role: membership.role,
              };
            }),
          };
        },
        saveData: async (loadedData) => {
          // eslint-disable-next-line no-restricted-syntax
          for (const m of loadedData.memberships) {
            const startTime = (m.start_date && m.start_time) ? `${m.start_date}T${m.start_time}` : null;
            const endTime = (m.end_date && m.end_time) ? `${m.end_date}T${m.end_time}` : null;
            const membership = {
              start_time: startTime,
              end_time: endTime,
              organization: m.organization,
              on_behalf_of: m.on_behalf_of,
              label: m.label,
              role: m.role,
              person: person.id,
            };
            if (m.id) {
              // eslint-disable-next-line no-await-in-loop
              await this.$parlapi.patchMembership(m.id, membership);
            } else {
              // eslint-disable-next-line no-await-in-loop
              const mRes = await this.$parlapi.postMembership(membership);
              m.id = mRes.data.id;
            }
          }
        },
      };
      this.membershipsModalOpen = true;
    },
    closeMembershipsModal() {
      this.membershipsModalData = null;
      this.membershipsModalOpen = false;
    },
  },
};
</script>

<style lang="scss" scoped>
#dash-people-list /deep/ {
  .table-contents,
  .table-headers {
    .table-row {
      .table-col:nth-child(1) {
        justify-content: flex-start;
        flex-direction: row;
        flex-grow: 1.5;
      }
    }
  }
}

.person-portrait {
  width: 39px;
  height: 39px;
}

.person-name {
  margin-left: 15px;
}
</style>
