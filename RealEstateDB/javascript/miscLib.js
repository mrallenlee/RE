var ie = document.all != null;
var moz = !ie && document.getElementById != null && document.layers == null;



/**
* @dependencies Bs_Misc.lib.js
* @author       sam blum <sam-at-blueshoes-dot-org>, andrej arn <andrej-at-blueshoes-dot-org>
* @package      javascript_core
* @subpackage   lang
* @copyright    blueshoes.org
*/

/**
* tells if the given var is null as we (from blueshoes) understand it.
* we think it's null if one of these is true:
*   - the type is 'undefined' (typeof())
*   - var == null
* 
* javascript thinks that a null value (var x = null) is of type 'object'.
* we don't think that's funny. look at these lines:
* var a = new Object(); alert(typeof(a)); if (a) alert('true');  => object, and true
* var b = null;         alert(typeof(b)); if (b) alert('true');  => object, BUT NOT TRUE!
*   
* @param  mixed theVar
* @return bool
*/
function bs_isNull(theVar) {
  if (typeof(theVar) == 'undefined') return true;
  if (theVar == null) return true;
  return false;
}

/**
* Any object but not null returns TRUE
* @param  mixed theVar
* @return bool
*/
function bs_isObject(theVar) {
  ret = false;
  if (typeof(theVar) == 'object') {
    ret = !bs_isNull(theVar);
  }
  return ret;
}

/**
* undefined, null and empty string return true. but the number 0 does not.
* @param  mixed theVar
* @return bool
*/
function bs_isEmpty(theVar) {
	if (bs_isNull(theVar)) return true;
	if (theVar == '') return true;
	return false;
}

/**
* A more precise type detect 
* The extra types we want are 
* 'null'   for  null    (not 'object' as js defines it)
* 'array'  for  Array   (not 'object' as js defines it)
*
* @status experimental
*/
function bs_typeOf(theVar) {
  ret = 'undefined';
  switch (typeof(theVar)) {
    case 'boolean':  ret = 'boolean';  break;
    case 'number':   ret = 'number';   break;
    case 'string':   ret = 'string';   break;
    case 'function': ret = 'function'; break;
    case 'object':
      if (bs_isNull(theVar)) {
        ret = 'null';
        break;
      }
      if (theVar.concat && theVar.join && theVar.sort && theVar.pop) { // not 100% but 99.9%
        ret = 'array';
        break;
      }
      break;
    case 'undefined':
    default:   
      ret = 'undefined';
  }
  return ret;
}



/**
* Intelligent is TRUE tester. 
* Tells whether a value should be considered as true or not. 
* this is useful for ini files for example where all these values 
* should be treated as TRUE:
*   Yes, Y, Ja, Oui, On, True (string or bool), 1 (string or int) => all case insensitive
* everything else, like No, Off, False, 0, is treated as FALSE.
* @param string value
* @return bool
*/
function bs_isTrue(value) {
  var trueVals = new Array('true','on','y','yes',1,'1','ja','oui');
  if (value == '') return false;
  
  if (typeof(value) == 'string') value = value.toLowerCase();
  
  if (value == true) return true;
	for (var i=0; i<trueVals.length; i++) {
		if (value == trueVals[i].toLowerCase()) return true;
	}
	
  return false;
}


/**
* tells if object is an instance of the class (constructor) specified.
* 
* example: instanceOf(myArray, Array);
* 
* this works like js 1.4: myArray instanceof Array
* 
* @param  object object
* @param  constructor constructor
* @return bool
*/
function instanceOf(object, constructor) {
	while (object != null) {
		if (object == constructor.prototype) return true;
		object = object.__proto__;
	}
	return false;
}


/**
* Merge array AND objects from left to write. That is the last param overwites the first if
* keys are the same.
*  
* @param object obj1 
* @param object obj2 (overwrites obj2)
* @return object  (false if one of the params isn't an object!) 
*/
function bs_arrayMerge(obj1, obj2) {
  if (!bs_isObject(obj1) || !bs_isObject(obj2)) return false;
  for (var key in obj2) {obj1[key] = obj2[key];}
  return obj1;
}


/**
* Takes a vector ( == js-Array() ) or string and transforms it to a hash of key => TRUE. 
* 
* Sample:
*  aArray = new Array('a', 'b', 'c');
*  aHash = bs_arrayFlip(aArray);
*
*  aHash is now aHash['a'] = true
*               aHash['b'] = true
*               aHash['c'] = true
* @param aArray an Array()
* @return a hash ( == js-Object() )
*/
function bs_arrayFlip(aArray) {
  var aHash = new Object();
  type = bs_typeOf(aArray);
  if (type == 'array') {
    for (var i=0; i<aArray.length; i++) {
      aHash[aArray[i]] = true;
    }
  } else if (type == 'string') {
    if (aArray != '') {
      aHash[aArray] = true;
    }
  }
  return aHash;
}



/**
* takes a querystring like ?foo=bar&hello=world and returns an array:
*   array['foo']   = bar
*   array['hello'] = world
* 
* does not like special cases yet, avoid things like:
*   ?foo[0]=bar&foo[1]=wodka
* 
* @param  string queryString (if not given then window.location.search is used.)
* @return array (hash, may be empty)
*/
function queryStringToHash(queryString) {
	if (typeof(queryString) == 'undefined') {
		var queryString = window.location.search;
	}
	var ret = new Array;
	if (bs_isEmpty(queryString)) return ret;
	queryString = queryString.substr(1);
	if (bs_isEmpty(queryString)) return ret;
	var junks = queryString.split('&');
	for (var i=0; i<junks.length; i++) {
		var x = junks[i].split('=');
		if (x.length == 2) {
			ret[x[0]] = x[1];
		} else {
			ret[x[0]] = '';
		}
	}
	return ret;
}



/**
* dumps any var similar to php's var_dump.
* 
*  - loops arrays/objects recursively
*  - omits functions (by default)
*  - alerts the result (or optionally returns it)
* 
* 
* EXAMPLE USAGE:
*   var a = new Object();
*   a[0] = 30;
*   a['sam'] = 15;
*   a['bob'] = 20;
*   a['str'] = 'blah';
*   a['arr'] = new Array('foo', 'bar', 'lala');
*   a.push = function(param) { var a; }
*   dump(a, false, true);
* 
* param showFunctions:
*   old: if functions should be included aswell (with code), 
*        default is false (which means functions are still listed).
*   new: 0 = not listed
*        1 = function "functionname" is listed
*        2 = function with code is listed
*   the default is int 0.
* 
* 
* @param  mixed  theVar (your variable)
* @param  bool   doReturn (if set to true then the result will be returned instead of alert()ed.)
* @param  mixed  showFunctions (see above)
* @param  string _out (the temp output when called recursively. used internally only!)
* @param  string _indent (indent on recursive loop for nicer results. used internally only!)
* @param  int    _numCall (function call counter, used internally only!)
* @return mixed (see above)
* @author blueshoes.org (andrej-at-blueshoes-dot-org)
*/
function dump(theVar, doReturn, showFunctions, _out, _indent, _numCall) {
  if (!_indent) {
    _indent  = ' ';
    _bsDumpOverallNumCall = 1;
  } else {
    _indent  += ' ';
    _bsDumpOverallNumCall++;
  }
  
  if (_bsDumpOverallNumCall < 8) {
    if (_out) {
      var isInternal = true;
    } else {
      _out = '';
      _numCall = 1;
    }
    
    var goOn = true;
    if (_numCall > 10) {
      goOn = false;
      if (!doReturn) {
        goOn = confirm("There have been 10 recursive calls so far. Maybe you have an endless loop. Do you want to continue?");
      }
      if (!goOn) {
        _out += _indent + "error/warning: nesting levels too deep (>10 times)!\n";
      } else {
        _numCall = 0;
      }
    }
    if (goOn) {
      switch (typeof(theVar)) {
        case 'object':
          for (var key in theVar) {
            switch (typeof(theVar[key])) {
              case 'function':
								if (typeof(showFunctions) == 'boolean') {
	                if (showFunctions) {
  	                _out += _indent + 'function "' + key + '" => ' + theVar[key] + "\n";
    	            } else {
      	            _out += _indent + 'function "' + key + "\n";
        	        }
								} else {
									if (showFunctions == 2) {
  	                _out += _indent + 'function "' + key + '" => ' + theVar[key] + "\n";
									} else if (showFunctions == 1) {
      	            _out += _indent + 'function "' + key + "\n";
									} else { //0
										//ignore it. default.
									}
								}
                break;
              case 'undefined':
                //do nothing
                  break;
              case 'object':
    		        _out += _indent + key;
                //if (theVar[key] instanceof Array) {
                if (instanceOf(theVar[key], Array)) {
                  _out += ' (Array) => \n';
                //} else if (theVar[key] instanceof Date) {
                } else if (instanceOf(theVar[key], Date)) {
                  _out += ' (Date) => '+ theVar[key] +'\n';
                } else {
                  _out += ' (Object) => \n';
                }
                _out = dump(theVar[key], doReturn, showFunctions, _out, _indent + "    ", _numCall+1);
                break;
              case 'number':
     		        //if (theVar instanceof Date) alert('date');
     		        if (instanceOf(theVar, Date)) alert('date');
              default:
                _out += _indent + typeof(theVar[key]) + ' "' + key + '" => ' + theVar[key] + "\n";
            }
          }
          break;
        default:
          _out += _indent + typeof(theVar) + ' => ' + theVar + "\n";
      }
    }
  }
  
  if (isInternal || doReturn) {
    return _out;
  } else {
    alert(_out);
    return;
  }
}

function Position(x, y) {
	this.x = x;
	this.y = y;
};

/**
* calculates the absolute-absolute x and y position of your element to the left upper point.
* 
* param stopIfAbsolute:
*   if something is in a container that is positioned absolute 
*   (or has set overflow to auto or scroll which causes the same result) you can 
*   stop going up and asking parents.
* 
* @param  element el (return of document.getElementById().)
* @param  bool stopIfAbsolute (see above, default is false)
* @return object (instance of Position, has .x and .y values.)
* @throws bool false
*/
function getAbsolutePos(el, stopIfAbsolute) {
	if (bs_isNull(el)) {
		var res = new Position(0, 0);
		return res;
	}
	var res = new Position(el.offsetLeft, el.offsetTop);
	if (el.offsetParent) {
		if (el.offsetParent.currentStyle && el.offsetParent.currentStyle.position) {
			var position = el.offsetParent.currentStyle.position;
			var overflow = el.offsetParent.currentStyle.overflow;
		} else if (document.defaultView) {
			var position = document.defaultView.getComputedStyle(el, null).getPropertyValue("position");
			var overflow = document.defaultView.getComputedStyle(el, null).getPropertyValue("overflow");
		} else {
			return false; //throw
		}
		if ((stopIfAbsolute != true ) || ((position != 'absolute') && (position != 'relative') && (overflow != 'auto') && (overflow != 'scroll'))) {
			var tmp = getAbsolutePos(el.offsetParent, stopIfAbsolute);
			res.x += tmp.x;
			res.y += tmp.y;
		}
	}
	return res;
};


/**
* finds the actual background color of the elment specified. the color does not need to be 
* set for that element, it can be in the parent element.
* @param  mixed elm (element or element id)
* @return string (ie: hex code like '#FFFFFF'. moz: string like 'rgb(230, 230, 230)'
* @throws bool false
* @since  bs-4.6
*/
function bs_findBackgroundColor(elm) {
	if (typeof(elm) == 'string') {
		elm = document.getElementById(elm);
	}
	if (typeof(elm) == 'undefined') return false;
	if (moz) {
		try {
			var col = document.defaultView.getComputedStyle(elm, null).getPropertyValue("background-color");
		} catch (e) {
			return false;
		}
	} else {
		if (typeof(elm.currentStyle) == 'undefined') return false;
		var col = elm.currentStyle.backgroundColor;
	}
	if ((typeof(col) != 'undefined') && (col != 'transparent') && (col != '')) {
		return col;
	} else {
		return bs_findBackgroundColor(elm.parentNode);
	}
}

/**
* toggles the visibility of the tag types specified.
* 
* this is useful to hide all select and iframe elements on a webpage 
* so that layers can 'overlap' them. 
* also flash and java used to be un-overlappable using z-index. is that 
* still the case?
* 
* @param  bool show (true = show, false = hide)
* @param  array tags (default is 'select' and 'iframe')
* @return void
*/
function bs_toggleVisibility(show, tags) {
	try {
		if (typeof(tags) == 'undefined') tags = new Array('select', 'iframe');
		for (var tag in tags) {
			var elms = document.getElementsByTagName(tags[tag]);
			for (var e = 0; e < elms.length; e++) {
				elms[e].style.visibility = (show) ? 'visible' : 'hidden';
			}
	 	}
	} catch (e) {
		//unsupported browser
	}
}





// see http://www.crockford.com/javascript/inheritance.html 

Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};

Function.method('inherits', function (parent) {
    var d = 0, p = (this.prototype = new parent());
    this.method('uber', function uber(name) {
        var f, r, t = d, v = parent.prototype;
        if (t) {
            while (t) {
                v = v.constructor.prototype;
                t -= 1;
            }
            f = v[name];
        } else {
            f = p[name];
            if (f == this[name]) {
                f = v[name];
            }
        }
        d += 1;
        r = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
        d -= 1;
        return r;
    });
    return this;
});

Function.method('swiss', function (parent) {
    for (var i = 1; i < arguments.length; i += 1) {
        var name = arguments[i];
        this.prototype[name] = parent.prototype[name];
    }
    return this;
});

//andrej
Function.method('extend', function (object) {
  for (property in object.prototype) {
    this.prototype[property] = object.prototype[property];
  }
});

/*
Object.prototype.extend = function(object) {
  for (property in object.prototype) {
    this.prototype[property] = object.prototype[property];
  }
}
*/




/**
* How do I emulate some of IE's special DOM functions in mozilla/gecko/NS6+ 
*  - insertAdjacentElement
*  - insertAdjacentHTML
*  - insertAdjacentText
*  - innerText  
*/
if ("undefined" != typeof(HTMLElement)) {
  if ("undefined" == typeof(HTMLElement.insertAdjacentElement)) {
  	HTMLElement.prototype.insertAdjacentElement = function(where, parsedNode)	{
  		switch(where){
    		case 'beforeBegin':
    			this.parentNode.insertBefore(parsedNode,this)
    			break;
    		case 'afterBegin':
    			this.insertBefore(parsedNode,this.firstChild);
    			break;
    		case 'beforeEnd':
    			this.appendChild(parsedNode);
    			break;
    		case 'afterEnd':
    			if (this.nextSibling) this.parentNode.insertBefore(parsedNode,this.nextSibling);
    			else this.parentNode.appendChild(parsedNode);
    			break;
  		}
  	}
  	/*
  	HTMLElement.prototype.insertAdjacentHTML = function(where, htmlStr) {
  		var r = this.ownerDocument.createRange();
  		r.setStartBefore(this);
  		var parsedHTML = r.createContextualFragment(htmlStr);
  		this.insertAdjacentElement(where,parsedHTML);
  	}
  
  	HTMLElement.prototype.insertAdjacentText = function(where, txtStr) {
  		var parsedText = document.createTextNode(txtStr);
  		this.insertAdjacentElement(where,parsedText);
  	}
		*/
  } // end if
  
	/*
  if (("undefined" == typeof(HTMLElement.innerText)) && moz) {
    HTMLElement.prototype.innerText getter = function() {  // 
      return this.innerHTML.replace(/<[^>]+>/g,"");
    }
    HTMLElement.prototype.innerText setter = function(txtStr) { // 
      var parsedText = document.createTextNode(txtStr);
      this.innerHTML = "";
      this.appendChild(parsedText);
    }
    HTMLElement.prototype.innerText = function(txtStr) { // 
      var parsedText = document.createTextNode(txtStr);
      this.innerHTML = "";
      this.appendChild(parsedText);
    }
  } // end if
	*/
} // end if












///*
if (moz) {	// set up ie environment for Moz

	extendEventObject();
	emulateAttachEvent();
	//emulateFromToElement();
	emulateEventHandlers(["click", "dblclick", "mouseover", "mouseout",
							"mousedown", "mouseup", "mousemove",
							"keydown", "keypress", "keyup"]);
	//emulateDocumentAll();
	//emulateElement()
	emulateCurrentStyle(["left", "right", "top", "bottom", "width", "height"]);
	emulateHTMLModel();

	// Mozilla returns the wrong button number
	Event.LEFT = 1;
	Event.MIDDLE = 2;
	Event.RIGHT = 3;
	

	
}
else {
	Event = {};
	// IE is returning wrong button number as well :-)
	Event.LEFT = 1;
	Event.MIDDLE = 4;
	Event.RIGHT = 2;
}
//*/



/*
 * Extends the event object with srcElement, cancelBubble, returnValue,
 * fromElement and toElement
 */
function extendEventObject() {
	Event.prototype.__defineSetter__("returnValue", function (b) {
		if (!b) this.preventDefault();
		return b;
	});
	
	Event.prototype.__defineSetter__("cancelBubble", function (b) {
		if (b) this.stopPropagation();
		return b;
	});
	
	Event.prototype.__defineGetter__("srcElement", function () {
		var node = this.target;
		while (node.nodeType != 1) node = node.parentNode;
		return node;
	});

	Event.prototype.__defineGetter__("fromElement", function () {
		var node;
		if (this.type == "mouseover")
			node = this.relatedTarget;
		else if (this.type == "mouseout")
			node = this.target;
		if (!node) return;
		while (node.nodeType != 1) node = node.parentNode;
		return node;
	});

	Event.prototype.__defineGetter__("toElement", function () {
		var node;
		if (this.type == "mouseout")
			node = this.relatedTarget;
		else if (this.type == "mouseover")
			node = this.target;
		if (!node) return;
		while (node.nodeType != 1) node = node.parentNode;
		return node;
	});
	
	Event.prototype.__defineGetter__("offsetX", function () {
		return this.layerX;
	});
	Event.prototype.__defineGetter__("offsetY", function () {
		return this.layerY;
	});
}

/*
 * Emulates element.attachEvent as well as detachEvent
 */
function emulateAttachEvent() {
	HTMLDocument.prototype.attachEvent = 
	HTMLElement.prototype.attachEvent = function (sType, fHandler) {
		var shortTypeName = sType.replace(/on/, "");
		fHandler._ieEmuEventHandler = function (e) {
			window.event = e;
			return fHandler();
		};
		this.addEventListener(shortTypeName, fHandler._ieEmuEventHandler, false);
	};

	HTMLDocument.prototype.detachEvent = 
	HTMLElement.prototype.detachEvent = function (sType, fHandler) {
		var shortTypeName = sType.replace(/on/, "");
		if (typeof fHandler._ieEmuEventHandler == "function")
			this.removeEventListener(shortTypeName, fHandler._ieEmuEventHandler, false);
		else
			this.removeEventListener(shortTypeName, fHandler, true);
	};
}

/*
 * This function binds the event object passed along in an
 * event to window.event
 */
function emulateEventHandlers(eventNames) {
	for (var i = 0; i < eventNames.length; i++) {	
		document.addEventListener(eventNames[i], function (e) {
			window.event = e;
		}, true);	// using capture
	}
}

/*
 * Simple emulation of document.all
 * this one is far from complete. Be cautious
 */
 
function emulateAllModel() {
	var allGetter = function () {
		var a = this.getElementsByTagName("*");
		var node = this;
		a.tags = function (sTagName) {
			return node.getElementsByTagName(sTagName);
		};
		return a;
	};
	HTMLDocument.prototype.__defineGetter__("all", allGetter);
	HTMLElement.prototype.__defineGetter__("all", allGetter);
}

function extendElementModel() {
	HTMLElement.prototype.__defineGetter__("parentElement", function () {
		if (this.parentNode == this.ownerDocument) return null;
		return this.parentNode;
	});
	
	HTMLElement.prototype.__defineGetter__("children", function () {
		var tmp = [];
		var j = 0;
		var n;
		for (var i = 0; i < this.childNodes.length; i++) {
			n = this.childNodes[i];
			if (n.nodeType == 1) {
				tmp[j++] = n;
				if (n.name) {	// named children
					if (!tmp[n.name])
						tmp[n.name] = [];
					tmp[n.name][tmp[n.name].length] = n;
				}
				if (n.id)		// child with id
					tmp[n.id] = n
			}
		}
		return tmp;
	});
	
	HTMLElement.prototype.contains = function (oEl) {
		if (oEl == this) return true;
		if (oEl == null) return false;
		return this.contains(oEl.parentNode);		
	};
}

/*

document.defaultView.getComputedStyle(el1,<BR>null).getPropertyValue('top');

*/
function emulateCurrentStyle(properties) {
	HTMLElement.prototype.__defineGetter__("currentStyle", function () {
		var cs = {};
		var el = this;
		for (var i = 0; i < properties.length; i++) {
			//cs.__defineGetter__(properties[i], function () {
			//	window.status = "i: " + i	;
			//	return document.defaultView.getComputedStyle(el, null).getPropertyValue(properties[i]);
			//});
			cs.__defineGetter__(properties[i], encapsulateObjects(el, properties[i]));
		}
		return cs;
	});
}
// used internally for emualteCurrentStyle
function encapsulateObjects(el, sProperty) {
	return function () {
		return document.defaultView.getComputedStyle(el, null).getPropertyValue(sProperty);
	};
}

function emulateHTMLModel() {

	// This function is used to generate a html string for the text properties/methods
	// It replaces '\n' with "<BR"> as well as fixes consecutive white spaces
	// It also repalaces some special characters	
	function convertTextToHTML(s) {
		s = s.replace(/\&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<BR>");
		while (/\s\s/.test(s))
			s = s.replace(/\s\s/, "&nbsp; ");
		return s.replace(/\s/g, " ");
	}

	HTMLElement.prototype.insertAdjacentHTML = function (sWhere, sHTML) {
		var df;	// : DocumentFragment
		var r = this.ownerDocument.createRange();
		
		switch (String(sWhere).toLowerCase()) {
			case "beforebegin":
				r.setStartBefore(this);
				df = r.createContextualFragment(sHTML);
				this.parentNode.insertBefore(df, this);
				break;
				
			case "afterbegin":
				r.selectNodeContents(this);
				r.collapse(true);
				df = r.createContextualFragment(sHTML);
				this.insertBefore(df, this.firstChild);
				break;
				
			case "beforeend":
				r.selectNodeContents(this);
				r.collapse(false);
				df = r.createContextualFragment(sHTML);
				this.appendChild(df);
				break;
				
			case "afterend":
				r.setStartAfter(this);
				df = r.createContextualFragment(sHTML);
				this.parentNode.insertBefore(df, this.nextSibling);
				break;
		}	
	};

	HTMLElement.prototype.__defineSetter__("outerHTML", function (sHTML) {
	   var r = this.ownerDocument.createRange();
	   r.setStartBefore(this);
	   var df = r.createContextualFragment(sHTML);
	   this.parentNode.replaceChild(df, this);
	   
	   return sHTML;
	});

	HTMLElement.prototype.__defineGetter__("canHaveChildren", function () {
		switch (this.tagName) {
			case "AREA":
			case "BASE":
			case "BASEFONT":
			case "COL":
			case "FRAME":
			case "HR":
			case "IMG":
			case "BR":
			case "INPUT":
			case "ISINDEX":
			case "LINK":
			case "META":
			case "PARAM":
				return false;
		}
		return true;
	});

	HTMLElement.prototype.__defineGetter__("outerHTML", function () {
		var attr, attrs = this.attributes;
		var str = "<" + this.tagName;
		for (var i = 0; i < attrs.length; i++) {
			attr = attrs[i];
			if (attr.specified)
				str += " " + attr.name + '="' + attr.value + '"';
		}
		if (!this.canHaveChildren)
			return str + ">";
		
		return str + ">" + this.innerHTML + "</" + this.tagName + ">";
	});

	HTMLElement.prototype.__defineSetter__("innerText", function (sText) {
		this.innerHTML = convertTextToHTML(sText);
		return sText;		
	});

	var tmpGet;
	HTMLElement.prototype.__defineGetter__("innerText", tmpGet = function () {
		var r = this.ownerDocument.createRange();
		r.selectNodeContents(this);
		return r.toString();
	});
	HTMLElement.prototype.__defineSetter__("outerText", function (sText) {
		this.outerHTML = convertTextToHTML(sText);
		return sText;
	});
	HTMLElement.prototype.__defineGetter__("outerText", tmpGet);

	HTMLElement.prototype.insertAdjacentText = function (sWhere, sText) {
		this.insertAdjacentHTML(sWhere, convertTextToHTML(sText));
	};

}




/**
* encodes a string to be used as filename. this is used for example for the texttype class.
* 
* NOTE: THIS IS THE JAVASCRIPT IMPLEMENTATION OF core/file/Bs_FileUtil.class.php
* 
* examples:
*    1)   this is a 
*         multiline string
*         becomes: "this_eis_ea_e_nmultiline_estring
*         _e = space (empty), _n = newline
* 
* @access public
* @var    string $filename
* @param  char   $e (escape character, default is the underscore '_'.)
* @return string
*/

function encodeFilename(filename, e) {
	if (typeof(e) == 'undefined') e = '_';
	
	/*
	LOOK AT HOW NICE IT'S DONE IN PHP...
	filename = str_replace(replFrom, replTo, filename);
	*/
	
	/*
	OLD, BAD CODE
	//note: need to treat \n and \\n (and the like) as a line break.
	var replFrom = new Array(e,    "\\r",  "\r",   "\\n",  "\n",   ' ',    "\\t",  "\t",   '/',    'Ä',     'Ö',     'Ü',    'ä',     'ö',     'ü',     "\\\\"); //yes we need 4x \ here ! with 2 the browsers silently stop executing js without any error. 
	var replTo   = new Array(e +e , e +'r', e +'r', e +'n', e +'n', e +'e', e +'t', e +'t', e +'s', e +'AE', e +'OE', e +'UE', e +'ae', e +'oe', e +'ue', e +'b');
	for (var i=0; i<replFrom.length; i++) {
		// efnet #javascript <boki> fab-, using var rx = /\\/g; is faster when the regex is known at write time
		var myRegExp = new RegExp(replFrom[i], "g");
		var to       = replTo[i];
		filename = filename.replace(myRegExp, to);
	}
	*/
/* Disable this function because it contains invalid character complained
by IE in win 2003
	
	//NEW, BETTER CODE
	var replFrom = new Array(e,    /\\r/g,  /\\n/g,  / /g,   /\\t/g,  / /g,  /Ä/g,    /Ö/g,    /Ü/g,    /ä/g,    '/ö/g',  '/ü/g',  /\\n/g);
	var replTo   = new Array(e +e , e +'r', e +'n',  e +'e', e +'t',  e +'s', e +'AE', e +'OE', e +'UE', e +'ae', e +'oe', e +'ue', e +'b');
	for (var i=0; i<replFrom.length; i++) {
		filename = filename.replace(replFrom[i], replTo[i]);
	}
	
	//now replace everything that's not 0-9 a-z A-Z with it's ascii value, eg '_038' for '&'.
	var ret      = '';
	for (var i=0; i<filename.length; i++) {
		var chr = filename.substr(i,1);
		if (chr == e) {
			ret += chr;
			continue;
		}
		ord = chr.charCodeAt(1);
		if ((ord < 48) || (ord > 122) || ((ord > 57) && (ord < 65)) || ((ord > 90) && (ord < 97))) {
			if (ord < 10) {
				ret += e + '00' + ord;
			} else if (ord < 100) {
				ret += e + '0' + ord;
			} else {
				ret += e + ord;
			}
		} else {
			ret += chr;
		}
	}
	return ret;
*/
return 'CHECK_MISCLIB.JS';
}



	