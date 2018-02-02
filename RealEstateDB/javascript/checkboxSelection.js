if (typeof(tool) == 'undefined'){
	tool = new Object();	
}

if (typeof(tool.input) == 'undefined'){
	tool.input = new Object();	
}

if (typeof(tool.input.checkbox) == 'undefined'){
	tool.input.checkbox = new Object();
}

/**
* Select all checkboxes at the first TD cell within the table
* PARAM:
* 	inputObj 		- dom object of the input
*	domObj 			- dom object of the table
*	defaultValue	- default value of the check box
*/
tool.input.checkbox.selectTableChildren = function(inputObj, domObj, defaultValue){
	var MAX_TD_NODE = 1;
	var tdNodes;
	var tdNode;
	var inputNode
	var numOfTD 	= 0;
	
//	alert(inputObj.getAttribute('name'));
	var trNodes 	= domObj.getElementsByTagName('TR');
	for(var i=0; i<trNodes.length; i++) {	
//		alert(trNodes[i].tagName + ' id=' + trNodes[i].id + ' nodeName=' + trNodes[i].nodeName);
		tdNodes = trNodes[i].childNodes;
//		alert('tdNodes length=' + tdNodes.length);
		numOfTD = 0;
		for (var x=0; x<tdNodes.length && numOfTD <MAX_TD_NODE; x++){
			if (tdNodes[x] && tdNodes[x].tagName == 'TD'){				
				numOfTD++;
//				alert(tdNodes[x].tagName + ' id=' + tdNodes[x].id + ' nodeName=' + tdNodes[x].nodeName);
				tdNode = tdNodes[x];
				if (tdNode.childNodes[0].tagName == "INPUT"){
					inputNode = tdNode.childNodes[0];
//					alert(inputNode.getAttribute('name') + ' id=' + inputNode.id);
					inputNode.checked = defaultValue;
				}
			}									
		}
	}
}

/**
* Select all checkboxes at the first TD cell in TR 
* rows which level is larger than the TR level of src checkbox
* PARAM:
* 	inputObj 		- dom object of the input
*	domObj 			- dom object of the current TR row
*	defaultValue	- default value of the check box
*
* e.g. In this exmple, when check box is clicked in level 1 and 2, 
the checkboxes in level 3 will be checked automatically.
 <tr level=1>
	<TD  class="<?= $CSSClass; ?>">
	<INPUT TYPE="CHECKBOX"  name="DUMMY-CHECKBOX" 
	ONCLICK="tool.input.checkbox.selectSubLevel(this,this.parentNode.parentNode, this.checked);">
	</TD>					
 </tr>
 <tr level=2>
	<TD  class="<?= $CSSClass; ?>">
	<INPUT TYPE="CHECKBOX"  name="DUMMY-CHECKBOX" 
	ONCLICK="tool.input.checkbox.selectSubLevel(this,this.parentNode.parentNode, this.checked);">
	</TD>					
 </tr>
 <tr level=3>
	<TD  class="<?= $CSSClass; ?>">
	<INPUT TYPE="CHECKBOX"  name="real-checkbox">
	</TD>					
 </tr>
 <tr level=3>
	<TD  class="<?= $CSSClass; ?>">
	<INPUT TYPE="CHECKBOX"  name="real-checkbox">
	</TD>					
 </tr>
 <tr level=2>
	<TD  class="<?= $CSSClass; ?>">
	<INPUT TYPE="CHECKBOX"  name="DUMMY-CHECKBOX" 
	ONCLICK="tool.input.checkbox.selectSubLevel(this,this.parentNode.parentNode, this.checked);">
	</TD>					
 </tr>
 <tr level=3>
	<TD  class="<?= $CSSClass; ?>">
	<INPUT TYPE="CHECKBOX"  name="real-checkbox">
	</TD>					
 </tr>
 <tr level=3>
	<TD  class="<?= $CSSClass; ?>">
	<INPUT TYPE="CHECKBOX"  name="real-checkbox">
	</TD>					
 </tr>

*/
tool.input.checkbox.selectSubLevel = function(inputObj, domObj, defaultValue){
	var referenceLevel = 9999;
	var continueToLoop = true;
	var trNode;
	
	var MAX_TD_NODE = 1;
	var tdNodes;
	var tdNode;
	var inputNode
	var numOfTD 	= 0;
	var nodeLevel = 9999;
		
	referenceLevel = domObj.getAttribute('level');
//	alert('referenceLevel=' + referenceLevel);
	trNode = domObj;
	
	while(continueToLoop){
		if (!trNode){
			continueToLoop = false;
			break;
		}
		trNode = trNode.nextSibling;	
		// only handles TR
//		alert('trNode=' + trNode);
//		alert('trNode.nodeName=' + trNode.nodeName);
		if (trNode && trNode.nodeName == 'TR'){
//			alert('level=' + trNode.getAttribute('level'));		
			nodeLevel = trNode.getAttribute('level');
			
			// if level is equal or smaller then reference level, 
			// quite the loop
			if (nodeLevel != null && nodeLevel <= referenceLevel){
				continueToLoop = false;
				break;
			}
			tdNodes = trNode.childNodes;
//			alert('tdNodes length=' + tdNodes.length);
			numOfTD = 0;
			for (var x=0; x<tdNodes.length && numOfTD <MAX_TD_NODE; x++){
				if (tdNodes[x] && tdNodes[x].nodeName == 'TD'){				
					numOfTD++;
//					alert(tdNodes[x].nodeName + ' id=' + tdNodes[x].id + ' nodeName=' + tdNodes[x].nodeName);
					tdNode = tdNodes[x];
					for (var y=0; y<tdNode.childNodes.length; y++){
						if (tdNode.childNodes[y].nodeName == "INPUT"){
							inputNode = tdNode.childNodes[y];
//							alert('y=' + y + inputNode.getAttribute('name') + ' id=' + inputNode.id);
							inputNode.checked = defaultValue;
							break;
						}
					}
				}									
			}		
		}
	}
}