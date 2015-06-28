/*! This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

'use strict';

require('whatwg-fetch');
var fetch = window.fetch;

var checkStatus = function (response) {
  if (response.status >= 200 && response.status < 300) {
    return response.text();
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

var Etherpad = function (page) {
  this.PLACEHOLDERS = {};
  this.page = page;
  this.urls = [
    'https://raw.github.com/bwinton/whimsy/gh-pages/' + this.page + '.txt',
    'https://firefox-ux.etherpad.mozilla.org/ep/pad/export/' + this.page + '/latest?format=txt'
  ];
}

Etherpad.prototype = {
  setDefaults: function (defaults) {
    this.PLACEHOLDERS = defaults;
  },

  loadPlaceholders: function () {
    var self = this;

    fetch(self.urls[0])
      .then(checkStatus)
      .then(function (response) {
        if (response.length < 100) {
          var error = new Error('Not enough text…');
          error.response = response;
          throw error;
        }
        var result = response.split('\n');
        result = result.map(function (x) {
          return x.trim();
        }).filter(function (x) {
          return !x.startsWith('#') && (x !== '');
        });
        self.PLACEHOLDERS = result;
      }).catch(function (error) {
        if (self.urls.length > 1) {
          console.log(`Whimsy: ${self.urls[0]} failed with ${error}.  Popping.`);
          self.urls.shift();
          setTimeout(self.loadPlaceholders.bind(self), 1);
        } else {
          console.log(`Whimsy: ${self.urls[0]} failed with ${error}.  Nothing left to pop.`);
        }
      });
    setTimeout(self.loadPlaceholders.bind(self), 4 * 60 * 60 * 1000);
  },

  hashCode: function (input) {
    var hash = 0;
    if (input.length === 0) {
      return hash;
    }
    for (let i = 0; i < input.length; i++) {
      let char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  },

  getItem: function (id, values) {
    if (typeof id === 'string') {
      id = this.hashCode(id);
    }
    if (!values) {
      values = this.PLACEHOLDERS;
    }
    id %= values.length;
    id += values.length;
    id %= values.length;
    return values[id];
  },

  getRandomItem: function () {
    var id = Math.floor(Math.random() * this.PLACEHOLDERS.length);
    return this.getItem(id);
  },

  getRandomItems: function (n, placeholders) {
    var rv = [];
    placeholders = placeholders || this.PLACEHOLDERS;
    var values = placeholders.slice(0);

    for (var i = 0; i < n; ++i) {
      var id = Math.floor(Math.random() * values.length);
      var item = this.getItem(id, values);
      values.splice(id, 1);
      rv.push(item);
    }
    return rv;
  }

};

exports.Etherpad = Etherpad;
