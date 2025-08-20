(function () {
  'use strict';

  const router = require('router');
  const myModule = require('/module/server/myModule');
  const logUtil = require('LogUtil');
  const resourceLocatorUtil = require('ResourceLocatorUtil'); //Lokaliserar resurser
  //const sitePage = resourceLocatorUtil.getSitePage();
  const properties = require('Properties'); 
  const portletContextUtil = require('PortletContextUtil');
  const currentPage = portletContextUtil.getCurrentPage();

  router.get('/', function(req, res) {   
        
    //var result = {};
    let headPage = 
    { // Skapar objekt med egenskaper från sitePage och använder metoden getIdentifier för att få id. Skapar tom barn array
      name: properties.get(currentPage, 'displayName'),
      URI: properties.get(currentPage, 'URI'),
      id: currentPage.getIdentifier(),
      children: []
      
    }; 
    var pages = myModule.childrenPages(headPage);

    return res.render('/', {
      
      pages: JSON.stringify(pages),         
    });
      
    
  });

 
}());
