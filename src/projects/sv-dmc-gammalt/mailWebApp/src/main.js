define(function (require) {
  'use strict';

  const Component = require('Component');
  const template = require('/template/main');
  const Toasts = require('toasts');
  const requester = require('requester');
  const router = require('router');
  const _ = require('underscore');
  const $ = require('jquery');
  
  return Component.extend({
    template: template,

    events: {
      dom: {
          'click [data-send]': 'sendingMail',     
      },
    },
    
    sendingMail: function(e) {
      
      e.preventDefault();
      const mailobj = {
        headline: $('#text-1').val(),
        email: $('#email').val(),
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

      $('#text-1').val('');
      $('#email').val('');

     }).catch(function(response) {
        console.log('Fail', response);
        Toasts.publish({ 
          heading: 'Mail',
          message: 'Kunde inte skicka, Försök igen! :(', 
          type: 'danger'
        });
     });     
    },

  });
});
