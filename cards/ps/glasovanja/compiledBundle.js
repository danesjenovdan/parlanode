module.exports =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(7)

var Component = __webpack_require__(5)(
  /* script */
  __webpack_require__(2),
  /* template */
  __webpack_require__(6),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("vue");

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_request__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_request___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_request__);
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



/* harmony default export */ __webpack_exports__["default"] = {
  components: ['SearchDropdown'],
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
      __WEBPACK_IMPORTED_MODULE_0_request___default()(`https://parla.me/shortner/generate?url=${encodeURIComponent(`${url}&frame=true`)}`, response => {
        this.shortenedCardUrl = response;
        this.$el.querySelector('.card-content-share button, .btn-copy-embed').textContent = 'KOPIRAJ';
      });
    },
    loadData(cardData) {
      this.cardData = cardData;
    }
  },
  created() {
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
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)();
// imports


// module
exports.push([module.i, "body{color:red}", ""]);

// exports


/***/ }),
/* 4 */
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
/* 5 */
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
/* 6 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "card-container <%= className %>",
    attrs: {
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(3);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
__webpack_require__(8)("352295c6", content, true);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var listToStyles = __webpack_require__(9)

module.exports = function (parentId, list, isProduction) {
  if (typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
    var context = __VUE_SSR_CONTEXT__
    var styles = context._styles

    if (!styles) {
      styles = context._styles = {}
      Object.defineProperty(context, 'styles', {
        enumberable: true,
        get () {
          return (
            context._renderedStyles ||
            (context._renderedStyles = renderStyles(styles))
          )
        }
      })
    }

    list = listToStyles(parentId, list)
    if (isProduction) {
      addStyleProd(styles, list)
    } else {
      addStyleDev(styles, list)
    }
  }
}

// In production, render as few style tags as possible.
// (mostly because IE9 has a limit on number of style tags)
function addStyleProd (styles, list) {
  for (var i = 0; i < list.length; i++) {
    var parts = list[i].parts
    for (var j = 0; j < parts.length; j++) {
      var part = parts[j]
      // group style tags by media types.
      var id = part.media || 'default'
      var style = styles[id]
      if (style) {
        style.ids.push(part.id)
        style.css += '\n' + part.css
      } else {
        styles[id] = {
          ids: [part.id],
          css: part.css,
          media: part.media
        }
      }
    }
  }
}

// In dev we use individual style tag for each module for hot-reload
// and source maps.
function addStyleDev (styles, list) {
  for (var i = 0; i < list.length; i++) {
    var parts = list[i].parts
    for (var j = 0; j < parts.length; j++) {
      var part = parts[j]
      styles[part.id] = {
        ids: [part.id],
        css: part.css,
        media: part.media
      }
    }
  }
}

function renderStyles (styles) {
  var css = ''
  for (var key in styles) {
    var style = styles[key]
    css += `<style data-vue-ssr-id="${
      style.ids.join(' ')
    }"${
      style.media ? ` media="${style.media}"` : ''
    }>${style.css}</style>`
  }
  return css
}


/***/ }),
/* 9 */
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
/* 10 */
/***/ (function(module, exports) {

module.exports = require("request");

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__card_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__card_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__card_vue__);



const app = new __WEBPACK_IMPORTED_MODULE_0_vue___default.a(__WEBPACK_IMPORTED_MODULE_1__card_vue___default.a);

// the default export should be a function
// which will receive the context of the render call
/* harmony default export */ __webpack_exports__["default"] = cardData => {
  app.loadData(cardData);
  const promise = new Promise(resolve => {
    resolve(app);
  });
  return promise;
};

/***/ })
/******/ ]);