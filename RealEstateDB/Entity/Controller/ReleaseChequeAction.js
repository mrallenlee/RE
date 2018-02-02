// javascript required by ReleaseChequeAction
var nextChequeNumArray = new Array();

function getNewReleaseChequeHTMLForm(ReleaseTransactionsRecordPrefix){

	var nextChequeNum = nextChequeNumArray[ReleaseTransactionsRecordPrefix];
	if (typeof nextChequeNum == "undefined"){
		nextChequeNumArray[ReleaseTransactionsRecordPrefix] = 1;	
		nextChequeNum = 1;
	}
	
	var callbackObj = new Object();
	callbackObj.callback = getNewReleaseChequeHTMLForm_callback;
	callbackObj.extra_data= ReleaseTransactionsRecordPrefix;
	x_getNewReleaseChequeHTMLForm(nextChequeNum, ReleaseTransactionsRecordPrefix, callbackObj);

}


/**
* Note: Append new html code doesn't work with DOJO because dojo widget is redefined again.
* So new data can only assign into a DIV instead of appending to one DIV.
*/
function getNewReleaseChequeHTMLForm_callback(html, ReleaseTransactionsRecordPrefix){
//	alert(html);
//	alert(ReleaseTransactionsRecordPrefix);

	nextChequeNum = nextChequeNumArray[ReleaseTransactionsRecordPrefix];
	if (typeof nextChequeNum == "undefined"){
		nextChequeNumArray[ReleaseTransactionsRecordPrefix] = 1;	
		nextChequeNum = 1;
	}
	var chequeDIVName = ReleaseTransactionsRecordPrefix + '_Cheque_' + nextChequeNum + 'DIV';
	var chequeDIVObj = document.getElementById(chequeDIVName);
	var htmlWithDIV = '<h5>Release ' + nextChequeNum + ':</h5><table>' + html + '</table>';
	chequeDIVObj.innerHTML = htmlWithDIV;
	
	// Parse the new html code
	var frag  = parser.parseElement(chequeDIVObj, null, true);
	dojo.widget.getParser().createComponents(frag);
	
	// update next cheque num
	nextChequeNumArray[ReleaseTransactionsRecordPrefix]++;	
	chequeDIVObj.style.visibility="visible";
}

/**
* This function does not work because appending new dojo html into an existing DIV 
* will cause old dojo widget to load twice.
*/
function getNewReleaseChequeHTMLForm_callbackOLD(html, ReleaseTransactionsRecordPrefix){
//	alert(html);
//	alert(ReleaseTransactionsRecordPrefix);
	ReleaseTransactionsRecordDIVObj = document.getElementById(ReleaseTransactionsRecordPrefix + 'DIV');
//	ReleaseTransactionsRecordDIVObj = document.getElementById('dojoDebugOutput');

	nextChequeNum = nextChequeNumArray[ReleaseTransactionsRecordPrefix];
	if (typeof nextChequeNum == "undefined"){
		nextChequeNumArray[ReleaseTransactionsRecordPrefix] = 1;	
		nextChequeNum = 1;
	}
	var chequeDIVName = ReleaseTransactionsRecordPrefix + '_Cheque_' + nextChequeNum + 'DIV';
	var htmlWithDIV = '<DIV id="' + chequeDIVName + '"><h5>Release ' + nextChequeNum + ':</h5>' + html + '</DIV>';
	ReleaseTransactionsRecordDIVObj.innerHTML = ReleaseTransactionsRecordDIVObj.innerHTML + htmlWithDIV;
//	var result = ReleaseTransactionsRecordDIVObj.innerHTML + htmlWithDIV;
//	dojo.widget.byId('dojoDebugOutput').setContent(result);
	
	chequeDIVObj = document.getElementById(chequeDIVName);
	
	var frag  = parser.parseElement(ReleaseTransactionsRecordDIVObj, null, true);
	dojo.widget.getParser().createComponents(frag);
	
	// update next cheque num
	nextChequeNumArray[ReleaseTransactionsRecordPrefix]++;	
//	ReleaseTransactionsRecordDIVObj.style.visibility="visible";
}

/**
* Delete a Release cheque
* Param: ReleaseChequePrefix prefix for the cheque variables. 
* e.g. TransactionsRecord_N_Cheque_N
*/
function deleteReleaseCheque(ReleaseChequePrefix){
	var chequeDIVName = ReleaseChequePrefix + 'DIV';
	var divObj = document.getElementById(chequeDIVName);
	var chequeActionName = ReleaseChequePrefix + '_Action';
	var actionObj = document.getElementById(chequeActionName);
	actionObj.value = 'delete';
	divObj.style.display="none";	
}
