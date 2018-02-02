// javascript required by DepositChequeAction
var nextChequeNumArray = new Array();

function getNewDepositChequeHTMLForm(depositTransactionsRecordPrefix){

	var nextChequeNum = nextChequeNumArray[depositTransactionsRecordPrefix];
	if (typeof nextChequeNum == "undefined"){
		nextChequeNumArray[depositTransactionsRecordPrefix] = 1;	
		nextChequeNum = 1;
	}
	
	var callbackObj = new Object();
	callbackObj.callback = getNewDepositChequeHTMLForm_callback;
	callbackObj.extra_data= depositTransactionsRecordPrefix;
	x_getNewDepositChequeHTMLForm(nextChequeNum, depositTransactionsRecordPrefix, callbackObj);

}


/**
* Note: Append new html code doesn't work with DOJO because dojo widget is redefined again.
* So new data can only assign into a DIV instead of appending to one DIV.
*/
function getNewDepositChequeHTMLForm_callback(html, depositTransactionsRecordPrefix){
//	alert(html);
//	alert(depositTransactionsRecordPrefix);

	nextChequeNum = nextChequeNumArray[depositTransactionsRecordPrefix];
	if (typeof nextChequeNum == "undefined"){
		nextChequeNumArray[depositTransactionsRecordPrefix] = 1;	
		nextChequeNum = 1;
	}
	var chequeDIVName = depositTransactionsRecordPrefix + '_Cheque_' + nextChequeNum + 'DIV';
	var chequeDIVObj = document.getElementById(chequeDIVName);
	var htmlWithDIV = '<h5>Cheque ' + nextChequeNum + ':</h5><table>' + html + '</table>';
//	alert('htmlWithDIV=' + htmlWithDIV);
	chequeDIVObj.innerHTML = htmlWithDIV;
	
	// Parse the new html code
	var frag  = parser.parseElement(chequeDIVObj, null, true);
	dojo.widget.getParser().createComponents(frag);
	
	// update next cheque num
	nextChequeNumArray[depositTransactionsRecordPrefix]++;	
	chequeDIVObj.style.visibility="visible";
}

/**
* This function does not work because appending new dojo html into an existing DIV 
* will cause old dojo widget to load twice.
*/
function getNewDepositChequeHTMLForm_callbackOLD(html, depositTransactionsRecordPrefix){
//	alert(html);
//	alert(depositTransactionsRecordPrefix);
	depositTransactionsRecordDIVObj = document.getElementById(depositTransactionsRecordPrefix + 'DIV');
//	depositTransactionsRecordDIVObj = document.getElementById('dojoDebugOutput');

	nextChequeNum = nextChequeNumArray[depositTransactionsRecordPrefix];
	if (typeof nextChequeNum == "undefined"){
		nextChequeNumArray[depositTransactionsRecordPrefix] = 1;	
		nextChequeNum = 1;
	}
	var chequeDIVName = depositTransactionsRecordPrefix + '_Cheque_' + nextChequeNum + 'DIV';
	var htmlWithDIV = '<DIV id="' + chequeDIVName + '"><h5>Cheque ' + nextChequeNum + ':</h5>' + html + '</DIV>';
	depositTransactionsRecordDIVObj.innerHTML = depositTransactionsRecordDIVObj.innerHTML + htmlWithDIV;
//	var result = depositTransactionsRecordDIVObj.innerHTML + htmlWithDIV;
//	dojo.widget.byId('dojoDebugOutput').setContent(result);
	
	chequeDIVObj = document.getElementById(chequeDIVName);
	
	var frag  = parser.parseElement(depositTransactionsRecordDIVObj, null, true);
	dojo.widget.getParser().createComponents(frag);
	
	// update next cheque num
	nextChequeNumArray[depositTransactionsRecordPrefix]++;	
//	depositTransactionsRecordDIVObj.style.visibility="visible";
}

/**
* Delete a deposit cheque
* Param: depositChequePrefix prefix for the cheque variables. 
* e.g. TransactionsRecord_N_Cheque_N
*/
function deleteDepositCheque(depositChequePrefix){
	var chequeDIVName = depositChequePrefix + 'DIV';
	var divObj = document.getElementById(chequeDIVName);
	var chequeActionName = depositChequePrefix + '_Action';
	var actionObj = document.getElementById(chequeActionName);
	actionObj.value = 'delete';
	divObj.style.display="none";	
}
