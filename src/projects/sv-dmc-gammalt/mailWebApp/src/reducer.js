define(function(require) {
    'use strict';
 
    var _ = require('underscore');
    var reducer = function(state, action) {
       switch (action.type) {
          case 'SET_MAIL':
             return _.extend({}, state, {mail: action.mail});
          default:
             return state;
       }
    }
    return reducer;
 });