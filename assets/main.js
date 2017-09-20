/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
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
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);

var utils = __webpack_require__(2);

(function () {
  'use strict';

  var searchForms = document.querySelectorAll('.js-form');
  var pattern = /^([a-z][a-z0-9\*\-\.]*):\/\/(?:(?:(?:[\w\.\-\+!$&'\(\)*\+,;=]|%[0-9a-f]{2})+:)*(?:[\w\.\-\+%!$&'\(\)*\+,;=]|%[0-9a-f]{2})+@)?(?:(?:[a-z0-9\-\.]|%[0-9a-f]{2})+|(?:\[(?:[0-9a-f]{0,4}:)*(?:[0-9a-f]{0,4})\]))(?::[0-9]+)?(?:[\/|\?](?:[\w#!:\.\?\+=&@!$'~*,;\/\(\)\[\]\-]|%[0-9a-f]{2})*)?$/i;

  var IS_HIDDEN = 'is-hidden';
  var IS_FIXED = 'is-fixed';

  document.querySelector('input[type="search"]').focus();

  //get all page forms and set handlers
  searchForms.forEach(function (item) {
    var form = {
      id: item.id,
      search: item.querySelector('.js-input-search'),
      btn: item.querySelector('.js-btn-search'),
      resetBtn: item.querySelector('.js-btn-reset'),
      tipContainer: item.querySelector('.js-hints-box'),
      links: item.querySelectorAll('.js-hint-link'),
      hints: item.querySelectorAll('.js-hint-text'),
      siteUrl: item.getAttribute('action')
    };

    //set input handler and throttle events registration
    form.search.oninput = utils.throttle(function () {
      var value = form.search.value;

      form.btn.disabled = !value;
      form.resetBtn.classList.toggle(IS_HIDDEN, !value);

      //test entered value and toggle hints box
      if (testInput(value)) {
        changeHints(value, form)
      } else {
        form.tipContainer.classList.add(IS_HIDDEN);
      }
    }, 250);

    //clear input value on reset button click
    form.resetBtn.addEventListener('click', function () {
      this.classList.add(IS_HIDDEN);
      clearForm(form);
    });

    //send xhr on form submit
    form.btn.addEventListener('click', function (event) {
      var xhr = new XMLHttpRequest();
      var formData = new FormData();

      event.preventDefault();
      formData.append("form-id", form.id);
      formData.append("query", form.search.value);
      xhr.open("POST", form.siteUrl);
      xhr.send(formData);
      clearForm(form);
      form.resetBtn.classList.add(IS_HIDDEN);
    });
  });

  //change view, position and text of hints
  function changeHints (value, form) {
    var domainName = value.split('://')[1].split('/')[0];
    var shortUrl = value.split('://')[1];
    var tipRightCoords;

    form.tipContainer.classList.remove(IS_HIDDEN);

    //set links href and texts depends on its data-type attributes
    Array.prototype.forEach.call(form.links, function (link) {
      var type = link.dataset.type;
      var query = type === 'phrase' ? value : type === 'domain' ? domainName : shortUrl;
      var source = '' + form.siteUrl + '?suggestionType=' + type + '&query=' + query;

      link.setAttribute('href', source);
      link.textContent = query;
    });

    tipRightCoords = form.tipContainer.getBoundingClientRect().right;

    //stick or unstick hint depends on link width
    Array.prototype.forEach.call(form.hints, function (hint) {
      var isFixed = hint.classList.contains(IS_FIXED);
      var hintCoords = hint.getBoundingClientRect();
      var link = hint.closest('.hints-box__item').querySelector('.js-hint-link');
      var isRightEdge = hintCoords.right > tipRightCoords - 10;
      var linkRightCoords = link.getBoundingClientRect().right;
      var isLeftEdge = hintCoords.left > linkRightCoords + 10;

      hint.classList.toggle(IS_FIXED, isRightEdge);

      if (isFixed && isLeftEdge) {
        hint.classList.remove(IS_FIXED);
      }
    });
  }

  function clearForm (form) {
    form.search.value = '';
    form.btn.setAttribute('disabled', '');
    form.tipContainer.classList.add(IS_HIDDEN);
  }

  function testInput (value) {
    return pattern.test(value);
  }
})();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = (function() {
  // Polyfill for "closest" method

    if (!Element.prototype.closest) {

      Element.prototype.closest = function (css) {
        var node = this;

        while (node) {
          if (node.matches(css)) return node;
          else node = node.parentElement;
        }
        return null;
      };
    }
})();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  throttle: function throttle(func, ms) {

    var isThrottled = false,
      savedArgs,
      savedThis;

    function wrapper() {

      if (isThrottled) {
        savedArgs = arguments;
        savedThis = this;
        return;
      }

      func.apply(this, arguments);

      isThrottled = true;

      setTimeout(function() {
        isThrottled = false;
        if (savedArgs) {
          wrapper.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
        }
      }, ms);
    }
    return wrapper;
  }
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map