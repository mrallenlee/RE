// DO_class web client stub
DOField = function(name, value, type, dirty){
	this.fieldName = name;
	this.fieldValue = value;
	this.fieldType = (type) ? type : 'string';
	this.isDirty = (dirty) ?  dirty : false;
}

DOField.prototype = {
	toXML: function () {
		return "<" + this.fieldName + ">" + this.fieldValue + "</" + this.fieldName + ">";
	},
	
	fromXML: function(xml) {
		var domdoc = tool.XML.parse(xml);
		var domRoot = tool.XML.getRootElement(domdoc);
		this.fieldName = domRoot.tagName;
		
		if (domRoot.hasChildNodes())
			this.fieldValue = domRoot.childNodes[0].data;
		else
			this.fieldValue = '';
	}
}

DataObject = function(doName, doFields){
	this.doName = doName;
	this.doFields = (doFields) ? doFields : new Array();
}

DataObject.prototype = {
	getField: function(fieldName) {
		try {
			return this.doFields[fieldName].fieldValue;
		} catch (err) {}
	},
	
	setField: function(fieldName, fieldValue) {
		if (this.doFields[fieldName])
			this.doFields[fieldName].fieldValue = fieldValue;
		else
			this.doFields[fieldName] = new DOField(fieldName, fieldValue);
	},
	
	toXML: function() {
		xml = ""; 
		for (var key in this.doFields)
			xml = xml + this.doFields[key].toXML();
			
		return "<DataObject><" + this.doName + ">" + xml + "</" + this.doName + "></DataObject>";
	},

	fromXML: function(xml) {
		var domdoc = tool.XML.parse(xml);
		var domRoot = tool.XML.getRootElement(domdoc);
		if (domRoot.tagName=='DataObject') {
			var doRoot = domRoot.childNodes[0];

			this.doName = doRoot.tagName;
			this.doFields = new Array();
			
			for (var i=0; i<doRoot.childNodes.length; i++) {	
				var doField = new DOField();
				doField.fromXML(doRoot.childNodes[i].xml);
				this.doFields[doField.fieldName] = doField;
			}
		}
	}
}


DOFactory = new Object();
DOFactory.remote = new tool.AjaxService(false);

DOFactory.find = function(doName, parameters) {
	var req = '';	
	parameters = (parameters) ? parameters : new Array();
	
	for (var key in parameters) 
		req = req + '<' + key + '>' + parameters[key] + '</' + key + '>';
		
	req = '<request><class>DO_class</class><function>find</function><parameters><parameter>' + 
		doName + '</parameter><parameter>' + req + '</parameter></parameters></request>';
	
	var res = DOFactory.remote.sendXML('DO_skeleton.phtml', req);
	return xmlToDataObjects(res);
}

DOFactory.findAll = function(doName) {
	return DOFactory.find(doName);
}

DOFactory.findFirst = function(doName, parameters) {
	parameters = (parameters) ? parameters : new Array();
	parameters['rowSize'] = 1;
	var dataObjects = DOFactory.find(doName, parameters);
	if (dataObjects.length > 0 ) return dataObjects[0];
}

DOFactory.create = function(dataobject) {
	var req = '';
	req = '<request><class>DO_class</class><function>create</function><parameters><parameter>' + 
		dataobject.toXML() + '</parameter></parameters></request>';
	
	var res = DOFactory.remote.sendXML('DO_skeleton.phtml', req);
	return xmlToDataObjects(res);
}


DOFactory.del = function(dataobject) {

	var req = '';
	req = '<request><class>DO_class</class><function>delete</function><parameters><parameter>' + 
		dataobject.toXML() + '</parameter></parameters></request>';
	
	var res = DOFactory.remote.sendXML('DO_skeleton.phtml', req);
	return xmlToDataObjects(res); 
}

DOFactory.update = function(dataobject, parameters) {
	var req = '';	
	parameters = (parameters) ? parameters : new Array();
	
	for (var key in parameters) 
		req = req + '<' + key + '>' + parameters[key] + '</' + key + '>';

	req = '<request><class>DO_class</class><function>update</function><parameters><parameter>' + 
		dataobject.toXML() + '</parameter><parameter>' + req + '</parameter></parameters></request>';
	
	var res = DOFactory.remote.sendXML('DO_skeleton.phtml', req);
	return xmlToDataObjects(res); 
}


function xmlToDataObjects(xml) {
	var dataobjects = new Array();
	var domdoc = tool.XML.parse(xml);
	
	var doList = domdoc.getElementsByTagName('DataObject');
	for(var i = 0 ; i < doList.length ; i++) {	
		//dataobjects[dataobjects.length] = 
		var dataobject = new DataObject();
		dataobject.fromXML(doList[i].xml);
		
		dataobjects[dataobjects.length] = dataobject;
	}
	
	return dataobjects;
}
