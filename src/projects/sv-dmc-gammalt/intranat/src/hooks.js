import { addHeadElement } from '@sitevision/api/server/hooks';
import logUtil from '@sitevision/api/server/LogUtil';
import properties from '@sitevision/api/server/Properties';
import appResource from '@sitevision/api/server/appResource';

//CHANGE STRING URL FOR THE LOGO YOU WANT!!!
const getImage = appResource.getNode('images/dmc.png');
logUtil.info('getImage, ' + getImage);

const content = appResource.getContent('files/head.css');
logUtil.info('content, ' + content);

const updatedContent = content.replace(/URI/g, properties.get(getImage, 'URI'));
logUtil.info('updatedContent ' + updatedContent);

//DIFFRENT SOLUTION

// //CHANGE STRING URL FOR THE LOGO YOU WANT!!!
// const updatedContent = appResource.getContent('files/head.css').replace(/URI/g, properties.get(appResource.getNode('images/dmc.png'), 'URI'));
// logUtil.info('updatedContent ' + updatedContent);

addHeadElement((req) => {
  const headCss = '<style>'+ updatedContent +'</style>';
  return headCss;
});

// addHeadElement((req) => {
//   const bodyElement = '<div class="logo">Till startsidan</div>';
//   return bodyElement;
// });



  



