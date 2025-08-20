(function () {
  'use strict';

    const router = require('router');
    const appData = require('appData');
    const page = appData.getNode('page');
    const estateRetriever = require('/module/estateRetriever');

    router.get('/myroute', (req, res) => {
      
      
    var estateInfo = estateRetriever.childrenPages(page);
   
    res.json({ 
    pages: estateInfo,
          
    });
    
   
  });
})();

// // GET [domain]/rest-api/[headlessCustomModuleName]/user/123
// router.get('/user/:id', function(req, res) {
//   // route is matched and {id: 123} will be populated in the req.params object
//  });