define(function(require) {
    'use strict';

       const _          = require('underscore');
       const Component  = require('Component');
       const template   = require('/template/pages');
 
    return Component.extend({
 
       template: template,

       onRendered: function(){
       // console.log('Pages.js onRendered', this.state.pages);
       },
 
       filterState: function(state) {
          return _.extend({}, {pages: state.pages});
       }
    });
 });