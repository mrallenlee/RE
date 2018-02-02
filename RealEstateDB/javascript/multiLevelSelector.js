
// The global array of objects that have been instanciated
if (!Bs_Objects) {var Bs_Objects = [];};

function Bs_Mls_updateMe(e) {
	if (!e) e = window.event; //mozilla needs that.
	e.srcElement.Bs_Mls_Obj.updateMe(e.srcElement.Bs_Mls_Level);
}



/**
* JavaScript MultiLevelSelector Component.
* 
* 
* <b>Features:</b> 
* - use any number of levels
* - use your custom design and css. just place your select fields into your html document 
*   like in the examples, give them an id, and init your Bs_MultiLevelSelector instance 
*   with their id's.
* - options can be loaded on demand from the server (see example 3).
* 
* <b>Includes (+Dependences):</b>
* <code>
*   <script type="text/javascript" src="/_bsJavascript/core/lang/Bs_Misc.lib.js"></script>
*   <script type="text/javascript" src="/_bsJavascript/core/form/Bs_FormFieldSelect.class.js"></script>
*   
*   if the load-on-demand feature is used like in example 3:
*   <script type="text/javascript" src="/_bsJavascript/plugins/jsrs/JsrsCore.lib.js"></script>
* </code>
* 
* <b>How to use:</b>
* - Have a look at the examples (see example link below)
* 
* <b>What is returned to the server:</b>
* - the selected elements of all select fields (of all levels). it's all standard html.
* 
* 
* @example components/multilevelselector/examples/example1.php Simple example with 2 levels.
* @example components/multilevelselector/examples/example2.php Simple example with 3 levels.
* @example components/multilevelselector/examples/example3.php Example using load on demand (jsrs).
* 
* @author     andrej arn <andrej-at-blueshoes-dot-org>
* @package    javascript_components
* @subpackage multilevelselector
* @copyright  blueshoes.org
* @since      bs-4.6
*/
function Bs_MultiLevelSelector() {
	
	/**
  * Unique Object/Tag ID is initialized in the constuctor.
  * Based on this._id. Can be used in genarated JS-code as ID. Is set together 
  * from the classname + this._id (see _constructor() code).
  *
  * @access private
  * @var    string 
	* @see    _constructor()
  */
  this._objectId;
	
	/**
	* unique id.
  * @access private
  * @var  int 
	* @see    _constructor()
  */
	this._id;
	
	
	/**
	* how many levels we have.
	* @access private
	* @var    int _levels
	*/
	this._levels = 0;
	
	
	/**
	* the data.
	* @access private
	* @var    array _data
	* @see    setData()
	*/
	this._data = new Array();
	
	
	/**
	* @access private
	* @var    array _fieldElements
	*/
	this._fieldElements = new Array();
	
	
	/**
	* check example3 to see how this works.
	* @access public
	* @var    string jsrsUrl
	*/
	this.jsrsUrl;
	
	/**
	* used for jsrs calls.
	* @access private
	* @var    array _jsrsIssuedCalls
	*/
	this._jsrsIssuedCalls = new Array();
	
	
	/**
	* sets the data for all the options of the select fields.
	* @access public
	* @param  array data
	* @return void
	*/
	this.setData = function(data) {
		//this._levels = this._countLevels(data);
		this._data = data;
	}
	
	/**
	* counts the deepness of the data. how many levels down it goes. 
	* how many select fields there need to be.
	* @access private
	* @param  array data
	* @param  int i (used internally only)
	* @return int
	*/
	this._countLevels = function(data, i) {
		if (typeof(i) == 'undefined') i = 0;
		i++;
		var oldI = i;
		
		for (key in data) {
			if ((typeof(data[key]['children']) != 'undefined') && (typeof(data[key]['children']) == 'object')) {
 				var newI = this._countLevels(data[key]['children'], oldI);
				if (newI > i) i = newI;
			}
		}
		
		return i;
	}
	
	
	/**
	* 
	* @access public
	* @param  int level (1-n)
	* @param  string fieldElementId
	* @param  string loadOptionsJsrsFunction
	* @return bool
	*/
	this.initLevelByExistingField = function(level, fieldElementId, loadOptionsJsrsFunction) {
		var elm = document.getElementById(fieldElementId);
		var s = new Bs_FormFieldSelect();
		s.init(elm);
		
		this._fieldElements[level] = new Array();
		this._fieldElements[level]['elm'] = elm;
		if (typeof(loadOptionsJsrsFunction) != 'undefined') this._fieldElements[level]['loadOptionsJsrsFunction'] = loadOptionsJsrsFunction;
		
		if (level > this._levels) this._levels = level;
	}
	
	
	/**
	* starts the whole thing after everything is set and ready.
	* @access public
	* @return bool
	*/
	this.render = function() {
		//if ((typeof(this._data.length) != 'object')          || (this._data.length == 0)) return false;          //no data
		//if ((typeof(this._fieldElements.length) != 'object') || (this._fieldElements.length == 0)) return false; //no fields
		
		for (var i=1; i<this._fieldElements.length; i++) {
			elm = this._fieldElements[i]['elm'];
			elm.Bs_Mls_Obj   = this;
			elm.Bs_Mls_Level = i;
			//elm.attachEvent('onclick', 'Bs_Objects['+this._id+'].updateMe(2);');
			//elm.attachEvent('onclick', Bs_Mls_updateMe);
			elm.attachEvent('onchange', Bs_Mls_updateMe);
		}
		
		var elm = this._fieldElements[1]['elm'];
		elm.Bs_Mls_data = this._data;
		elm.prune();
		
		for (key in this._data) {
			//elm.addElementsByHash();
			
			var selected = ((typeof(this._data[key]['selected']) != 'undefined') && (this._data[key]['selected']));
			var caption  = (typeof(this._data[key]['caption']) != 'undefined') ? this._data[key]['caption'] : key;
			var newOption = new Option(caption, key, false, selected);
			elm.options[elm.length] = newOption;
			
		}
		this.updateMe(1);
	}
	
	
	/**
	* @access public
	* @param  int level
	* @return ?
	*/
	this.updateMe = function(level) {
		var elmSelf = this._fieldElements[level]['elm'];
		var value   = elmSelf.getValue();
		
		if (typeof(elmSelf.Bs_Mls_data) != 'undefined') {
			for (key in elmSelf.Bs_Mls_data) {
				if (typeof(elmSelf.Bs_Mls_data[key]) == 'string') {
					var tmp = elmSelf.Bs_Mls_data[key];
					elmSelf.Bs_Mls_data[key] = new Array();
					elmSelf.Bs_Mls_data[key]['caption'] = tmp;
				}
				elmSelf.Bs_Mls_data[key]['selected'] = false;
			}
			if (value != 'undefined') {
				elmSelf.Bs_Mls_data[value]['selected'] = true;
			}
		}
		
		if (level >= this._levels) return;
		
		var elmChild   = this._fieldElements[level +1]['elm'];
		elmChild.prune();
		
		if (value != 'undefined') {
			if (typeof(elmSelf.Bs_Mls_data[value].children) == 'undefined') {
				//have to load that first, and then will call updateMe() again.
				this._loadOptionsFromServer(level +1, value, elmSelf);
			} else {
				var data = elmSelf.Bs_Mls_data[value].children; //this._data[value].children;
				
				elmChild.Bs_Mls_data = data; //set a reference so we can modify that later on.
				for (key in data) {
					if (typeof(data[key]) == 'object') {
						var selected = ((typeof(data[key]['selected']) != 'undefined') && (data[key]['selected']));
						var caption  = (typeof(data[key]['caption']) != 'undefined') ? data[key]['caption'] : key;
					} else if (typeof(data[key]) == 'string') {
						var selected = false;
						var caption  = data[key];
					} else {
						//murphy
						var selected = false;
						var caption  = key;
					}
					var newOption = new Option(caption, key, false, selected);
					elmChild.options[elmChild.length] = newOption;
				}
			}
		}
		
		if (level < this._levels) this.updateMe(level +1);
	}
	
	/**
	* @access private
	* @param  ? level
	* @param  ? key
	* @param  element elm
	* @return void
	*/
	this._loadOptionsFromServer = function(level, key, elm) {
		//jsrsContextProp.useGet = false; //otherwise הצü etc are fucked. hrm they still are. 
		
		var functionName = this._fieldElements[level]['loadOptionsJsrsFunction'];
    var callId    = jsrsCall(this.jsrsUrl, 'Bs_Objects['+this._id+']' + "._callbackLoadOptionsFromServer", functionName, key);
    this._jsrsIssuedCalls[callId] = new Array(level, key, elm);
	}
	
  /**
  * is called automatically once the jsrs request to the server returns.
	* @access private
	* @param  ? value
	* @param  ? callId
	* @return void
  * @see this._loadOptionsFromServer()
  */
  this._callbackLoadOptionsFromServer = function(value, callId) {
		var level = this._jsrsIssuedCalls[callId][0];
		var key   = this._jsrsIssuedCalls[callId][1];
		var elm   = this._jsrsIssuedCalls[callId][2];
		//elm.Bs_Mls_data = value;
		elm.Bs_Mls_data[key].children = value;
		this.updateMe(level -1);
  }
	
	
	/**
	* the pseudo constructor.
	* @access private
	* @return void
	*/
	this._constructor = function() {
  	// Put this instance into the global object instance list
    this._id = Bs_Objects.length;
    Bs_Objects[this._id] = this; 
    this._objectId = "Bs_Mls_"+this._id;
	}
	
	
	this._constructor(); //call the constructor. needs to be at the end.
	
	
}
