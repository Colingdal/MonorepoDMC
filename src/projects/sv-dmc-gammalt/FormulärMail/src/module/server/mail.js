define(function(require) {
    'use strict';

    const properties = require('Properties'); 
    const portletContextUtil = require('PortletContextUtil');
    const mailBuilder = require('MailBuilder');     
    const logUtil = require('LogUtil');
      const outputUtil = require("OutputUtil");

    
    return{
        getCurrentUser: function()
        {
            const currentuser = portletContextUtil.getCurrentUser();
            const mail = properties.get(currentuser, 'mail') ? properties.get(currentuser, 'mail') : '';
            return ({mail: mail});
        },
        sendMail: function(params)
        {
            let mail = mailBuilder.setSubject(params.headline).setTextMessage(params.content).addRecipient(params.email).setFrom(params.from).build();
            return mail.send(); 
        }      

    } 
});

