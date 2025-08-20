define(function (require) {
  'use strict';

  const Component = require('Component');
  const template = require('/template/main');
  const Toasts = require('toasts');
  const requester = require('requester');
  const router = require('router');
  const store = require('store');
  const _ = require('underscore');
  const $ = require('jquery');

  return Component.extend({
    template: template,

    events: {
      dom: {
          'click [data-modal-dialog-send]': 'sendingMail',     
          'click [data-modal-dialog]' : 'getUser'         
      },
      store: 'handleStoreUpdate'
    },
    
    sendingMail: function(e) {
      
      e.preventDefault();
      const mailobj = {
        from: $('#text-0').val(),
        headline: $('#text-1').val(),
        content: $('#textarea').val(),
        email: $('#email').val()
      } 
      requester.doPost({
        url: router.getUrl('/sendMailInfo'),   
        data: mailobj
      })
      .then(function(response) {    
        console.log('Send: ', response);
        Toasts.publish({ 
          heading: 'Mail',
          message: 'Skickat! :)', 
          type: 'primary'
        });

        envision.dialog('#example1').then(function (dialogs) {
        dialogs[0].hide();
       });

     }).catch(function(response) {
        console.log('Fail', response);
        Toasts.publish({ 
          heading: 'Mail',
          message: 'Kunde inte skicka, Försök igen! :(', 
          type: 'primary'
        });
     });     
    },

    getUser: function(){
      
      requester.doGet({
        url: router.getUrl('/getUser'),
        context: this
     }).then(function(response) {    
        console.log('Mail: ', response);
        store.dispatch({
          type: 'SET_MAIL',
          mail: response.mail
       });
     }).catch(function(response) {
        console.log('Fail: ', response);
     });     
    },

    handleStoreUpdate: function(newState) {
      this.setState(newState);
    },

    filterState: function(state) {
      return _.extend({}, {mail: state.mail});
   }

  });
});
