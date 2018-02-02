// namespace
// expect variables predefined.
// GST, ADDITIONAL_CHANGE_TABLE_PREFIX, unitNumber
if (typeof(preview) === 'undefined'){
	preview = {};
}

// namespace
if (typeof(preview.table) === 'undefined'){
	preview.table = {};
}

function sanitizeAmt(amount) {
	var newAmount = amount;
	if (amount.indexOf('$') >= 0){
		newAmount = amount.substr(1);
	}
	newAmount = newAmount.replace(",", "");
	return newAmount*1;
}

preview.table.editRow = function (domID, unitNumber, description, price){
	
	var newPrice = price;
	if (price.indexOf('$') >= 0){
		newPrice = price.substr(1);
	}
	dojo.widget.byId('pane_additional_change').show();
	document.getElementById('ac_form_orgDesc').value = description;
	document.getElementById('ac_form_newDesc').value = description;
	document.getElementById('ac_form_newPrice').value = newPrice;
	document.getElementById('ac_form_act').value = 'edit';
	document.getElementById('ac_form_domID').value = domID;
	
	// center the floating pane	
	centerDIV(document.getElementById('pane_additional_change'));	
}

preview.table.addRow = function (unitNumber){
	var idCounter 	= document.getElementById('ac_form_domID_counter').value;
	document.getElementById('ac_form_domID_counter').value = eval(idCounter*1+1);
	
	dojo.widget.byId('pane_additional_change').show();
	document.getElementById('ac_form_act').value = 'add';
	document.getElementById('ac_form_orgDesc').value = '';
	document.getElementById('ac_form_newDesc').value = '';
	document.getElementById('ac_form_newPrice').value = '';
	document.getElementById('ac_form_domID').value = ADDITIONAL_CHANGE_TABLE_PREFIX + idCounter;
	// center the floating pane	
	centerDIV(document.getElementById('pane_additional_change'));	
}

function btnAddChangeCancel_Click(){
	dojo.widget.byId('pane_additional_change').hide();
}

function btnAddChangeDelete_Click() {	
	dojo.widget.byId('pane_additional_change').hide();
	var proceed = confirm('Are you sure you want to delete \'' + document.getElementById('ac_form_orgDesc').value + '\' ?');
	
	if (!proceed){
		return;		
	}
	
	document.getElementById('ac_form_act').value = 'delete';
	
	dojo.io.bind({
		formNode: document.additional_change_form,
		content: {act:document.getElementById('ac_form_act').value},
		mimetype: "text/plain",
		load:	btnUpdate_Callback,
		error: function(type,error){tool.dialog.errorDialog(error.message);}
	});	
} // btnAddChangeDelete_Click

function btnAddChangeOK_Click(){
	dojo.widget.byId('pane_additional_change').hide();

	dojo.io.bind({
		formNode: document.additional_change_form,
		content: {act:document.getElementById('ac_form_act').value},
		mimetype: "text/plain",
		load: btnUpdate_Callback,
		error: function(type,error){tool.dialog.errorDialog(error.message);}
	});	
}

// Calculate total
// use existing total plus amount coming from additional changes
function calculateTotal(){

	var maxId	= document.getElementById('ac_form_domID_counter').value;
	
	var calTotal = total;
	var calCredit = credit;
	
	for (var i=0; i < maxId; i++){
		var tdNode = document.getElementById(ADDITIONAL_CHANGE_TABLE_PREFIX + i + '_price');
		if (tdNode === null){
			continue;
		}
		var amount = tdNode.childNodes[0].nodeValue;
		var newAmount = amount;
		if (amount.indexOf('$') >= 0){
			newAmount = amount.substr(1);
		}
		amount = newAmount*1;
		
		if (amount > 0){
			calTotal += amount;
		} else {
			calCredit += amount;
		}
	}
	
	var calSalesTotal = calTotal + calCredit;
	var calGST = calSalesTotal * GST_RATE;
	var calTotalWithGST = calSalesTotal * (1+GST_RATE);
	
	if ( calSalesTotal < 0 ) // Don't tax -ve values
	{
		calGST = 0;
		calTotalWithGST = calSalesTotal;
	}

	// calculate outstanding amount
	var cashPayment = sanitizeAmt(document.getElementById('CashPayment').childNodes[0].nodeValue);
	var payByMortgage = sanitizeAmt(document.getElementById('PayByMortgage').childNodes[0].nodeValue);
	var outstandingAmt = calTotalWithGST - cashPayment - payByMortgage;
	
	// display new value
	document.getElementById('totalBeforeTaxes').childNodes[0].nodeValue = calTotal.toFixed(2);
	document.getElementById('credit').childNodes[0].nodeValue 			= calCredit.toFixed(2);
	document.getElementById('totalSales').childNodes[0].nodeValue 		= calSalesTotal.toFixed(2);
	document.getElementById('gst').childNodes[0].nodeValue 				= calGST.toFixed(2);
	document.getElementById('total').childNodes[0].nodeValue 			= calTotalWithGST.toFixed(2);
	document.getElementById('OutstandingAmt').childNodes[0].nodeValue 		= outstandingAmt.toFixed(2);
	
	var userIDToUpdate = document.getElementById('ac_price_form_userID').value;
	var priceToSave = Math.round(outstandingAmt * 100) / 100;
	
	// save "outstanding amount" into database

	$.ajax({
		type: "POST",
		url: "updateUserPrice.phtml",
		data: { priceType: "OutstandingAmt", newPrice: priceToSave, userID: userIDToUpdate },
		error: function (jqXHR, textStatus, errorThrown) {
			tool.dialog.errorDialog("Failed. " + errorThrown);
		}
	});
/*
	$.post("updateUserPrice.phtml",
	{
		priceType: "OutstandingAmt", newPrice: priceToSave, userID: userIDToUpdate
	},
  	function(data,status){
		alert('status=' + status + ' data=' + data);
  	});
*/
}

function btnUpdate_Callback(type, data){
//  alert('act=' + document.getElementById('ac_form_act').value);
  if (document.getElementById('ac_form_act').value === 'delete'){
  	var id = document.getElementById('ac_form_domID').value;
  	var rowObj = document.getElementById(id);
  	var parentObj = rowObj.parentNode;
  	parentObj.removeChild(rowObj);  	
  }
  else if (document.getElementById('ac_form_act').value === 'edit'){
  	var id		= document.getElementById('ac_form_domID').value;
  	var rowObj 	= document.getElementById(id);
  	var desc	= document.getElementById('ac_form_newDesc').value;  	
	var price	= document.getElementById('ac_form_newPrice').value;
	
  	var tdData  = new Array (desc, '$' + price);
  	// update each td record in this tr
  	tool.dom.upateTR(rowObj, tdData);
  }
  else if (document.getElementById('ac_form_act').value === 'add'){
  	var id		= document.getElementById('ac_form_domID').value;
  	var unitNumber	= document.getElementById('ac_form_unitNumber').value;
  	var rowObj 	= document.getElementById(ADDITIONAL_CHANGE_TABLE_PREFIX + 'ADD_BUTTON');
  	var desc	= document.getElementById('ac_form_newDesc').value;  	
	var price	= document.getElementById('ac_form_newPrice').value;
	
  	var tdData  = new Array (desc, '$' + price);
  	
  	// create the row
    var newRow 	= document.createElement("TR");
    newRow.id	= id;
    
	newRow.onclick	= function () {
//		eval('preview.table.editRow(this.id, ' + unitNumber + ', \'' + 
//			document.getElementById(this.id + '_desc').childNodes[0].nodeValue + '\', \'' +
//			document.getElementById(this.id + '_price').childNodes[0].nodeValue + '\')');
			
		preview.table.editRow(this.id, unitNumber, 
			document.getElementById(this.id + '_desc').childNodes[0].nodeValue,
			document.getElementById(this.id + '_price').childNodes[0].nodeValue);			
	}
    var newCell = document.createElement("TD");
    var textNode;
    // must add dummy space
    newCell.id	= id + '_desc';
    textNode 	= document.createTextNode("abc");
    newCell.appendChild(textNode);
    newCell.colSpan = 4;
    newRow.appendChild(newCell);    
    newCell 	= document.createElement("TD");
    newCell.id	= id + '_price';
    textNode 	= document.createTextNode("cde");
    newCell.appendChild(textNode);
    newCell.align="right";
    newRow.appendChild(newCell);

    rowObj.parentNode.insertBefore(newRow, rowObj);
  	// update each td record in this tr
  	tool.dom.upateTR(newRow, tdData);
  }  
  
	calculateTotal();
}

preview.editPrice = function (priceType, description, price){

	var newPrice = price;
	if (price.indexOf('$') >= 0){
		newPrice = price.substr(1);
	}
	dojo.widget.byId('pane_edit_price').show();
	document.getElementById('ac_price_form_price_title').childNodes[0].nodeValue = description;
	document.getElementById('ac_price_form_newPrice').value = sanitizeAmt(newPrice);
	document.getElementById('ac_price_form_priceType').value = priceType;	
	
	// center the floating pane	
	centerDIV(document.getElementById('pane_edit_price'));	
}

function btnEditPriceCancel_Click(){
	dojo.widget.byId('pane_edit_price').hide();
}

function btnEditPriceSave_Callback() {
	var priceType = document.getElementById('ac_price_form_priceType').value;
	var newPrice = document.getElementById('ac_price_form_newPrice').value;
	
	// set the new price onto the main page
	var span = document.getElementById(priceType);

	while( span.firstChild ) {
		span.removeChild( span.firstChild );
	}
	span.appendChild( document.createTextNode(newPrice) );
	
	calculateTotal();
}

function btnEditPriceSave_Click() {
	dojo.widget.byId('pane_edit_price').hide();
	
	dojo.io.bind({
		formNode: document.edit_price_form,
		mimetype: "text/plain",
		load: btnEditPriceSave_Callback,
		error: function(type,error){tool.dialog.errorDialog(error.message);}
	});	
}

function form_load(){
	// Event handling for "additional change" panel
	dojo.event.connect(dojo.widget.byId("btnAddChangeOK"), "onClick", btnAddChangeOK_Click);
	dojo.event.connect(dojo.widget.byId("btnAddChangeCancel"), "onClick", btnAddChangeCancel_Click);
	dojo.event.connect(dojo.widget.byId("btnAddChangeDelete"), "onClick", btnAddChangeDelete_Click);

	// Event handling for "edit price" panel
	dojo.event.connect(dojo.widget.byId("btnEditPriceSave"), "onClick", btnEditPriceSave_Click);
	dojo.event.connect(dojo.widget.byId("btnEditPriceCancel"), "onClick", btnEditPriceCancel_Click);
}


dojo.addOnLoad(form_load);
