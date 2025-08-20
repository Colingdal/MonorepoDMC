define(function(require) {
    'use strict';

    const nodeFilterUtil = require('NodeFilterUtil'); 
    const nodeIteratorUtil = require('NodeIteratorUtil'); 
    const metadataDefinitionUtil = require('MetadataDefinitionUtil');
    const properties = require('Properties'); 
    const filter = nodeFilterUtil.getAnyOfPrimaryNodeTypesFilter(['sv:page', 'sv:article']); 
    const logUtil = require('LogUtil');
    const _ = require('underscore');
    const requester = require('Requester');
    const options = 
    {
        username: 'system',
        password: 'system',
        preemptiveAuthentication: true,
        headers: {}
    }
    return {         
        childrenPages: function(node)
        {
            const nodeIterator = nodeIteratorUtil.getFilteredNodeIterator(node.getNodes(),filter);
            const metadata = metadataDefinitionUtil.getDefinitions(node);
            
            let mArr = {};            
            metadata.forEach(item => 
                {
                    mArr[item] = properties.get(node, item);
                });

                let object = 
                { 
                    id: node.getIdentifier(),
                    result: [],
                    children: []
                }
                _.extend(object, mArr);

                let endp = "http://localhost/rest-api/1/0/" + node.getIdentifier() + "/headless";
                
                logUtil.info(properties.get(node,'displayName'));
                logUtil.info('endp ' + endp);
                
                requester.get(endp, options)
                .done(function(result, statusCode, headers)
                {
                    logUtil.info('statusCode ' + statusCode);
                    //logUtil.info('result ' + JSON.stringify(result));
                    object.result.push(result);
                })
                .fail(function(message, status) 
                {
                    logUtil.info('fail: ' + status.statusCode );
                });
        
                while(nodeIterator.hasNext()) 
                {  
                    let child = nodeIterator.nextNode();  
                    let childArr = {};
            
                    metadata.forEach( item => 
                        {
                            childArr[item] = properties.get(child, item);
                        });
                        //logUtil.info(JSON.stringify(childArr));
                        
                        let childObj = 
                        { 
                           id: child.getIdentifier(),
                           children: []
                        }   
                        _.extend(childObj, childArr);
                
                        const childIterator = nodeIteratorUtil.getFilteredNodeIterator(child.getNodes(),filter); 
                        childObj = this.childrenPages(child);
                        object.children.push(childObj);
               
                        if (!childIterator.hasNext())
                        {
                        }
                }  
            return object;                
        }    
    };
});
