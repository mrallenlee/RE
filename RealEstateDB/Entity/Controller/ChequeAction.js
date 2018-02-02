// javascript required by ChequeAction
var nextChequeNumArray = new Array();

function getNewChequeHTMLForm(transactionsRecordPrefix){

	var nextChequeNum = nextChequeNumArray[transactionsRecordPrefix];
	if (typeof nextChequeNum == "undefined"){
		nextChequeNumArray[transactionsRecordPrefix] = 1;	
		nextChequeNum = 1;
	}
	
	var callbackObj = new Object();
	callbackObj.callback = getNewChequeHTMLForm_callback;
	callbackObj.extra_data= transactionsRecordPrefix;
	x_getNewChequeHTMLForm(nextChequeNum, transactionsRecordPrefix, callbackObj);

}


/**
* Note: Append new html code doesn't work with DOJO because dojo widget is redefined again.
* So new data can only assign into a DIV instead of appending to one DIV.
*/
function getNewChequeHTMLForm_callback(html, transactionsRecordPrefix){
//	alert(html);
//	alert(transactionsRecordPrefix);

	nextChequeNum = nextChequeNumArray[transactionsRecordPrefix];
	if (typeof nextChequeNum == "undefined"){
		nextChequeNumArray[transactionsRecordPrefix] = 1;	
		nextChequeNum = 1;
	}
	var chequeDIVName = transactionsRecordPrefix + '_Cheque_' + nextChequeNum + 'DIV';
	var chequeDIVObj = document.getElementById(chequeDIVName);
	var htmlWithDIV = '<table><tr><td>Cheque ' + nextChequeNum + ': </td></tr>' + html + '</table>';
	chequeDIVObj.innerHTML = htmlWithDIV;
	
	// Parse the new html code
	var frag  = parser.parseElement(chequeDIVObj, null, true);
	dojo.widget.getParser().createComponents(frag);
	
	// update next cheque num
	nextChequeNumArray[transactionsRecordPrefix]++;	
	chequeDIVObj.style.visibility="visible";
}

/**
* This function does not work because appending new dojo html into an existing DIV 
* will cause old dojo widget to load twice.
*/
function getNewChequeHTMLForm_callbackOLD(html, transactionsRecordPrefix){
//	alert(html);
//	alert(transactionsRecordPrefix);
	transactionsRecordDIVObj = document.getElementById(transactionsRecordPrefix + 'DIV');
//	transactionsRecordDIVObj = document.getElementById('dojoDebugOutput');

	nextChequeNum = nextChequeNumArray[transactionsRecordPrefix];
	if (typeof nextChequeNum == "undefined"){
		nextChequeNumArray[transactionsRecordPrefix] = 1;	
		nextChequeNum = 1;
	}
	var chequeDIVName = transactionsRecordPrefix + '_Cheque_' + nextChequeNum + 'DIV';
	var htmlWithDIV = '<DIV id="' + chequeDIVName + '"><h5>Cheque ' + nextChequeNum + ':</h5>' + html + '</DIV>';
	transactionsRecordDIVObj.innerHTML = transactionsRecordDIVObj.innerHTML + htmlWithDIV;
//	var result = transactionsRecordDIVObj.innerHTML + htmlWithDIV;
//	dojo.widget.byId('dojoDebugOutput').setContent(result);
	
	chequeDIVObj = document.getElementById(chequeDIVName);
	
	var frag  = parser.parseElement(transactionsRecordDIVObj, null, true);
	dojo.widget.getParser().createComponents(frag);
	
	// update next cheque num
	nextChequeNumArray[transactionsRecordPrefix]++;	
//	transactionsRecordDIVObj.style.visibility="visible";
}

/**
* Delete a cheque
* Param: ChequePrefix prefix for the cheque variables. 
* e.g. TransactionsRecord_N_Cheque_N
*/
function deleteCheque(ChequePrefix){
	var chequeDIVName = ChequePrefix + 'DIV';
	var divObj = document.getElementById(chequeDIVName);
	var chequeActionName = ChequePrefix + '_Action';
	var actionObj = document.getElementById(chequeActionName);
	actionObj.value = 'delete';
	divObj.style.display="none";	
}
