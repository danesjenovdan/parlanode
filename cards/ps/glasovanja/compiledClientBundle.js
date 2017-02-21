/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  scopeId,
  cssModules
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  // inject cssModules
  if (cssModules) {
    var computed = options.computed || (options.computed = {})
    Object.keys(cssModules).forEach(function (key) {
      var module = cssModules[key]
      computed[key] = function () { return module }
    })
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(9)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(2),
  /* template */
  __webpack_require__(7),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_parlassets_components_SearchDropdown_vue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_parlassets_components_SearchDropdown_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_parlassets_components_SearchDropdown_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// import request from 'request'


/* harmony default export */ __webpack_exports__["default"] = {
  components: { SearchDropdown: __WEBPACK_IMPORTED_MODULE_0_parlassets_components_SearchDropdown_vue___default.a },
  computed: {
    tagPlaceholder() {
      return this.selectedTags.length > 0 ? `Izbranih: ${this.selectedTags.length}` : 'Izberi';
    },
    monthPlaceholder() {
      return this.selectedMonths.length > 0 ? `Izbranih: ${this.selectedMonths.length}` : 'Izberi';
    },
    dropdownItems() {
      const validTags = [];
      const validMonths = [];

      this.getFilteredVotingDays(true).forEach(votingDay => {
        const [, month, year] = votingDay.date.split(' ').map(string => parseInt(string, 10));
        const monthId = `${year}-${month}`;
        if (validMonths.indexOf(monthId) === -1) validMonths.push(monthId);

        votingDay.ballots.forEach(ballot => {
          ballot.tags.forEach(tag => {
            if (validTags.indexOf(tag) === -1) validTags.push(tag);
          });
        });
      });

      return {
        tags: this.allTags.filter(tag => validTags.indexOf(tag.id) > -1),
        months: this.allMonths.filter(month => validMonths.indexOf(month.id) > -1)
      };
    },
    selectedTags() {
      return this.allTags.filter(tag => tag.selected).map(tag => tag.id);
    },
    selectedMonths() {
      return this.allMonths.filter(month => month.selected);
    },
    selectedOptions() {
      return this.allOptions.filter(option => option.selected).map(option => option.id);
    },
    filteredVotingDays() {
      return this.getFilteredVotingDays();
    },
    cardUrl() {
      const state = {};

      if (this.selectedTags.length > 0) state.tags = this.selectedTags;
      if (this.selectedMonths.length > 0) state.months = this.selectedMonths.map(month => month.id);
      if (this.textFilter.length > 0) state.text = this.textFilter;
      if (this.selectedOptions.length > 0) state.options = this.selectedOptions;

      return `https://glej.parlameter.si/${this.cardData.group}/${this.cardData.method}/${this.cardData.data.party.id}/?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
    },
    allTags() {
      return this.cardData.data.all_tags.map(tag => ({ id: tag, label: tag, selected: false }));
    },
    votingDays() {
      return this.cardData.data.results;
    }
  },
  data() {
    const allMonths = [{ id: '2017-2', label: 'Februar 2017', month: 2, year: 2017, selected: false }, { id: '2017-1', label: 'Januar 2017', month: 1, year: 2017, selected: false }, { id: '2016-12', label: 'December 2016', month: 12, year: 2016, selected: false }, { id: '2016-11', label: 'November 2016', month: 11, year: 2016, selected: false }, { id: '2016-10', label: 'Oktober 2016', month: 10, year: 2016, selected: false }, { id: '2016-9', label: 'September 2016', month: 9, year: 2016, selected: false }, { id: '2016-8', label: 'Avgust 2016', month: 8, year: 2016, selected: false }, { id: '2016-7', label: 'Julij 2016', month: 7, year: 2016, selected: false }, { id: '2016-6', label: 'Junij 2016', month: 6, year: 2016, selected: false }, { id: '2016-5', label: 'Maj 2016', month: 5, year: 2016, selected: false }, { id: '2016-4', label: 'April 2016', month: 4, year: 2016, selected: false }, { id: '2016-3', label: 'Marec 2016', month: 3, year: 2016, selected: false }, { id: '2016-2', label: 'Februar 2016', month: 2, year: 2016, selected: false }, { id: '2016-1', label: 'Januar 2016', month: 1, year: 2016, selected: false }];
    const allOptions = [{ id: 'za', class: 'for', label: 'ZA', selected: false }, { id: 'proti', class: 'against', label: 'PROTI', selected: false }, { id: 'kvorum', class: 'kvorum', label: 'VZDRŽANI', selected: false }, { id: 'ni', class: 'ni', label: 'NISO', selected: false }];
    // const textFilter = this.cardData.state.text || '';
    const textFilter = '';

    // const toggleFromState = (stateParameter, itemArray) => {
    //   if (this.cardData.state[stateParameter]) {
    //     itemArray.forEach((item) => {
    //       if (this.cardData.state[stateParameter].indexOf(item.id) > -1) {
    //         // eslint-disable-next-line no-param-reassign
    //         item.selected = true;
    //       }
    //     });
    //   }
    // };

    // toggleFromState('months', allMonths);
    // toggleFromState('tags', allTags);
    // toggleFromState('options', allOptions);

    return {
      cardData: {
        data: {
          all_tags: [],
          results: [],
          party: {},
          state: {}
        }
      },
      allOptions,
      allMonths,
      textFilter,
      shortenedCardUrl: ''
    };
  },
  methods: {
    toggleOption(optionId) {
      const clickedOption = this.allOptions.filter(option => option.id === optionId)[0];
      clickedOption.selected = !clickedOption.selected;
    },
    getFilteredVotingDays(onlyFilterByText = false) {
      const filterBallots = ballot => {
        const tagMatch = onlyFilterByText || this.selectedTags.length === 0 || ballot.tags.filter(tag => this.selectedTags.indexOf(tag) > -1).length > 0;
        const textMatch = this.textFilter === '' || ballot.motion.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1;
        const optionMatch = onlyFilterByText || this.selectedOptions.length === 0 || this.selectedOptions.indexOf(ballot.option) > -1;

        return tagMatch && textMatch && optionMatch;
      };

      const filterDates = votingDay => {
        if (onlyFilterByText || this.selectedMonths.length === 0) return true;

        const [, month, year] = votingDay.date.split(' ').map(string => parseInt(string, 10));

        return this.selectedMonths.filter(m => m.month === month && m.year === year).length > 0;
      };

      return this.votingDays.map(votingDay => ({
        date: votingDay.date,
        ballots: votingDay.ballots.filter(filterBallots).map(ballot => {
          const ballotClone = JSON.parse(JSON.stringify(ballot));
          if (ballot.option === 'ni') {
            ballotClone.label = 'Niso glasovali o';
          } else {
            ballotClone.label = `Glasovali ${ballot.option.toUpperCase()}`;
          }

          if (ballot.result !== 'none') {
            ballotClone.outcome = ballot.result === true ? 'Predlog sprejet' : 'Predlog zavrnjen';
          }

          return ballotClone;
        })
      })).filter(votingDay => votingDay.ballots.length > 0).filter(filterDates);
    },
    shortenUrl(url) {
      // request(`https://parla.me/shortner/generate?url=${encodeURIComponent(`${url}&frame=true`)}`, (response) => {
      //   this.shortenedCardUrl = response;
      //   this.$el.querySelector('.card-content-share button, .btn-copy-embed').textContent = 'KOPIRAJ';
      // });
    },
    loadData(cardData) {
      console.log('LOAD DATA');
      this.cardData = cardData;
    }
  },
  created() {
    console.log('CREATED');
    // this.shortenUrl(this.cardUrl);
  },
  watch: {
    cardUrl(newValue) {
      // this.shortenUrl(newValue);
    }
  }
};

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* globals document */
var ITEM_HEIGHT = 23;
var ITEM_COUNT = 10;

/* harmony default export */ __webpack_exports__["default"] = {
  data: function data() {
    return {
      filter: '',
      active: false,
      focused: -1
    };
  },
  watch: {
    filter: function filter() {
      this.focus(this.focused);
    }
  },
  computed: {
    filteredItems: function filteredItems() {
      var _this = this;

      var filterAndSort = function filterAndSort(items) {
        return items.filter(function (item) {
          return item.selected || item.label.toLowerCase().indexOf(_this.filter.toLowerCase()) > -1;
        }).map(function (item, index) {
          // eslint-disable-next-line no-param-reassign
          item.sortIndex = index;
          return item;
        }).sort(function (a, b) {
          if (!_this.single) {
            if (_this.alphabetise && Boolean(a.selected) === Boolean(b.selected)) {
              return a.label.localeCompare(b.label, 'sl');
            }

            if (a.selected && !b.selected) return -1;else if (!a.selected && b.selected) return 1;
          }

          if (a.sortIndex < b.sortIndex) return -1;else if (a.sortIndex > b.sortIndex) return 1;

          return 0;
        }).map(function (item) {
          // eslint-disable-next-line no-param-reassign
          delete item.sortIndex;
          return item;
        });
      };

      if (this.groups) {
        return this.groups.map(function (group) {
          var itemsFromGroup = filterAndSort(_this.items.filter(function (item) {
            return group.items.indexOf(item.id) > -1;
          }));

          itemsFromGroup.forEach(function (item, index) {
            // eslint-disable-next-line no-param-reassign
            item.groupLabel = index === 0 ? group.label : null;
          });

          return itemsFromGroup;
        }).reduce(function (a, b) {
          return a.concat(b);
        }, []);
      }
      return filterAndSort(this.items);
    },
    selectedIds: function selectedIds() {
      return this.filteredItems.filter(function (item) {
        return item.selected;
      }).map(function (item) {
        return item.id;
      });
    },
    adjustedPlaceholder: function adjustedPlaceholder() {
      if (!this.single) {
        return this.placeholder;
      }

      var selectedItem = this.filteredItems.filter(function (item) {
        return item.selected;
      })[0];
      return selectedItem ? selectedItem.label : this.placeholder;
    }
  },
  directives: {
    clickOutside: {
      bind: function bind(el, binding) {
        var handler = function handler(e) {
          if (!el.contains(e.target) && el !== e.target) {
            binding.value(e);
          }
        };
        // eslint-disable-next-line no-param-reassign
        el.vueClickOutside = handler;
        document.addEventListener('click', handler);
      },
      unbind: function unbind(el) {
        document.removeEventListener('click', el.vueClickOutside);
        // eslint-disable-next-line no-param-reassign
        el.vueClickOutside = null;
      }
    }
  },
  props: {
    items: { type: Array, required: true },
    placeholder: { type: String, required: true },
    groups: { type: Array, required: false },
    alphabetise: { type: Boolean, required: false, default: true },
    single: { type: Boolean, required: false }
  },
  methods: {
    selectItem: function selectItem(selectedItemId) {
      if (this.single) {
        this.clearSelection();
        this.toggleItem(selectedItemId);
        this.toggleDropdown(false);
      } else {
        this.toggleItem(selectedItemId);
      }
    },
    toggleItem: function toggleItem(itemId) {
      var clickedItem = this.items.filter(function (item) {
        return item.id === itemId;
      })[0];
      this.$set(clickedItem, 'selected', !clickedItem.selected);
    },
    toggleDropdown: function toggleDropdown(state) {
      if (state === false) {
        this.filter = '';
      }
      this.active = state;
    },
    clearSelection: function clearSelection() {
      this.selectedIds.forEach(this.toggleItem);
    },
    focus: function focus(index, withKeyboard) {
      this.focused = Math.max(Math.min(this.filteredItems.length - 1, index), -1);

      if (!withKeyboard) return;

      var additionalOffset = this.filteredItems.slice(0, this.focused + 1).map(function (item) {
        return item.groupLabel ? 1 : 0;
      }).reduce(function (a, b) {
        return a + b;
      }, 0);
      var optionListEl = this.$el.lastChild;
      var focusedPosition = (this.focused + additionalOffset) * ITEM_HEIGHT;

      if (focusedPosition < optionListEl.scrollTop) {
        optionListEl.scrollTop = focusedPosition;
      } else if (focusedPosition > optionListEl.scrollTop + (ITEM_COUNT - 1) * ITEM_HEIGHT) {
        optionListEl.scrollTop = focusedPosition - (ITEM_COUNT - 1) * ITEM_HEIGHT;
      }
    }
  }
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)();
// imports


// module
exports.push([module.i, ".card-content-front{display:flex;flex-direction:column}.filters{display:flex;justify-content:space-between}@media (max-width:767px){.filters{flex-wrap:wrap;min-height:154px}}.filters .filter-label{font-size:14px;font-weight:300;line-height:26px}.filters .option-party-buttons{display:none;width:27.5%;padding-top:26px}@media (min-width:768px){.filters .option-party-buttons{display:flex}}.filters .option-party-buttons .party-button:not(:last-child){margin-right:3px}.filters .text-filter{width:100%}@media (min-width:768px){.filters .text-filter{width:26%}}.filters .text-filter .text-filter-input{background-image:url(\"https://cdn.parlameter.si/v1/parlassets/icons/search.svg\");background-size:24px 24px;background-repeat:no-repeat;background-position:right 9px center;border:1px solid #c8c8c8;font-size:16px;height:51px;line-height:27px;outline:none;padding:12px 42px 12px 14px;width:100%}.filters .tag-dropdown{width:100%}@media (min-width:768px){.filters .tag-dropdown{width:26%}}.filters .month-dropdown{display:none;width:17.5%}@media (min-width:768px){.filters .month-dropdown{display:block}}.filters .search-dropdown-input{padding-top:11px;padding-bottom:11px}.filters .search-dropdown-options{top:50px}.votes{flex:1;overflow-y:auto;margin-top:18px;position:relative}.votes:empty:after{color:#c8c8c8;content:\"Ni rezultatov.\";left:calc(50% - 41px);position:absolute;top:calc(50% - 10px)}.votes ul{list-style:none;margin:0 0 7px;padding:0}.votes li{display:flex;font-weight:500;font-size:16px;line-height:18px}.votes li .date{height:auto;margin:0 0 -18px 16px;padding:16px 0;width:54px}.votes li .icon{display:none;background-position:50%;background-repeat:no-repeat;background-size:25px;height:48px;width:52px}@media (min-width:768px){.votes li .icon{display:block}}.votes li .icon.za{background-image:url(\"https://cdn.parlameter.si/v1/parlassets/icons/za.svg\")}.votes li .icon.proti{background-image:url(\"https://cdn.parlameter.si/v1/parlassets/icons/proti.svg\")}.votes li .icon.ni{background-image:url(\"https://cdn.parlameter.si/v1/parlassets/icons/ni.svg\")}.votes li .icon.kvorum{background-image:url(\"https://cdn.parlameter.si/v1/parlassets/icons/vzdrzan.svg\")}.votes li .motion{flex:1;font-weight:300;line-height:20px;padding:15px 0}.votes li .motion a{font-weight:400}.votes li .outcome{font-size:11px;font-weight:400;line-height:13px;padding:20px 15px 0;text-align:left;text-transform:uppercase;width:90px}", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(3),
  /* template */
  __webpack_require__(8),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "card-container <%= className %>",
    attrs: {
      "id": "app",
      "data-id": "<%= cardData.group %>/<%= cardData.method %>"
    }
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "card-content full",
    attrs: {
      "id": "glasovanja-1234"
    }
  }, [_c('div', {
    staticClass: "card-content-front"
  }, [_c('div', {
    staticClass: "filters"
  }, [_c('div', {
    staticClass: "filter text-filter"
  }, [_c('div', {
    staticClass: "filter-label"
  }, [_vm._v("Išči po naslovu glasovanja")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.textFilter),
      expression: "textFilter"
    }],
    staticClass: "text-filter-input",
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": _vm._s(_vm.textFilter)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.textFilter = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "filter tag-dropdown"
  }, [_c('div', {
    staticClass: "filter-label"
  }, [_vm._v("Matično delovno telo")]), _vm._v(" "), _c('search-dropdown', {
    attrs: {
      "items": _vm.dropdownItems.tags,
      "placeholder": _vm.tagPlaceholder
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "filter month-dropdown"
  }, [_c('div', {
    staticClass: "filter-label"
  }, [_vm._v("Časovno obdobje")]), _vm._v(" "), _c('search-dropdown', {
    attrs: {
      "items": _vm.dropdownItems.months,
      "placeholder": _vm.monthPlaceholder,
      "alphabetise": false
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "filter option-party-buttons"
  }, _vm._l((_vm.allOptions), function(option) {
    return _c('div', {
      class: ['party-button', option.class, {
        selected: _vm.selectedOptions.indexOf(option.id) > -1
      }],
      on: {
        "click": function($event) {
          _vm.toggleOption(option.id)
        }
      }
    }, [_vm._v(_vm._s(option.label))])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "votes stickinme date-list"
  }, [_vm._l((_vm.filteredVotingDays), function(votingDay) {
    return [_c('div', {
      staticClass: "date"
    }, [_vm._v(_vm._s(votingDay.date))]), _vm._v(" "), _c('ul', _vm._l((votingDay.ballots), function(ballot) {
      return _c('li', [_c('div', {
        class: ['icon', ballot.option]
      }), _vm._v(" "), _c('div', {
        staticClass: "motion"
      }, [_vm._v(_vm._s(ballot.label) + " "), _c('a', {
        staticClass: "funblue-light-hover",
        attrs: {
          "href": '<%= urlsData.base %>/seja/glasovanje/' + ballot.session_id + '/' + ballot.vote_id + ''
        }
      }, [_vm._v(_vm._s(ballot.motion))])]), _vm._v(" "), _c('div', {
        staticClass: "outcome"
      }, [_vm._v(_vm._s(ballot.outcome || 'Ni podatkov'))])])
    }))]
  })], 2)])]), _vm._v(" "), _vm._m(1)])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "card-header"
  }, [_c('div', {
    staticClass: "card-header-border"
  }), _vm._v(" "), _c('h1', [_vm._v("Glasovanja")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "card-footer"
  }, [_c('div', {
    staticClass: "card-logo hidden"
  }, [_c('a', {
    attrs: {
      "href": "<%= urlsData.base %>"
    }
  }, [_c('img', {
    attrs: {
      "src": "https://cdn.parlameter.si/v1/parlassets/img/logo-parlameter.svg",
      "alt": "parlameter logo"
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "card-circle-button card-share",
    attrs: {
      "data-back": "share"
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "card-circle-button card-embed",
    attrs: {
      "data-back": "embed"
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "card-circle-button card-info",
    attrs: {
      "data-back": "info"
    }
  }, [_vm._v("i")])])
}]}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    directives: [{
      name: "click-outside",
      rawName: "v-click-outside",
      value: (function() {
        _vm.toggleDropdown(false)
      }),
      expression: "function() { toggleDropdown(false) }"
    }],
    staticClass: "search-dropdown"
  }, [(_vm.selectedIds.length > 0) ? _c('div', {
    staticClass: "search-dropdown-clear",
    on: {
      "click": _vm.clearSelection
    }
  }, [_vm._v("×")]) : _vm._e(), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.filter),
      expression: "filter"
    }],
    staticClass: "search-dropdown-input",
    attrs: {
      "type": "text",
      "placeholder": _vm.adjustedPlaceholder
    },
    domProps: {
      "value": _vm._s(_vm.filter)
    },
    on: {
      "focus": function($event) {
        _vm.toggleDropdown(true)
      },
      "keydown": [function($event) {
        if (_vm._k($event.keyCode, "enter", 13)) { return; }
        $event.preventDefault();
        _vm.selectItem(_vm.filteredItems[_vm.focused].id)
      }, function($event) {
        if (_vm._k($event.keyCode, "up", 38)) { return; }
        $event.preventDefault();
        _vm.focus(_vm.focused - 1, true)
      }, function($event) {
        if (_vm._k($event.keyCode, "down", 40)) { return; }
        $event.preventDefault();
        _vm.focus(_vm.focused + 1, true)
      }],
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.filter = $event.target.value
      }
    }
  }), _vm._v(" "), _c('ul', {
    class: ['search-dropdown-options', {
      visible: this.active
    }],
    on: {
      "mouseleave": function($event) {
        _vm.focus(-1)
      }
    }
  }, [_vm._l((_vm.filteredItems), function(item, index) {
    return [(item.groupLabel) ? _c('li', {
      staticClass: "search-dropdown-group-label"
    }, [_vm._v("\n        " + _vm._s(item.groupLabel) + "\n      ")]) : _vm._e(), _vm._v(" "), _c('li', {
      class: {
        selected: item.selected, focused: _vm.focused === index
      },
      on: {
        "click": function($event) {
          _vm.selectItem(item.id)
        },
        "mouseenter": function($event) {
          _vm.focus(index)
        }
      }
    }, [_c('div', {
      staticClass: "search-dropdown-label"
    }, [_vm._v(_vm._s(item.label))]), _vm._v(" "), (item.count) ? _c('div', [_vm._v(_vm._s(item.count))]) : _vm._e()])]
  })], 2)])
},staticRenderFns: []}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(10)("2ad18fb6", content, true);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-3658dd3c!./../../../node_modules/sass-loader/lib/loader.js?includePaths[]=node_modules!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./card.vue", function() {
     var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-3658dd3c!./../../../node_modules/sass-loader/lib/loader.js?includePaths[]=node_modules!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./card.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(11)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = { css: css, media: media, sourceMap: sourceMap }
    if (!newStyles[id]) {
      part.id = parentId + ':0'
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      part.id = parentId + ':' + newStyles[id].parts.length
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')
  var hasSSR = styleElement != null

  // if in production mode and style is already provided by SSR,
  // simply do nothing.
  if (hasSSR && isProduction) {
    return noop
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = styleElement || createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (!hasSSR) {
    update(obj)
  }

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 11 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__card_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__card_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__card_vue__);


const app = new Vue(__WEBPACK_IMPORTED_MODULE_0__card_vue___default.a);

app.loadData(window.__INITIAL_STATE__);
app.$mount('#app');

/***/ })
/******/ ]);