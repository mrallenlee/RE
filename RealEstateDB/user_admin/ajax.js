var tool = new Object();

tool.AjaxService = function(async){
	this.url = null;
	this.req = null;
	this.onload = null;
	this.onerror= null; 
	this.async = (async!=null) ? async : true;
	
	if (window.XMLHttpRequest){
		this.req=new XMLHttpRequest();
	} else if (window.ActiveXObject){
		this.req=new ActiveXObject("Microsoft.XMLHTTP");
	}

}

tool.AjaxService.prototype = {
	sendXML: function(url, xml, onload,onerror) {
		//alert('ajax request: ' + xml);
		try {
			this.url = url;
			this.onload = onload;
			this.onerror= (onerror) ? onerror : this.defaultError;
			
			var service = this;
			
			if (this.async) {
				this.req.onreadystatechange = function(){
					service.onReadyState.call(service);
				}
			}

			this.req.open('POST',url, this.async);
			this.req.send(xml);
			
			if (!this.async) {
				var httpStatus=this.req.status;
				if (httpStatus == 200 || httpStatus == 0){
					//alert('ajax response: ' + this.req.responseText);
					return this.req.responseText;
				} else {
					this.onerror.call(this);
				}
			}
		} catch (err){
			this.onerror.call(this);
		}		
	},
	
	onReadyState: function(){
		var req=this.req;
		if (req.readyState == 4){
			var httpStatus=req.status;
			if (httpStatus == 200 || httpStatus == 0){
				this.onload.call(this);
			} else {
				this.onerror.call(this);
			}
		}
	},
	
	defaultError:function(){
		alert("error fetching data!" + "\n\nreadyState:"+this.req.readyState
			+ "\nstatus: " + this.req.status 
			+ "\nheaders: "+ this.req.getAllResponseHeaders());
	}	
}

tool.XML = new Object();

tool.XML.createXMLDocument = function() {
	var xDoc=null;
	if (document.implementation && document.implementation.createDocument){
		xDoc = document.implementation.createDocument("","",null);
	} else if (typeof ActiveXObject != "undefined"){
		var msXmlAx=null;
		try {
			msXmlAx=new ActiveXObject("Msxml2.DOMDocument");
		}catch (e){
			msXmlAx=new ActiveXObject("Msxml.DOMDocument");
		}
		xDoc=msXmlAx;
	}
	
	if (xDoc==null || typeof xDoc.load=="undefined")
		xDoc=null;
	
	return xDoc;	
}

tool.XML.parse = function(xml) {
	if (typeof DOMParser != "undefined") { 
    	// Mozilla, Firefox, and related browsers 
    	return (new DOMParser()).parseFromString(xml, "application/xml"); 
	} else if (typeof ActiveXObject != "undefined") { 
    	// Internet Explorer. 
    	var doc = tool.XML.createXMLDocument();  // Create an empty document 
    	doc.loadXML(xml);            // Parse text into it 
    	return doc;                   // Return it 
    }
}       
        
tool.XML.getRootElement = function(domdoc) {
	if (domdoc.getDocumentElement)
		return domdoc.getDocumentElement();
	
	if (domdoc.documentElement)
		return domdoc.documentElement;
}

if (document.implementation && document.implementation.createDocument) {
	Node.prototype.__defineGetter__("xml", 
		function() {
		    //create a new XMLSerializer
		    var objXMLSerializer = new XMLSerializer;
		    
		    //get the XML string
		    var strXML = objXMLSerializer.serializeToString(this);
		    
		    //return the XML string
		    return strXML;
		}
	);
	
}

