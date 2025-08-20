/* eslint-disable no-unexpected-multiline */
/* eslint-disable no-unused-vars */
import appData from "@sitevision/api/server/appData";
import portletContextUtil from "@sitevision/api/server/PortletContextUtil";
import resourceLocatorUtil from "@sitevision/api/server/ResourceLocatorUtil";
import properties from "@sitevision/api/server/Properties";
import dateUtil from "@sitevision/api/server/DateUtil";
import nodeTreeUtil from "@sitevision/api/server/NodeTreeUtil";
import { addHeadElement } from '@sitevision/api/server/hooks';

const currentPage = portletContextUtil.getCurrentPage();
const chosenProtocol = appData.get('https');
const url = properties.get(currentPage, 'URL');

let protocol = chosenProtocol === true ? 'https://' : url.startsWith('https://') ? 'https://' : url.startsWith('http://') ? protocol = 'http://' : protocol = '';

let ogTitle = properties.get(currentPage, 'og.title') && properties.get(currentPage, 'og.title') !== null ? properties.get(currentPage, 'og.title') 
    : properties.get(currentPage, 'articleName') && properties.get(currentPage, 'jcr:uuid').startsWith('5.') && properties.get(currentPage, 'articleName') !== null ? properties.get(currentPage, 'articleName')
    : properties.get(currentPage, 'displayName');

let ogImage = properties.get(currentPage, 'og.image') !== null ? properties.get(properties.get(currentPage, 'og.image'), 'URI') 
    : nodeTreeUtil.findPortletsByType(currentPage, 'image').size() > 0 && appData.get('imageChoiceSettings') === false ? 
    properties.get(properties.get(nodeTreeUtil.findPortletsByType(currentPage, 'image').get(0), 'image'), 'URI')
    : properties.get(appData.getNode('defaultImage'), 'URI');

// Mandatory OGtags and description
addHeadElement((req) => { 
    let domain = appData.get('textInput') !== '' ? appData.get('textInput') : req.hostname;

    let metastring = '<meta property="og:title" content="' + ogTitle.replace(/"/g, '”') + '">';  
    if (properties.get(currentPage, 'og.description') && properties.get(currentPage, 'og.description') !== null)
    { 
        metastring += '<meta property="og:description" content="' + properties.get(currentPage, 'og.description').replace(/"/g, '”') + '">';
    }
    metastring += '<meta property="og:url" content="' + protocol + domain + properties.get(currentPage, 'URI') + '">';
    metastring += '<meta property="og:image" content="' + protocol + domain + ogImage + '">';  
    return metastring; 
});

// Image tags
if (appData.get('imageSettings') === false)
{
    addHeadElement((req) => {  
        let domain = appData.get('textInput') !== '' ? appData.get('textInput') : req.hostname;

        let imageString = '<meta property="og:image:height" content="' + properties.get(ogImage, 'height') + '">';  
        imageString += '<meta property="og:image:width" content="' + properties.get(ogImage, 'width') + '">';  
        imageString += '<meta property="og:image:type" content="' + properties.get(ogImage, 'mimeType') + '">';  
        for (let i = 0; i < nodeTreeUtil.findPortletsByType(currentPage, 'image').size(); i++)
        {
            if (properties.get(ogImage, 'jcr:uuid') !== properties.get(properties.get(nodeTreeUtil.findPortletsByType(currentPage, 'image').get(i), 'image'), 'jcr:uuid'))
            { 
            imageString += '<meta property="og:image" content="' + protocol + domain + properties.get(properties.get(nodeTreeUtil.findPortletsByType(currentPage, 'image').get(i), 'image'), 'URI') + '">';
            imageString += '<meta property="og:image:width" content="'+ properties.get(properties.get(properties.get(nodeTreeUtil.findPortletsByType(currentPage, 'image').get(i), 'image'), 'URI'), 'width') + '">';  
            imageString += '<meta property="og:image:height" content="' + properties.get(properties.get(properties.get(nodeTreeUtil.findPortletsByType(currentPage, 'image').get(i), 'image'), 'URI'), 'height') + '">';  
            imageString += '<meta property="og:image:type" content="' + properties.get(properties.get(properties.get(nodeTreeUtil.findPortletsByType(currentPage, 'image').get(i), 'image'), 'URI'), 'mimeType') + '">';  
            }
        }
        return imageString;
    });
}

// Type and article tags
if (properties.get(currentPage, 'jcr:uuid').startsWith('5.'))
{ 
    addHeadElement((req) => {
        return '<meta property="og:type" content="article">';
    });

    if (appData.get('articleSettings') === false)
    { 
        addHeadElement((req) => {
            let domain = appData.get('textInput') !== '' ? appData.get('textInput') : req.hostname;

            let articleString = '<meta property="article:url" content="' + protocol + domain + properties.get(currentPage, 'URI') + '">';
            articleString += '<meta property="article:published_time" content="' + dateUtil.getDateAsISO8601String
            (new Date(properties.get(currentPage, 'lastPublishDate'))) + '">'; 
            articleString += '<meta property="article:modified_time" content="' + dateUtil.getDateAsISO8601String
            (new Date(properties.get(currentPage, 'lastModifiedDate'))) + '">';
            if (dateUtil.getDateAsISO8601String(new Date(properties.get(currentPage, 'scheduledUnpublishDate'))) > 0){
            articleString += '<meta property="article:expiration_time" content="' + dateUtil.getDateAsISO8601String
            (new Date(properties.get(currentPage, 'scheduledUnpublishDate'))) + '">';
            }
            // eslint-disable-next-line no-empty
            if (properties.get(properties.get(currentPage, 'createdBy'), 'displayName').includes('system') || properties.get(properties.get(currentPage, 'createdBy'), 'displayName').includes('System')){}
            else
            {
            articleString += '<meta property="article:author" content="' + properties.get(properties.get(currentPage, 'createdBy'), 'displayName') + '">';
            }           
            return articleString;
        });
    }
}
else
{
    addHeadElement((req) => {
        return '<meta property="og:type" content="website">';
    });
}

// Twitter tags
if (appData.get('twitterSettings') === false)
{
    addHeadElement((req) => {  

        let domain = appData.get('textInput') !== '' ? appData.get('textInput') : req.hostname;

        let twitterString = '<meta property="twitter:card" content="summary">'; 
        twitterString += '<meta property="twitter:title" content="' + ogTitle.replace(/"/g, '”') + '">'; 
        if (properties.get(currentPage, 'og.description') && properties.get(currentPage, 'og.description') !== null)
        { 
            twitterString += '<meta property="twitter:description" content="' + properties.get(currentPage, 'og.description').replace(/"/g, '”') + '">';
        }
        twitterString += '<meta property="twitter:image" content="' + protocol + domain + ogImage + '">';  
        return twitterString;
        });  
}   

// Other tags
if (appData.get('otherSettings') === false)
{
    addHeadElement((req) => {  
        let otherString = '<meta property="og:site_name" content="' + properties.get(resourceLocatorUtil.getSitePage(), 'displayName') + '">'; 
        otherString += '<meta property="og:locale" content="' + properties.get(resourceLocatorUtil.getSitePage(), 'locale') + '">';
        return otherString;
    });
}
