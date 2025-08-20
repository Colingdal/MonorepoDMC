define(function(require) {
  'use strict';

     const _          = require('underscore');
     const Component  = require('Component');
     const template   = require('/template/main');

  return Component.extend({

     template: template,

     filterState: function(state) {
        return _.extend({}, {pages: state.pages});
        
     }
  });
});