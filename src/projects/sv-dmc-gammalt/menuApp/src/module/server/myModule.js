define(function(require) {
    'use strict';

    
    const resourceLocatorUtil = require('ResourceLocatorUtil'); 
    const nodeFilterUtil = require('NodeFilterUtil'); 
    const  nodeIteratorUtil = require('NodeIteratorUtil'); 
    const  properties = require('Properties'); 
    const filter = nodeFilterUtil.getAnyOfPrimaryNodeTypesFilter(['sv:page', 'sv:article']); 

    return {      
       childrenPages: function(node)                
       {  
        const nodeObjP = resourceLocatorUtil.getNodeByIdentifier(node.id);           
        const nodeIterator = nodeIteratorUtil.getFilteredNodeIterator(nodeObjP.getNodes(),filter);    
        
        while(nodeIterator.hasNext()) 
            {  
                let child = nodeIterator.nextNode();         
                let childObj = 
                { 
                    name: properties.get(child,'displayName'),
                    URI: properties.get(child, 'URI'),
                    id: child.getIdentifier(),
                    children: []
                };                  
                    const childIterator = nodeIteratorUtil.getFilteredNodeIterator(child.getNodes(),filter);       
                    if (childIterator.hasNext()) 
                {          
                    node.children.push(childObj); 
                    this.childrenPages(childObj);    
                                    
                }   
                    else 
                {               	
                    node.children.push(childObj);                 
                }            
            }      

        return node; 
             
        }      
     };
});

// The code defines a JavaScript module that exports an object with a single property "childrenPages". The "childrenPages" property is a function that takes in a node object as its argument.

// The function first gets the node object corresponding to the given identifier (node.id) using the "ResourceLocatorUtil" module and then retrieves a filtered node iterator for the child nodes of the node object. The filter only includes nodes of type "sv:page" and "sv:article".

// In a while loop, the function iterates over the child nodes and creates an object for each child node with its properties like "name", "URI", "id", and "children". The properties are retrieved using the "Properties" module.

// If the child node has child nodes of its own, the function recursively calls itself with the child node as the argument to get the child nodes' properties. If the child node does not have child nodes, the child node object is pushed to the parent node's "children" array.

// Finally, the function returns the node object with its children's properties included in the "children" array.
  



