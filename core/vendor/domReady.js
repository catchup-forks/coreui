/*! Core UI
 *  @description  Core UI Frontend Framework
 *  @version      0.0.1.REL20150213
 *  @copyright    2015 New York State Finance, Regulation & Gaming Cluster
 */

/**
 * @license RequireJS domReady 2.0.1 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/domReady for details
 */
define(function(){"use strict";function runCallbacks(callbacks){var i;for(i=0;i<callbacks.length;i+=1)callbacks[i](doc)}function callReady(){var callbacks=readyCalls;isPageLoaded&&callbacks.length&&(readyCalls=[],runCallbacks(callbacks))}function pageLoaded(){isPageLoaded||(isPageLoaded=!0,scrollIntervalId&&clearInterval(scrollIntervalId),callReady())}function domReady(callback){return isPageLoaded?callback(doc):readyCalls.push(callback),domReady}var isTop,testDiv,scrollIntervalId,isBrowser="undefined"!=typeof window&&window.document,isPageLoaded=!isBrowser,doc=isBrowser?document:null,readyCalls=[];if(isBrowser){if(document.addEventListener)document.addEventListener("DOMContentLoaded",pageLoaded,!1),window.addEventListener("load",pageLoaded,!1);else if(window.attachEvent){window.attachEvent("onload",pageLoaded),testDiv=document.createElement("div");try{isTop=null===window.frameElement}catch(e){}testDiv.doScroll&&isTop&&window.external&&(scrollIntervalId=setInterval(function(){try{testDiv.doScroll(),pageLoaded()}catch(e){}},30))}"complete"===document.readyState&&pageLoaded()}return domReady.version="2.0.1",domReady.load=function(name,req,onLoad,config){config.isBuild?onLoad(null):domReady(onLoad)},domReady});
//# sourceMappingURL=domReady.js.map