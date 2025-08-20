(function () {
  'use strict';

  const router = require('router');
  const logUtil = require('LogUtil');
  const mail = require('/module/server/mail');
  
  function renderIndex(req, res, data) {
    if (req.xhr) 
    {
      logUtil.info('AJAX: ' + JSON.stringify(data));
      res.json(data);
    } 
    else 
    {
      logUtil.info('Render: ' + JSON.stringify(data));
      res.render('/', data);
    }
  }

  router.get('/', (req, res) => {
    let user = mail.getCurrentUser();
    let data =  {mail: user.mail};
    renderIndex(req, res, data);
  });

  router.post('/sendMailInfo', function(req, res){
    const content = mail.sendMail(req.params);
    if (content === true)
    { 
    res.json({mailok: content});
    }
  });

  router.get('/getUser', (req, res) => {
    let user = mail.getCurrentUser();
    res.json(user);
  });  

})();








//Request is message that arrive to server for request something.

//Response is message that send from server to client for give thing that client what.

//GET is used to request data from a specified resource.

//POST is used to send data to a server to create/update a resource.

