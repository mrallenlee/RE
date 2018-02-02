// Controler for user_closing
dojo.addOnLoad(page_load);

// page init function
function page_load(){
  
  // register events
 	dojo.event.connect(dojo.byId("btnUpdate"), "onclick", btnUpdate_Click);
 	dojo.event.connect(dojo.byId("btnRecal"), "onclick", btnRecal_Click);
 	dojo.event.connect(dojo.byId("btnAddCAM"), "onclick", btnAddCAM_Click);
 	// This is disabled. See comment in the GSTRebate_Click function
// 	dojo.event.connect(document.user_closing_form.QualifyGSTRebate, "onclick", GSTRebate_Click);
 	
 	// init form 
 	form_Init();
}

// init form data
function form_Init(){
  //tool.dialog.objectDialog(_REQUEST);
  if(typeof( _REQUEST)== "undefined" || !_REQUEST["UnitNumber"]) {
    tool.dialog.errorDialog("This page was opened with an invalid request.");
    return;
  }
    
  dojo.io.bind({
    url: "user_closing_act.phtml",
    content: {act:"select", UnitNumber:_REQUEST["UnitNumber"]},
    method: "POST",
    mimetype:  "text/plain",
    load: form_Init_Callback,
    error: function(type, error){tool.dialog.errorDialog(error.message);}
  });
}

function form_Init_Callback(type, evlObj ) {
//  alert( "The script returned\n" + evlObj );
  try {
    eval("userClosingObj = " + evlObj);
  } catch (e) {
    tool.dialog.errorDialog(evlObj);
    return;
  }
  
  var myform = document.user_closing_form;

  // binding data to control
  tool.form.bindData2Control(userClosingObj, myform, {numberFormat:true});
  document.getElementById("UnitNumber").innerHTML = userClosingObj.UnitNumber;
  document.getElementById("Purchaser").innerHTML = userClosingObj.FirstName + " " + userClosingObj.LastName;
//  document.getElementById("AdditionalPurchaser").innerHTML = userClosingObj.AdditionalPurchaser;  
  myform.QualifyGSTRebate.checked = (userClosingObj.QualifyGSTRebate == 1);
  
  cam_data2controls();  
}

// calculate GST rebate
// This function is not currently called because
// the value is not needed to recalculate even the 
// purchaser is not qualified for GST rebate.
// The price differences will be adjusted during 
// final closing
function GSTRebate_Click() {
	var myform = document.user_closing_form;
	if(myform.QualifyGSTRebate.checked) {
	  dojo.io.bind({
	    formNode: document.user_closing_form,
	    content: {act:'gst_rebate'},
	    mimetype: "text/plain",
	    load: GSTRebate_Callback,
	    error: function(type, error){tool.dialog.errorDialog(error.message);}
	  });
	  
	} else {
		myform.GSTRebate.value = 0;
		myform.NetGSTPayable.value = myform.GST.value;
		myform.ASPNetGST.value = myform.OfferPrice.value;
	}
}

function GSTRebate_Callback(type, evlObj) {
//	alert( "The script returned\n" + evlObj );
	eval("var userClosingObj = " + evlObj);
//	tool.dialog.objectDialog(userClosingObj);

	tool.form.bindData2Control(userClosingObj, document.user_closing_form);
}

// update user closing data
function btnUpdate_Click(){
  if(! validation()) return false;
  
  dojo.io.bind({
    formNode: document.user_closing_form,
    content: {
              act:'update', 
              UnitNumber:_REQUEST["UnitNumber"],
              CAM: cam_controls2data()  // pass CAM data as JSON 
             },
    mimetype: "text/plain",
    load: btnUpdate_Callback,
    error: function(type, error){tool.dialog.errorDialog(error.message);}
  });
}

function btnUpdate_Callback(type, data){
  alert(data);
  form_Init();
}

function validation() {
  var errstr = "";
  var myform = document.user_closing_form;
  
  // set default
//  if (myform.SixFeeProvTax.value.trim()=="") myform.SixFeeProvTax.value="0";
//  if (myform.SixFeeConnCharge.value.trim()=="") myform.SixFeeConnCharge.value="0";
//  if (myform.SixFeeHydroCharge.value.trim()=="") myform.SixFeeHydroCharge.value="0";
//  if (myform.SixFeeWaterMeter.value.trim()=="") myform.SixFeeWaterMeter.value="0";
//  if (myform.SixFeeDevCharge.value.trim()=="") myform.SixFeeDevCharge.value="0";
//  if (myform.SixFeeTarion.value.trim()=="") myform.SixFeeTarion.value="0";
  if (myform.AdmFeeCheqRecovery.value.trim()=="") myform.AdmFeeCheqRecovery.value="0";
  if (myform.AdmFeeCommExpense.value.trim()=="") myform.AdmFeeCommExpense.value="0";
  if (myform.AdmFeeStatutory.value.trim()=="") myform.AdmFeeStatutory.value="0";
  if (myform.AdmFeeLawSociety.value.trim()=="") myform.AdmFeeLawSociety.value="0";
  if (myform.AdmFeeMsf.value.trim()=="") myform.AdmFeeMsf.value="0";
  if (myform.AdmFeeMortageCharge.value.trim()=="") myform.AdmFeeMortageCharge.value="0";
  if (myform.AdmFeeCreditMaint.value.trim()=="") myform.AdmFeeCreditMaint.value="0";
  if (myform.AdmFeeCreditPurchase.value.trim()=="") myform.AdmFeeCreditPurchase.value="0";
  if (myform.AdmFeeOutstanding.value.trim()=="") myform.AdmFeeOutstanding.value="0";
  if (myform.UnitCAM.value.trim()=="") myform.UnitCAM.value="0";
  
//  if (! tool.validator.isNumeric(myform.SixFeeProvTax.value)) errstr += "Provincial sales tax on chattels must be numberic.\n";
//  if (! tool.validator.isNumeric(myform.SixFeeConnCharge.value)) errstr += "Water and Sewer Connection Charges must be numberic.\n";
//  if (! tool.validator.isNumeric(myform.SixFeeWaterMeter.value)) errstr += "Water Meter must be numberic.\n";
//  if (! tool.validator.isNumeric(myform.SixFeeHydroCharge.value)) errstr += "Hydro meter and installation Charges must be numberic.\n";
//  if (! tool.validator.isNumeric(myform.SixFeeDevCharge.value)) errstr += "Development Charge must be numberic.\n";
//  if (! tool.validator.isNumeric(myform.SixFeeTarion.value)) errstr += "Tarion must be numberic.\n";
  if (! tool.validator.isNumeric(myform.AdmFeeCheqRecovery.value)) errstr += "Cheque Recovery Costs must be numberic.\n";
  if (! tool.validator.isNumeric(myform.AdmFeeCommExpense.value)) errstr += "Estimated Total Common Expenses must be numberic.\n";
  if (! tool.validator.isNumeric(myform.AdmFeeStatutory.value)) errstr += "Statutory Interest(From Lawyer) must be numberic.\n";
  if (! tool.validator.isNumeric(myform.AdmFeeLawSociety.value)) errstr += "Law Society Charges must be numberic.\n";
  if (! tool.validator.isNumeric(myform.AdmFeeMsf.value)) errstr += "NSF Fees must be numberic.\n";
  if (! tool.validator.isNumeric(myform.AdmFeeMortageCharge.value)) errstr += "Mortage Discharge Fee must be numberic.\n";
  if (! tool.validator.isNumeric(myform.AdmFeeCreditMaint.value)) errstr += "Credit One Year Maintenance Fees must be numberic.\n";
  if (! tool.validator.isNumeric(myform.AdmFeeCreditPurchase.value)) errstr += "Credit Purchase Price on Closing must be numberic.\n";
  if (! tool.validator.isNumeric(myform.AdmFeeOutstanding.value)) errstr += "Outstanding Options Charges must be numberic.\n";
//  
  if(errstr!="") tool.dialog.errorDialog(errstr);
  return errstr=="" ;
}


// Recalculate Closing Data for the Unit
function btnRecal_Click(){
	var answer = confirm ("Do you want to recalculate the current Unit Closing Data?\nIf Yes, existing data will be overwritten.");
	if (answer) {
	  dojo.io.bind({
	    formNode: document.user_closing_form,
	    content: {act:'recalculate', UnitNumber:_REQUEST["UnitNumber"]},
	    mimetype: "text/plain",
	    load: btnRecal_Callback,
	    error: function(type, error){tool.dialog.errorDialog(error.message);}
	  });
	}
}

function btnRecal_Callback(type, data){
  alert(data);
  form_Init();
}


// add CAM
function btnAddCAM_Click() {
  var camTable = document.getElementById("CAMtable").tBodies[0];
  var newCAM = camTable.rows[camTable.rows.length - 1].cloneNode(true);
  newCAM.cells[0].firstChild.options[0].selected=true;
  newCAM.cells[1].firstChild.value='';
  newCAM.cells[2].firstChild.value='';
  newCAM.cells[3].firstChild.value='';
  newCAM.cells[4].firstChild.value='';
  camTable.appendChild(newCAM);
}

// del CAM
function btnDelCAM_Click(btn) {
  var row = btn.parentNode.parentNode; 
  if(row.parentNode.rows.length > 3) {
    row.parentNode.deleteRow(row.sectionRowIndex);
  } else {
    row.cells[0].firstChild.options[0].selected=true;
    row.cells[1].firstChild.value='';
    row.cells[2].firstChild.value='';
    row.cells[3].firstChild.value='';
    row.cells[4].firstChild.value='';
  }
    
}

// CAM data2controls, controls2data
function cam_controls2data() {
  var camTable = document.getElementById("CAMtable").tBodies[0];
  var cams = [];
  for(var i = 2; i<camTable.rows.length; i++) {
    var row = camTable.rows[i];
    var cam = {
          ItemType: row.cells[0].firstChild.value,
          Price: row.cells[1].firstChild.value,
          ItemNumber: row.cells[2].firstChild.value,
          ItemLevel: row.cells[3].firstChild.value,
          CAM:row.cells[4].firstChild.value,
          UserID: userClosingObj.UserID
        }
        
    if(cam.Price != "" || cam.ItemNumber != "" || cam.ItemLevel != "" || cam.CAM != "") 
      cams.push(cam);  
  }
  
  return JSON.stringify(cams);
}
function cam_data2controls() {
  var cnt = userClosingObj.CAM.length + 2;
  for(var i=3; i<cnt; i++) btnAddCAM_Click();
  
  var camTable = document.getElementById("CAMtable").tBodies[0];
  for(var i=2; i<cnt; i++) {
    var row = camTable.rows[i];
    row.cells[0].firstChild.options[0].selected=true;
    setSelectValue(row.cells[0].firstChild, userClosingObj.CAM[i-2].ItemType);
    row.cells[1].firstChild.value =userClosingObj.CAM[i-2].Price;
    row.cells[2].firstChild.value =userClosingObj.CAM[i-2].ItemNumber;
    row.cells[3].firstChild.value =userClosingObj.CAM[i-2].ItemLevel;
    row.cells[4].firstChild.value =userClosingObj.CAM[i-2].CAM;
  }
}

// Data Model
var userClosingObj ={};

// utiltiy
function setSelectValue(/* Select DOM element */ domSelect, /* value */ v){
  for(var i=0; i<domSelect.options.length; i++) {
    if(domSelect.options[i].value == v) {
      domSelect.selectedIndex = i;
      break;
    }
  }
}