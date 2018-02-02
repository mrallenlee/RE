	function MM_findObj(n, d) { //v4.0
	  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
	    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
	  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
	  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
	  if(!x && document.getElementById) x=document.getElementById(n); return x;
	} // MM_findObj


	function MM_validateForm() { //v4.0
	  var i,p,q,nm,test,num,min,max,errors='',args=MM_validateForm.arguments;
	  for (i=0; i<(args.length-2); i+=3) { test=args[i+2]; val=MM_findObj(args[i]);
	    if (val) { nm=val.name; if ((val=val.value)!="") {
	      if (test.indexOf('isEmail')!=-1) { p=val.indexOf('@');
	        if (p<1 || p==(val.length-1)) errors+='- '+nm+' must contain an e-mail address.\n';
	      } else if (test!='R') {
	        if (isNaN(val)) errors+='- '+nm+' must contain a number.\n';
	        if (test.indexOf('inRange') != -1) { p=test.indexOf(':');
	          min=test.substring(8,p); max=test.substring(p+1);
	          if (val<min || max<val) errors+='- '+nm+' must contain a number between '+min+' and '+max+'.\n';
	    } } } else if (test.charAt(0) == 'R') errors += '- '+nm+' is required.\n'; }
	  } if (errors) alert('The following error(s) occurred:\n'+errors);
	  document.MM_returnValue = (errors == '');
	} // MM_validateForm

	function updateTextAfterListboxChange(listbox, textfield)
	{
		textObj 		= MM_findObj(textfield);
		listBoxObj		= MM_findObj(listbox);
		textObj.value 	= listBoxObj.value;
	} // agentChange
	
	function confirm_delete(url)
	{
		ans = confirm("Are you sure you want to delete this record ?");
		if (ans)
		{
			window.location = url;
		}
	}
	
	// Disable whole radio group
	// e.g. disableRadioGroup(document.formName.aRadioGroup)
	function disableRadioGroup (radioGroup) {
	  if (!radioGroup.disabled) {
	    radioGroup.disabled = true;
	    if (document.all || document.getElementById) {
	      if (!radioGroup.length){
	        radioGroup.disabled = true;
	        }
	      else{
	        for (var b = 0; b < radioGroup.length; b++){
				if (radioGroup[b].type == 'radio'){
	          		radioGroup[b].disabled = true;
	          	}
	        }
	      }
	     }
	    else {
	      if (!radioGroup.length) {
	        radioGroup.storedChecked = radioGroup.checked;
	        radioGroup.oldOnClick = radioGroup.onclick;
	        radioGroup.onclick = preserveRadioGroup;
	      }
	      else
	        for (var b = 0; b < radioGroup.length; b++) {
	          radioGroup[b].storedChecked = radioGroup[b].checked;
	          radioGroup[b].oldOnClick = radioGroup[b].onclick;
	          radioGroup[b].onclick = preserveRadioGroup;
	        }
	    }
	  }
	}
	
	// Enable whole radio group
	// e.g. enableRadioGroup(document.formName.aRadioGroup)
	function enableRadioGroup (radioGroup) {
	  if (radioGroup.disabled) {
	    radioGroup.disabled = false;
	    if (document.all || document.getElementById) {
	      if (!radioGroup.length)
	        radioGroup.disabled = false;
	      else
	        for (var b = 0; b < radioGroup.length; b++)
	          radioGroup[b].disabled = false;
	     }
	    else {
	      if (!radioGroup.length) {
	        radioGroup.onclick = radioGroup.oldOnClick;
	      }
	      else
	        for (var b = 0; b < radioGroup.length; b++) {
	          radioGroup[b].onclick = radioGroup[b].oldOnClick;
	        }
	    }
	  }
	}
	
	// calculate propotional image size
	// when inBound is true, it means the image fits into the box with maxWidth, maxHeight	 
	function calculateScaleImageSize(width, height, maxWidth, maxHeight, inBound){
		var size = new Array(2)
		if (width > maxWidth || height > maxHeight){
			var aspectRatio = width/height
			if (aspectRatio > 1){
				if (inBound){
					size['width'] = maxWidth
					size['height'] = maxHeight / aspectRatio
				} else {
					size['height'] = maxHeight
					size['width'] = maxWidth * aspectRatio								
				}
			} else {
				if (inBound){
					size['height'] = maxHeight
					size['width'] = maxWidth * aspectRatio
				} else {
					size['width'] = maxWidth
					size['height'] = maxHeight / aspectRatio
				}			
			}
		} else {
			size['width'] = width
			size['height'] = height
		}
		return size;
	}		


// namespace
if (typeof(tool) == 'undefined'){
	tool = new Object();
}
if (typeof(tool.string) == 'undefined'){
	tool.string = new Object();
}
if (typeof(tool.table) == 'undefined'){
	tool.table = new Object();
}
if (typeof(tool.dom) == 'undefined'){
	tool.dom = new Object();
}

// dialog functions
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
tool.dialog = new Object();

// display error message
tool.dialog.errorDialog = function(errormessage) {
  alert(
    "I am sorry, the following error(s) have occured."
    + "\n___________________________________________________________  \n\n" 
    + errormessage
    + "\n___________________________________________________________  \n\n" 
    + "Thank You.\n");
}

// display js object 
tool.dialog.objectDialog = function(obj) {
  var str="";
  for(var i in obj) {
    if(typeof obj[i] == 'object') {
      str = str + i + "=" + "object >>> \n" + dump_Object(obj[i]);
    } else {
      str = str + i + "=" + obj[i] + "\n";
    }
  }
  alert(str);
}

// End dialog functions
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// Form functions
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
tool.form = new Object();

tool.form.bindData2Control = function(jsObject, htmlForm, oOptions) {
	oOptions = oOptions || {};
  for(var i in jsObject) {
    if(htmlForm[i]) {
    	if(oOptions.numberFormat & tool.validator.isNumeric(jsObject[i]))
    	  htmlForm[i].value = parseFloat(jsObject[i]).toFixed(2);
    	else 
    		htmlForm[i].value = jsObject[i];
    }
  }
}
// End Form functions
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// Validation functions
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
tool.validator = new Object();
tool.validator.isNumeric = function(str) {
	// check for a length of 0 - if so, return false
	if(str.length==0) return false; 
	if(str.length==1 && (str.charAt(0)=='.' || str.charAt(0)==',' || (str.charAt(0)=='-'))) return false;
	
	// loop through each character of the string
	for(var x=0; x < str.length; x++) {
		// if the character is < 0 or > 9, return false (not a number)
		if((str.charAt(x)>='0' && str.charAt(x)<='9') || str.charAt(x)=='.' || str.charAt(x)==',' || (str.charAt(x)=='-' && x==0)) { /* do nothing */ }
		else { return false; }
	}
	
	return true;
}
// End validation functions
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


/* ---------------------------------------------------------------------------
 * DOM utilities 
 *
 * tool.dom.fireClickEvent(domObject)  -  trigger click event
 *
</script>

**/
tool.dom.fireClickEvent = function (/* DOM node **/ domObject) {
	var agt=navigator.userAgent.toLowerCase();
	var is_ie=((agt.indexOf("msie") != -1) && (agt.indexOf("opera") == -1));
	if(is_ie) {
		domObject.fireEvent("onclick");
	} else {
		var e = document.createEvent("MouseEvents");
		e.initEvent("click", true, false);
		domObject.dispatchEvent(e);
	}
}	

 /**
  * Update all td text within a tr dom object
  */ 
tool.dom.upateTR = function (/* DOM node **/ trObj, 
							/* data array for each TD in order **/ tdData){
	var tdNodes 	= trObj.getElementsByTagName('TD');
	for(var i=0; i<tdNodes.length; i++) {	  	
		var tdNode = tdNodes[i];
		tdNode.childNodes[0].nodeValue = tdData[i];
	}						
} 
/* ---------------------------------------------------------------------------
 * String utilities 
 *
 * tool.string.StringBuffer
 * improve performance for string concatenation
 *
 * How to use:
 * var buf = new tool.string.StringBuffer();
 * buf.append("hello");
 * buf.append("world");
 * alert(buf.toString());
 *
**/
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}

tool.string.StringBuffer = function() { 
   this.buffer = []; 
 } 

tool.string.StringBuffer.prototype = {
	append:  function() { 
		for(var i=0; i<arguments.length; i++)	this.buffer.push(arguments[i]); 
	},

	toString: function() { 
   return this.buffer.join(""); 
	} 
}

tool.string.ReformatPhoneNumber = function(phoneNumber) { 
  if (phoneNumber.length == 10)
  	return phoneNumber.substring(0, 3) + '-' + phoneNumber.substring(3, 6) + '-' + phoneNumber.substring(6,10);
  else
  	return phoneNumber;
 } 

tool.string.ReformatPostalCode = function(postalCode) { 
  if (postalCode.length == 6)
  	return postalCode.substring(0, 3) + ' ' + postalCode.substring(3, 6);
  else
  	return postalCode;
 } 

tool.string.ReformatDriversLicense = function(driversLicense) { 
  if (driversLicense.length == 15)
  {
//  	alert(driversLicense.substring(0, 5) + '-' + driversLicense.substring(5, 10) + '-' + driversLicense.substring(10, 15));
  	return driversLicense.substring(0, 5) + '-' + driversLicense.substring(5, 10) + '-' + driversLicense.substring(10, 15);
  }
  else
  	return driversLicense;
 } 

/* ---------------------------------------------------------------------------
 * Table untilities 
 *
 * tool.table.format(domTable)
 * Popup table format dialog, allow user to :
 * 1. show or hide table columns
 *
 * How to use:
 * 1. In the caller script, include dojo.js. For example:
 * <script type="text/javascript" src="./framework/dojo/dojo.js"></script>
 * <script type="text/javascript">
 * dojo.require("dojo.widget.*");
 * 
 * 2. How to call:
 * <INPUT TYPE="BUTTON" VALUE="Show / Hide Columns" onClick="tool.table.format(document.getElementById('unitInfoList'))">
 *
</script>

**/
tool.table.format = function (/* table DOM node **/ myTable) {
	var headerRows = myTable.getElementsByTagName("tr");
	var headerCells = headerRows[0].getElementsByTagName("td");
	var colList = new tool.string.StringBuffer();
	for(var i=0; i<headerCells.length; i++) {
		var headerCell = headerCells[i];
		colList.append("<tr><td>", headerCell.innerHTML, "</td><td>");
		colList.append("<input type='radio' name='display_", i , "' ", (headerCell.style.display=="none"?"":"checked"), ">Show</input>");
		colList.append("<input type='radio' name='display_", i , "' ", (headerCell.style.display=="none"?"checked":""), ">Hide</input>");
		colList.append("</td></tr>");
	}

	var formatViewHTML = tool.table.format_template.replace("<!--LIST-->", colList.toString());
	
	if(dojo.widget.byId("tool_table_format")) {
		dojo.widget.byId("tool_table_format").destroy();
	}
	
	var win = createFloatWindow("tool_table_format","Format Table", formatViewHTML, 430, 350, 200, 200); 
	
	dojo.event.connect(dojo.byId("btnFormatTableClose"), "onclick", function(evt) {
		dojo.widget.byId("tool_table_format").hide();
	});
	
	dojo.event.connect(dojo.byId("btnFormatTableApply"), "onclick", function(evt) {
		var headerRows = myTable.getElementsByTagName("tr");
		var headerCells = headerRows[0].getElementsByTagName("td");
		var displayConfig = document.tool_table_format_form;
		var changeColList = new Array();
		var changeDisplayList = new Array();
		
		for(var i=0; i<headerCells.length; i++) {
			if((headerCells[i].style.display=="none"?false:true) != displayConfig.elements[i*2].checked) {
				changeColList[changeColList.length] = i;
				changeDisplayList[changeDisplayList.length] = displayConfig.elements[i*2].checked?"":"none";
			} 
		}
		
		if (changeColList.length > 0) {
			var myRows = myTable.getElementsByTagName("tr");
			for(var r=0; r < myRows.length; r++) {
		    var cells = myRows[r].getElementsByTagName("td");
				for(var c=0; c < changeColList.length; c++) {
					try {
				    cells[changeColList[c]].style.display = changeDisplayList[c];
					} catch (e) {
					}
				}
			}
		}
	});
}

tool.table.format_template = '\
<div style="overflow: auto; position:absolute; height:245px; top:0px; width: 395px"> \
<form name="tool_table_format_form"> \
<table id="tool_table_format_cols" width="360" cellspacing="0" style="font-size: 12px; margin: 5px;"> \
	<tr style="font-weight: bold;"><td style="border-bottom:thin solid blue">Field</td><td style="border-bottom:thin solid blue;">Display</td></tr> \
<!--LIST--> \
</table> \
</form> \
</div> \
<div style="position:absolute; height:40px; width: 395px; bottom: 0px "> \
<table align="center" >  \
	<tr><td>  \
		<INPUT TYPE="BUTTON" VALUE="Apply" id="btnFormatTableApply" >  \
		&nbsp;&nbsp;&nbsp;  \
		<INPUT TYPE="BUTTON" VALUE="Close" id="btnFormatTableClose" >  \
	</td></tr> \
</table> \
</div> \
';

function createFloatWindow(id, title, content, width, height, left, top) {

	var props = {
		title: title,
		displayCloseAction: true,
		widgetId: id
	};

	var newdiv = document.createElement('div');
	newdiv.style.width = width;
	newdiv.style.height = height;
	newdiv.style.left = left;
	newdiv.style.top = top;
	newdiv.innerHTML = "";
	document.body.appendChild(newdiv);

	var w = dojo.widget.createWidget("FloatingPane", props, newdiv);
	w.setContent(content);
	document.body.appendChild(w.domNode);
	return w;
}
    
/* tool.table.getTableDisplayStyle(domTable)
 * return array of given domTable's header line's display style
 * parameter: 
 * 	myTable: dom table
**/
tool.table.getTableDisplayStyle = function (/* table DOM node **/ myTable) {
	if (!myTable) return;
	
	var headerRows = myTable.getElementsByTagName("tr");
	var headerCells = headerRows[0].getElementsByTagName("td");

	var tableDisplayStyle = new Array();
	
	for(var i=0; i<headerCells.length; i++) {
		tableDisplayStyle[i] = headerCells[i].style.display;
	}

	return tableDisplayStyle;
}

/* tool.table.setTableDisplayStyle(myTable, tableDisplayStyle)
 * set all rows of the given myTable to display style in array tableDisplayStyle
 * parameter: 
 * 	myTable: dom table
 * 	tableDisplayStyle: array of desired display style. 
 * 	the setting is: myTable.columns[i].style.display = tableDisplayStyle[i]
**/
tool.table.setTableDisplayStyle = function (myTable, tableDisplayStyle) {
	if (!myTable) return;

	var myRows = myTable.getElementsByTagName("tr");

	for(var r=0; r < myRows.length; r++) {
    var cells = myRows[r].getElementsByTagName("td");

		for(var c=0; c < tableDisplayStyle.length; c++) {
			try {
		    cells[c].style.display = tableDisplayStyle[c];
			} catch (e) {
			}
		}
	}
}

