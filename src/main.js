require('./polyfills');

var utils = require('./utils');

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