// import links from '@/_mixins/links.js';
// import { PG_CLASSIFICATIONS } from '@/_helpers/constants.js';

// export default {
//   mixins: [links],
//   methods: {
//     groupBy(array, f) {
//       const groups = {};
//       (array || []).forEach((o) => {
//         const group = JSON.stringify(f(o));
//         groups[group] = groups[group] || [];
//         groups[group].push(o);
//       });
//       return Object.keys(groups).map((group) => groups[group]);
//     },

//     generatePeople(LoMT) {
//       return (LoMT?.data || []).map((p) => ({
//         id: p.person.id,
//         label: p.person.name,
//         name: p.person.name,
//         selected: false,
//         image: this.getPersonPortrait(p.person),
//         acronym: p.person.party.acronym,
//       }));
//     },

//     generateGrouped(LoMT) {
//       return this.groupBy(LoMT?.data, (item) => [item.person.party.acronym]);
//     },

//     generateGroups(LoMT) {
//       return [
//         {
//           label: this.$t('parties'),
//           items: this.generateGrouped(LoMT)
//             .filter(
//               (group) =>
//                 PG_CLASSIFICATIONS.indexOf(
//                   group[0].person.party.classification
//                 ) !== -1
//             )
//             .map((group) => group[0].person.party.acronym),
//         },
//       ].concat(
//         this.generateGrouped(LoMT).map((group) => ({
//           label: group[0].person.party.name,
//           acronym: group[0].person.party.acronym,
//           items: group.map((p) => p.person.id),
//           id: group[0].person.party.id,
//         }))
//       );
//     },

//     generateParties(LoMT) {
//       return this.generateGrouped(LoMT).map((group) => ({
//         id: group[0].person.party.acronym,
//         label: group[0].person.party.acronym,
//         selected: false,
//         colorClass: `${group[0].person.party.acronym
//           .toLowerCase()
//           .replace(/[ +,]/g, '_')}-background`,
//         properId: group[0].person.party.id,
//         acronym: group[0].person.party.acronym,
//         isCoalition: group[0].person.party.is_coalition,
//         name: group[0].person.party.name,
//       }));
//     },
//   },
// };
