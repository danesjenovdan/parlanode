<template>
  <div>
    <dash-wrapper :id="$root.$options.cardData.mountId">
      <div id="dash-organisations-list">
        <div v-if="orgs != null">
          <input
            id="partiesOnly"
            v-model="partiesOnly"
            type="checkbox"
            class="checkbox"
          >
          <label for="partiesOnly">{{ $t('only-parties') }}</label>
        </div>
        <dash-table
          :items="mappedItems"
          :columns="columns"
          :paginate="50"
        >
          <template slot="item-col" slot-scope="{ column, index }">
            <template v-if="index === 0">
              {{ column.org._name }} ({{ column.org._acronym }})
            </template>
            <template v-if="index === 1">
              <dash-button @click="openInfoModal(column.org)">
                {{ $t('edit-info') }}
              </dash-button>
            </template>
            <template v-if="(index === 2) && (column.org.classification === 'pg')">
              <dash-button @click="openTfidfModal(column.org)">
                TFIDF
              </dash-button>
            </template>
            <template v-if="(index === 3)">
              <dash-button @click="openMembershipsModal(column.org)">
                {{ $t('edit-memberships') }}
              </dash-button>
            </template>
          </template>
        </dash-table>
        <div v-if="orgs != null">
          <dash-button @click="addOrganisation">
            {{ $t('add-organization') }}
          </dash-button>
        </div>
        <div v-if="error">Error: {{ error.message }}</div>
        <div v-else-if="orgs == null" class="nalagalnik"></div>
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
        <modal-content-organisation-info :loaded-data="loadedData" />
      </template>
    </dash-fancy-modal>
    <dash-fancy-modal
      v-if="membershipsModalOpen && membershipsModalData"
      :data="membershipsModalData"
      @closed="closeMembershipsModal"
    >
      <template slot="modal-data" slot-scope="{ loadedData }">
        <modal-content-organisation-memberships :loaded-data="loadedData" />
      </template>
    </dash-fancy-modal>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import { assign, sortBy, zip, groupBy, map } from 'lodash';
import common from 'mixins/common';
import DashWrapper from 'components/Dashboard/Wrapper.vue';
import DashTable from 'components/Dashboard/Table.vue';
import DashButton from 'components/Dashboard/Button.vue';
import DashFancyModal from 'components/Dashboard/FancyModal.vue';
import ModalContentTfidf from 'components/Dashboard/ModalContentTfidf.vue';
import ModalContentOrganisationInfo from 'components/Dashboard/ModalContentOrganisationInfo.vue';
import ModalContentOrganisationMemberships from 'components/Dashboard/ModalContentOrganisationMemberships.vue';
import parlapi from 'mixins/parlapi';

export default {
  name: 'DashboardOrgs',
  components: {
    DashWrapper,
    DashTable,
    DashButton,
    DashFancyModal,
    ModalContentTfidf,
    ModalContentOrganisationInfo,
    ModalContentOrganisationMemberships,
  },
  mixins: [
    common,
    parlapi,
  ],
  data() {
    return {
      partiesOnly: true,
      orgs: null,
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
      if (this.orgs) {
        return this.orgs.map(org => [
          { org },
          { org },
          { org },
          { org },
        ]);
      }
      return [];
    },
  },
  watch: {
    partiesOnly() {
      this.fetchOrgs();
    },
  },
  mounted() {
    this.fetchOrgs();
  },
  methods: {
    fetchOrgs() {
      this.orgs = null;
      this.error = null;

      (
        this.partiesOnly
          ? this.$parlapi.getParties()
          : this.$parlapi.getAllOrganisations()
      )
        .then((orgs) => {
          this.orgs = sortBy(orgs.data.results, ['_name']);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          this.error = error;
        });
    },
    openTfidfModal(org) {
      this.tfidfModalData = {
        title: `TFIDF - ${org._name}`,
        loadData: async () => {
          const data = await this.$parlapi.getOrganisationTFIDF(org.id);
          const tfidf = data.data.results.length && data.data.results[0];
          return {
            id: tfidf.id,
            data: tfidf.data,
          };
        },
        saveData: tfidf => this.$parlapi.patchOrganisationTFIDF(tfidf.id, tfidf),
      };
      this.tfidfModalOpen = true;
    },
    closeTfidfModal() {
      this.tfidfModalData = null;
      this.tfidfModalOpen = false;
    },
    openInfoModal(org) {
      this.infoModalData = {
        title: `INFO - ${org._name}`,
        loadData: async () => {
          const orgs = await this.$parlapi.getAllOrganisations();

          const links = await this.$parlapi.getOrganisationSocialLinks(org.id);
          const facebook = links.data.results.filter(link => link.tags.indexOf('fb') !== -1);
          const twitter = links.data.results.filter(link => link.tags.indexOf('tw') !== -1);

          const contacts = await this.$parlapi.getOrganisationContactEmails(org.id);
          const emails = contacts.data.results || [];

          const dissolution = org.dissolution_date ? org.dissolution_date.split('T') : ['', ''];

          return {
            org: {
              _name: org._name,
              _acronym: org._acronym,
              classification: org.classification,
              voters: org.voters,
              gov_id: org.gov_id,
              parent: org.parent,
              name_parser: org.name_parser,
              dissolution_date: dissolution[0],
              dissolution_time: dissolution[1],
            },
            orgs: orgs.data.results,
            org_groups: map(groupBy(orgs.data.results, 'classification'), (val, key) => ({
              label: key,
              items: val.map(o => o.id),
            })),
            socials: {
              facebook: facebook.map(e => e.url).join('\n'),
              twitter: twitter.map(e => e.url).join('\n'),
            },
            contacts: {
              emails: emails.map(e => e.value).join('\n'),
            },
          };
        },
        saveData: async (orgInfo) => {
          const mapSocialUrls = (urls, tag, note) => urls
            .split('\n')
            .map(url => url.trim())
            .filter(Boolean)
            .map(url => ({
              tags: ['social', tag],
              url,
              note,
              name: '',
              organization: org.id,
            }));

          const links = await this.$parlapi.getOrganisationSocialLinks(org.id);
          const fbs = links.data.results.filter(link => link.tags.indexOf('fb') !== -1);
          const tws = links.data.results.filter(link => link.tags.indexOf('tw') !== -1);

          const newFbs = mapSocialUrls(orgInfo.socials.facebook, 'fb', 'FB');
          const newTws = mapSocialUrls(orgInfo.socials.twitter, 'tw', 'TW');

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

          const mapContactEmails = values => values
            .split('\n')
            .map(value => value.trim())
            .filter(Boolean)
            .map(value => ({
              contact_type: 'EMAIL',
              label: 'Mail',
              value,
              organization: org.id,
            }));

          const contacts = await this.$parlapi.getOrganisationContactEmails(org.id);
          const emails = contacts.data.results;

          const newEmails = mapContactEmails(orgInfo.contacts.emails);

          const updateContact = async ([contact, newContact]) => {
            if (contact && newContact) {
              assign(contact, newContact);
              await this.$parlapi.patchContact(contact.id, contact);
            } else if (contact) {
              await this.$parlapi.deleteContact(contact.id);
            } else if (newContact) {
              const contactRes = await this.$parlapi.postContact(newContact);
              newContact.id = contactRes.data.id;
            }
          };

          await Promise.all(zip(emails, newEmails).map(updateContact));

          const dissolution = (orgInfo.org.dissolution_date && orgInfo.org.dissolution_time)
            ? `${orgInfo.org.dissolution_date}T${orgInfo.org.dissolution_time}` : null;

          const o = {
            _name: orgInfo.org._name,
            _acronym: orgInfo.org._acronym,
            classification: orgInfo.org.classification,
            voters: orgInfo.org.voters,
            gov_id: orgInfo.org.gov_id,
            parent: orgInfo.org.parent,
            name_parser: orgInfo.org.name_parser,
            dissolution_date: dissolution,
          };
          assign(org, o);
          if (org.id > 0) {
            return this.$parlapi.patchOrganisation(org.id, o);
          }
          const orgRes = await this.$parlapi.postOrganisation(org);
          org.id = orgRes.data.id;
          this.orgs.push(org);
          return Promise.resolve();
        },
      };
      this.infoModalOpen = true;
    },
    closeInfoModal() {
      this.infoModalData = null;
      this.infoModalOpen = false;
    },
    openMembershipsModal(org) {
      this.membershipsModalData = {
        title: `${this.$t('edit-memberships')} - ${org._name}`,
        loadData: async () => {
          const people = await this.$parlapi.getPeople();
          const orgs = await this.$parlapi.getAllOrganisations();
          const membershipsData = await this.$parlapi.getOrganisationMemberships(org.id);
          const memberships = sortBy(membershipsData.data.results, ['start_time']);
          return {
            people: sortBy(people.data.results, ['name']),
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
                on_behalf_of: membership.on_behalf_of,
                label: membership.label,
                role: membership.role,
                person: membership.person,
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
              on_behalf_of: m.on_behalf_of,
              label: m.label,
              role: m.role,
              person: m.person,
              organization: org.id,
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
    addOrganisation() {
      this.openInfoModal({});
    },
  },
};
</script>

<style lang="scss" scoped>
#dash-organisations-list /deep/ {
  .table-contents,
  .table-headers {
    .table-row {
      .table-col:nth-child(1) {
        align-items: flex-start;
        flex: 2;
      }

      .table-col:nth-child(3) {
        flex: 0.5;
      }
    }
  }
}
</style>
