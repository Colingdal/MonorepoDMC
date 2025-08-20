define(function(require) {
    'use strict';

    const properties = require('Properties'); 
    const portletContextUtil = require('PortletContextUtil');
    const mailBuilder = require('MailBuilder');     
    const logUtil = require('LogUtil');
    const outputUtil = require("OutputUtil");
    const appData = require('appData');
    const page = appData.getNode('page');
    const resourceLocatorUtil = require('ResourceLocatorUtil');    
    const webContentUtil = require('WebContentUtil'); 
    const $ = require('jquery');
    
    let pagePart = page.getIdentifier() + '_pageContent';
    let pagePartNode = resourceLocatorUtil.getNodeByIdentifier(pagePart); 
    const iterator = pagePartNode.getNodes();
    let pagePartNodeFound;
    while(iterator.hasNext()) 
    {  
        let child = iterator.nextNode();         
        if (properties.get(child, 'jcr:uuid').startsWith('94'))
        {
            pagePartNodeFound = child;
        }
    }

    const currentpage = portletContextUtil.getCurrentPage();
    const pageiterator = currentpage.getNodes();
    let pageHtml;
    while(pageiterator.hasNext()) 
    {  
        let pchild = pageiterator.nextNode();         
        if (properties.get(pchild, 'displayName') && properties.get(pchild, 'jcr:uuid').startsWith('4.'))
        {
            pageHtml = pchild;
        }

    }            

    return{ 

        getCurrentUser: function()
        {
            const currentuser = portletContextUtil.getCurrentUser();
            const mail = properties.get(currentuser, 'mail') ? properties.get(currentuser, 'mail') : '';
            return ({mail: mail});
        },

        sendMail: function(params)
        {
            const htmlvalue = outputUtil.getNodeOutput(page, pagePartNodeFound, 1);            
            const mailadress = appData.get('mail');
            let mail = mailBuilder.setSubject(params.headline).setHtmlMessage(htmlvalue + '<br><div><input type="checkbox" name="prenumeration"/><label>Vill du prenumera på detta nyhetsbrev?</label></div>').addRecipient(params.email).setFrom(mailadress).build();

            let successfullmail = mail.send();

            if(successfullmail === true)
            {
                webContentUtil.appendContent(pageHtml, '<div><a name="' + params.email + ' " />' + params.email + '</div>');
            }
            else 
            {}
            return successfullmail; 
        }    
    } 
});

