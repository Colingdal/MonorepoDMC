import App from "./components/App";
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import router from "@sitevision/api/common/router";
import appData from "@sitevision/api/server/appData";
import mailBuilder from "@sitevision/api/server/MailBuilder";
import properties from "@sitevision/api/server/Properties";
import logUtil from "@sitevision/api/server/LogUtil";
import resourceLocatorUtil from "@sitevision/api/server/ResourceLocatorUtil";
import portletContextUtil from "@sitevision/api/server/PortletContextUtil";
import webContentUtil from "@sitevision/api/server/WebContentUtil";
import outputUtil from "@sitevision/api/server/OutputUtil";



const mailadress = appData.get('mail');
logUtil.info('mail, ' + mailadress);
const page = appData.get('page');
logUtil.info('page, ' + page);

let pagePart = page + '_pageContent';
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


router.get("/", (req, res) => {
  const name = appData.get("name");
  

  // Renders the App component statically
  res.agnosticRender(renderToString(<App name={name} />), {
    name,
  });
});

  router.post('/sendMailInfo', function(req, res){

    const htmlvalue = outputUtil.getNodeOutput(pageHtml, pagePartNodeFound, 1);            
    let mail = mailBuilder.setSubject('heeeegggteeeeekkkejjjjj').setHtmlMessage(htmlvalue + '<br><div><input type="checkbox" name="prenumeration"/><label>Vill du prenumera på detta nyhetsbrev?</label></div>').addRecipient('carl.olingdal@deermeadow.se').setFrom(mailadress).build();
 
    let content = mail.send();
    if (content === true)
    { 
      webContentUtil.appendContent(pageHtml, '<div><a name="' + mailadress + ' " />' + mailadress + '</div>');
      res.json({mailok: content});
    }
  });





  
