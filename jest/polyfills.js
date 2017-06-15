require('core-js/es7/object');

if (typeof URL === 'undefined') {
  window.URL = require('whatwg-url').URL;
}
