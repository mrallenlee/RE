/**
* 
* 
* example usage:
*   you have a select field in your page, it looks like
*     <select name="something" id="yourSelectFieldId"><option value="foo"><bar></option></select>
*   now you get a reference to it using 
*     var myField = document.getElementById('yourSelectFieldId');
*   then you need to create an instance of Bs_FormFieldSelect (only one for all select fields).
*     s = new Bs_FormFieldSelect();
*   and then you give your select form field the functionality of the bs class:
*     s.init(myField);
*   that's it, now you can use things like:
*     myField.getValue(), myField.hasValue() etc
* 
* naming: 
*   while we usually call the elements of a hash table key and value, for the html 
*   select field they are called value and text. so key=value and value=text. 
*   might be a bit confusing.
* 
* @package    javascript_core
* @subpackage form
*/
function Bs_FormFieldSelect() {}
	
  
  /**
  * tells if the select field has an option with the given value (key, not text).
  * @access public
  * @param  mixed val
	* @return bool
  */
Bs_FormFieldSelect.prototype.hasValue = function(val) {
    val = val + ''; //to string
    for (var i=0; i<this.length; i++) {
      var t = this.options[i].value + ''; //to string
      if (t == val) return true;
    }
    return false;
  }
  
  /**
  * returns the value. 
	* 
  * if the value is not present:
	*   depending on the browser, the text (between the <option></option> tags) or an empty 
	*   string is returned.
  * 
  * @access public
  * @return string
  * @throws (string) 'undefined'
	* @see   getValueOrText()
  */
Bs_FormFieldSelect.prototype.getValue = function() {
    var selIndex = this.selectedIndex;
    if ((selIndex != 'undefined') && (selIndex > -1)) {
      if (typeof(this.options[selIndex].value) != 'undefined') return this.options[selIndex].value;
      if (typeof(this.options[selIndex].text)  != 'undefined') return this.options[selIndex].text;
    }
    return 'undefined';
  }
	
	/**
	* returns the value, or, if not specified, the text.
	* 
	* an option tag can be written as <option>foo</option> or <option value="foo">foo</option>.
	* if submitted to the server, it does not matter. but in js it does, for example ie6 thinks 
	* the first one has no value.
	* the browser thinks that <option>foo</option> and <option value="">foo</option> both have 
	* the value "". but that is a big problem. because if submitted to the server, the first one 
	* will be submitted as "foo" while the 2nd will be submitted as "".
	* 
	* in other words, this method returns the same value as the browser would submit to the server.
	* 
	* example return values:
	*   <option></option>                = ""
	*   <option>foo</option>             = foo
	*   <option value="">foo</option>    = ""
	*   <option value="foo">bar</option> = foo
	* 
  * @access public
	* @param  int i (the index of the option you want, if not specified then the currently selected one (this.selectedIndex) will be used.)
  * @return string
	* @throws bool false
	* @see   getValue()
	* @since bs4.4
	*/
Bs_FormFieldSelect.prototype.getValueOrText = function(selIndex) {
		if (typeof(selIndex) == 'undefined') selIndex = this.selectedIndex;
    if ((selIndex != 'undefined') && (selIndex > -1)) {
      if (typeof(this.options[selIndex].value) != 'undefined') {
				if (typeof(this.options[selIndex].outerHTML) == 'string') {
					if (this.options[selIndex].outerHTML.toLowerCase().indexOf('value=') != -1) {
						return this.options[selIndex].value;
					}
				} else {
					//that return could be wrong. if the value would really be set to an empty string. but what can we do.
					if (this.options[selIndex].value != '') return this.options[selIndex].value;
				}
			}
      if (typeof(this.options[selIndex].text)  != 'undefined') return this.options[selIndex].text;
    }
    return false;
	}
  
  /**
  * returns the text for the value specified.
  * (in other words, the value for the given key.)
  * 
  * @access public
  * @param  mixed value
  * @return string
  * @throws bool false (if no element with such a value exists)
  * @since  bs4.5
  */
Bs_FormFieldSelect.prototype.getTextForValue = function(value) {
    for (var i=0; i<this.options.length; i++) {
      if (this.options[i].value == value) {
        return this.options[i].text;
      }
    }
    return false;
  }
  
  /**
  * selects the entry in the select field with the value or text specified.
  * 
  * @access public
  * @param  string compare (the thing to compare)
  * @param  string type    ('value' (=key) or 'text' (=value). default is 'text'.)
  * @return bool true on success, false if that value does not exist.
  */
Bs_FormFieldSelect.prototype.setTo = function(compare, type) {
    if (typeof(type) == 'undefined') type = 'text';
    for (var i=0; i<this.length; i++) {
      if (this.options[i][type] == compare) {
        this.selectedIndex = i;
        return true;
      }
    }
    return false;
  }
  
	
	/**
	* selects all options.
	* @access public
	* @return void
	*/
Bs_FormFieldSelect.prototype.selectAll = function() {
    for (var i=0; i<this.length; i++) {
			this.options[i].selected = true;
		}
	}
	

  /**
  * takes the selected optons in this field and moves them to the given field. 
	* the options are still selected in the other field 
  * if keepSelected is set to true.
  * @access public
  * @param  mixed toField (string = the field id, object = reference to the field.)
  * @param  bool  keepSelected (not implemented yet)
  * @return bool
  * @todo   implement functionality for keepSelected param
  * @see    this.moveHashTo(), this.moveAllTo(), this.moveTo()
  */
Bs_FormFieldSelect.prototype.moveSelectedTo = function(toField, keepSelected) {
    if (typeof(toField) == 'string') toField = document.getElementById(toField);
    if (bs_isNull(toField)) return false; //throw
    
    var unsetArray = new Array(); //we cannot unset the elements in the first field immediatly
    for (var i=0; i<this.length; i++) {
      if (this.options[i].selected) {
        var newOpt = new Option(this.options[i].text, this.options[i].value, false, false);
        toField.options[toField.length] = newOpt;
        unsetArray[unsetArray.length] = i;
      }
    }
    //now we can unset, but in reverse order!
    //dump(unsetArray); //4debug
    unsetArray.reverse();
    for (var i=0; i<unsetArray.length; i++) {
      this.options[unsetArray[i]] = null;
    }
    return true;
  }
  
  /**
  * takes all optons in this field and moves them to the given field. 
  * @access public
  * @param  mixed toField (string = the field id, object = reference to the field.)
  * @return bool
  * @see    this.moveSelectedTo(), this.moveHashTo(), this.moveTo()
  */
Bs_FormFieldSelect.prototype.moveAllTo = function(toField) {
    if (typeof(toField) == 'string') toField = document.getElementById(toField);
    if (bs_isNull(toField)) return false; //throw
    
    var unsetArray = new Array(); //we cannot unset the elements in the first field immediatly
    for (var i=0; i<this.length; i++) {
      var newOpt = new Option(this.options[i].text, this.options[i].value, false, false);
      toField.options[toField.length] = newOpt;
      unsetArray[unsetArray.length] = i;
    }
    //now we can unset, but in reverse order!
    //dump(unsetArray); //4debug
    unsetArray.reverse();
    for (var i=0; i<unsetArray.length; i++) {
      this.options[unsetArray[i]] = null;
    }
    return true;
	}
  
	/**
	* moves the option specified to the field specified.
	* @access public
	* @param  string optionValue (the .value attribute of the option you want to move, it's the key not the text!)
	* @return bool
  * @see    this.moveSelectedTo(), this.moveHashTo(), this.moveAllTo()
	*/
Bs_FormFieldSelect.prototype.moveTo = function(toField, optionValue) {
    if (typeof(toField) == 'string') toField = document.getElementById(toField);
    if (bs_isNull(toField)) return false; //throw
    
    var unsetArray = new Array(); //we cannot unset the elements in the first field immediatly
    for (var i=0; i<this.options.length; i++) {
      if (this.options[i].value == optionValue) {
        var newOpt = new Option(this.options[i].text, this.options[i].value, false, false);
        toField.options[toField.length] = newOpt;
        unsetArray[unsetArray.length] = i;
				break;
      }
    }
    //now we can unset, but in reverse order!
    //dump(unsetArray); //4debug
    unsetArray.reverse();
    for (var i=0; i<unsetArray.length; i++) {
      this.options[unsetArray[i]] = null;
    }
    return true;
	}
	
  /**
  * moves the option elements from the given hash from this field to the given 
  * select field, thus removing them in this field.
  * @access public
  * @param mixed toField (string = the field id, object = reference to the field.)
  * @param array hash (key is the id (value of the select field), value is bool true)
  * @return bool
  * @see   this.oveSelectedTo(), this.moveAllTo(), this.moveTo()
  */
Bs_FormFieldSelect.prototype.moveHashTo = function(toField, hash) {
    if (typeof(toField) == 'string') toField = document.getElementById(toField);
    if (bs_isNull(toField)) return false; //throw
    
    var unsetArray = new Array(); //we cannot unset the elements in the first field immediatly
    for (var i=0; i<this.length; i++) {
      if (typeof(hash[this.options[i].value]) != 'undefined') {
        var newOpt = new Option(this.options[i].text, this.options[i].value, false, false);
        toField.options[toField.length] = newOpt;
        unsetArray[unsetArray.length] = i;
      }
    }
    //now we can unset, but in reverse order!
    //dump(unsetArray); //4debug
    unsetArray.reverse();
    for (var i=0; i<unsetArray.length; i++) {
      this.options[unsetArray[i]] = null;
    }
    return true;
  }  
  
  
  /**
  * returns all keys of the elements of this field (not just the selected ones).
  * @access public
  * @return array (vector)
  */
Bs_FormFieldSelect.prototype.getAllKeys = function() {
    var ret = new Array();
    for (var i=0; i<this.options.length; i++) {
      ret[i] = this.options[i].value;
    }
    return ret;
  }
	
	/**
	* returns all key/value pairs of all the options of the field.
	* 
	* like in getValueOrText(), if the value is empty (or not set), the text is used as key too.
	* 
	* @access public
	* @return array (hash)
	*/
Bs_FormFieldSelect.prototype.getAllOptions = function() {
    var ret = new Array();
    for (var i=0; i<this.options.length; i++) {
			var key = this.getValueOrText(i);
      ret[key] = this.options[i].text;
    }
    return ret;
	}
  
  /**
  * empties the select field (removes all options).
  * @access public
  */
Bs_FormFieldSelect.prototype.prune = function() {
    this.options.length = 0;
  }
	
	/**
	* this is a pseudo entry for those looking to add a single element.
	* just use standard javascript:
	* 
	* var newOption = new Option(text, value, defaultSelected, selected);
	* yourElm.options[yourElm.length] = newOption;
	* 
	* @access public
	*/ 
Bs_FormFieldSelect.prototype.addElement = function() {
	}
 	
	
  /**
  * adds the elements from the given hash to the select field.
	* 
  * @access public
  * @param  object dataHash (hash)
  * @return int (number of elements added)
  */
Bs_FormFieldSelect.prototype.addElementsByHash = function(dataHash) {
    var i = 0;
    for (var key in dataHash) {
      var newOpt = new Option(dataHash[key], key, false, false);
      this.options[this.options.length] = newOpt;
      i++;
    }
    return i;
  }
  
  
  /**
  * sorts the array elements by the text (caption).
  * @access public
  * @param  bool desc (by default we order ascending, set this to true if you want descending.)
  * @param  bool natural (set to true if you want "natural" ordering.)
  * @return void
  * @todo   implement the natural order thing
  */
Bs_FormFieldSelect.prototype.sortByText = function(desc, natural) {
	if (typeof(desc)    == 'undefined') desc    = this._param1;
	if (typeof(natural) == 'undefined') natural = this._param2;
	
    //var keyArray = new Array;
    //var txtArray = new Array;
    var sortArr = new Array;
    
    for (var i=0; i<this.length; i++) {
      if (this.options[i].value == 'undefined') this.options[i].value = this.options[i].text;
      //keyArray[i] = this.options[i].value;
      //txtArray[i] = this.options[i].text;
			var bool = (this.options[i].selected) ? '1' : '0';
      sortArr[i] = this.options[i].text + '__BS_SORT__' + this.options[i].value + '_' + bool;
    }
    sortArr.sort();
    if (desc) sortArr.reverse();
    
    this.prune();
    var key = '';
    var txt = '';
    for (var i=0; i<sortArr.length; i++) {
      var pos = sortArr[i].lastIndexOf('__BS_SORT__');
      txt = sortArr[i].substr(0, pos);
      key = sortArr[i].substr(pos + '__BS_SORT__'.length);
			var selected = (key.substr(key.length -1) == '1') ? true : false;
			key = key.substr(0, key.length -2);
      var newOpt = new Option(txt, key, selected, selected);
      this.options[this.options.length] = newOpt;
    }
  }
  
  /**
  * @todo all
  */
Bs_FormFieldSelect.prototype.sortByKey = function() {
  }
  
  
  /**
  * sets the 'text' of the 'value'=>'text' pair.
  * 
  * @access public
  * @param  mixed value (the 'key', not the text!)
  * @param  string text (the new text to set)
  * @return bool true on success, false if that value does not exist.
  * @since  bs4.5
  */
Bs_FormFieldSelect.prototype.setText = function(value, text) {
    for (var i=0; i<this.length; i++) {
      if (this.options[i].value == value) {
        this.options[i].text = text
        return true;
      }
    }
    return false;
  }
  
	
  /**
  * removes the element with the value specified.
  * @access public
  * @param  mixed value (the 'key', not the text!)
  * @return bool true on success, false if that value does not exist.
  * @since  bs4.5
  */
Bs_FormFieldSelect.prototype.removeElement = function(value) {
	if (typeof(value) == 'undefined') value = this._param1;
	
    for (var i=0; i<this.options.length; i++) {
      if (this.options[i].value == value) {
        this.options[i] = null;
        return true;
      }
    }
    return false;
  }
  
	
  /**
  * @access public
  * @param  object formField
  * @return void
  */
Bs_FormFieldSelect.prototype.init = function(formField) {
		if (formField == null) return;
		
		//attach all methods to the field, like this, but in a loop:
    //formField.hasValue = this.hasValue;
    for (var name in this) {
			if (name == 'init') continue; //ignore the constructor.
      formField[name] = this[name];
    }
  }




