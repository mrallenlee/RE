// Controler for proj_closing
dojo.addOnLoad(page_load);

// page init function
function page_load(){
  
  // register events
 	dojo.event.connect(dojo.byId("btnUpdate"), "onclick", btnUpdate_Click);
 	dojo.event.connect(dojo.byId("btnCalculate"), "onclick", btnCalculate_Click);
 	
 	// init form 
 	form_Init();
}

// init form data
function form_Init(){
  dojo.io.bind({
    url: "proj_closing_act.phtml",
    content: {act:"select"},
    method: "POST",
    mimetype:  "text/plain",
    load: form_Init_Callback,
    error: function(type, error){tool.dialog.errorDialog(error.message);}
  });
}

function form_Init_Callback(type, evlObj ) {
  //alert( "The script returned\n" + evlObj );
  eval("var projClosingObj = " + evlObj);
  
  var myform = document.proj_closing_form;

  // binding data to control
  tool.form.bindData2Control(projClosingObj, myform);
  myform.SixFeeProvTaxFlg.selectedIndex     = projClosingObj["SixFeeProvTaxFlg"];
  myform.SixFeeConnChargeFlg.selectedIndex  = projClosingObj["SixFeeConnChargeFlg"];
  myform.SixFeeWaterMeterFlg.selectedIndex  = projClosingObj["SixFeeWaterMeterFlg"];
  myform.SixFeeHydroChargeFlg.selectedIndex = projClosingObj["SixFeeHydroChargeFlg"];
}

// update project closing data
function btnUpdate_Click(){
  if(! validation()) return false;
  
  dojo.io.bind({
    formNode: document.proj_closing_form,
    content: {act:'update'},
    mimetype: "text/plain",
    load: btnUpdate_Callback,
    error: function(type, error){tool.dialog.errorDialog(error.message);}
  });
}

function btnUpdate_Callback(type, data){
  alert(data);
}

function validation() {
  var errstr = "";
  var myform = document.proj_closing_form;
  
  // set default
  if (myform.TaxRateYear1.value.trim()=="") myform.TaxRateYear1.value="0";
  if (myform.TaxRateYear2.value.trim()=="") myform.TaxRateYear2.value="0";
  if (myform.LandTaxYear1.value.trim()=="") myform.LandTaxYear1.value="0";
  if (myform.LandTaxYear2.value.trim()=="") myform.LandTaxYear2.value="0";
  if (myform.EstimatedRealtyTax.value.trim()=="") myform.EstimatedRealtyTax.value="0";
  if (myform.LawSocietyLevy.value.trim()=="") myform.LawSocietyLevy.value="0";
  if (myform.DischargeFee.value.trim()=="") myform.DischargeFee.value="0";
  if (myform.SixFeeProvTax.value.trim()=="") myform.SixFeeProvTax.value="0";
  if (myform.SixFeeConnCharge.value.trim()=="") myform.SixFeeConnCharge.value="0";
  if (myform.SixFeeHydroCharge.value.trim()=="") myform.SixFeeHydroCharge.value="0";
  if (myform.SixFeeWaterMeter.value.trim()=="") myform.SixFeeWaterMeter.value="0";
  if (myform.SixFeeDevCharge.value.trim()=="") myform.SixFeeDevCharge.value="0";
  if (myform.SixFeeTarion.value.trim()=="") myform.SixFeeTarion.value="0";
  if (myform.NumOfUnit.value.trim()=="") myform.NumOfUnit.value="0";
  if (myform.TotalArea.value.trim()=="") myform.TotalArea.value="0";
  if (myform.CamFeeRatePerSf.value.trim()=="") myform.CamFeeRatePerSf.value="0";
  if (myform.CamFeeParkingStall.value.trim()=="") myform.CamFeeParkingStall.value="0";
  if (myform.CamFeeTandemParking.value.trim()=="") myform.CamFeeTandemParking.value="0";
  if (myform.CamFeeParkingStorage.value.trim()=="") myform.CamFeeParkingStorage.value="0";
  if (myform.CamFeeLocker.value.trim()=="") myform.CamFeeLocker.value="0";
  if (myform.CamFeeBikeRack.value.trim()=="") myform.CamFeeBikeRack.value="0";
  if (myform.CamFeeMthTaxRecovery.value.trim()=="") myform.CamFeeMthTaxRecovery.value="0";
  
  if (! tool.validator.isNumeric(myform.TaxRateYear1.value)) errstr += "1st year Tax Rate must be numberic.\n";
  if (! tool.validator.isNumeric(myform.TaxRateYear2.value)) errstr += "2nd year Tax Rate must be numberic.\n";
  if (! tool.validator.isNumeric(myform.LandTaxYear1.value)) errstr += "1st year Land Tax must be numberic.\n";
  if (! tool.validator.isNumeric(myform.LandTaxYear2.value)) errstr += "2nd year Land Tax must be numberic.\n";
  if (! tool.validator.isNumeric(myform.EstimatedRealtyTax.value)) errstr += "Estimated Realty Tax must be numberic.\n";
  if (! tool.validator.isNumeric(myform.LawSocietyLevy.value)) errstr += "Law society levy must be numberic.\n";
  if (! tool.validator.isNumeric(myform.DischargeFee.value)) errstr += "Discharge Fee must be numberic.\n";
  if (! tool.validator.isNumeric(myform.SixFeeProvTax.value)) errstr += "Provincial sales tax on chattels must be numberic.\n";
  if (! tool.validator.isNumeric(myform.SixFeeConnCharge.value)) errstr += "Water and Sewer Connection Charges must be numberic.\n";
  if (! tool.validator.isNumeric(myform.SixFeeWaterMeter.value)) errstr += "Water Meter must be numberic.\n";
  if (! tool.validator.isNumeric(myform.SixFeeHydroCharge.value)) errstr += "Hydro meter and installation Charges must be numberic.\n";
  if (! tool.validator.isNumeric(myform.SixFeeDevCharge.value)) errstr += "Development Charge must be numberic.\n";
  if (! tool.validator.isNumeric(myform.SixFeeTarion.value)) errstr += "Tarion must be numberic.\n";
  if (! tool.validator.isNumeric(myform.NumOfUnit.value)) errstr += "Number of Unit must be numberic.\n";
  if (! tool.validator.isNumeric(myform.TotalArea.value)) errstr += "Total Residential Area must be numberic.\n";
  if (! tool.validator.isNumeric(myform.CamFeeRatePerSf.value)) errstr += "The Cam Rate Per sf must be numberic.\n";
  if (! tool.validator.isNumeric(myform.CamFeeParkingStall.value)) errstr += "Parking Stall CAM must be numberic.\n";
  if (! tool.validator.isNumeric(myform.CamFeeTandemParking.value)) errstr += "Tandem Parking CAM must be numberic.\n";
  if (! tool.validator.isNumeric(myform.CamFeeParkingStorage.value)) errstr += "Parking Storage Units CAM must be numberic.\n";
  if (! tool.validator.isNumeric(myform.CamFeeLocker.value)) errstr += "Locker CAM must be numberic.\n";
  if (! tool.validator.isNumeric(myform.CamFeeBikeRack.value)) errstr += "Bike Rack CAM must be numberic.\n";
  if (! tool.validator.isNumeric(myform.CamFeeMthTaxRecovery.value)) errstr += "Standard Monthly Tax Recovery Date During Occupancy must be numberic.\n";
  
  if(errstr!="") tool.dialog.errorDialog(errstr);
  return errstr=="" ;
}

// generate user closing data
function btnCalculate_Click(){
	dojo.byId("btnCalculate").disabled = true;
  dojo.io.bind({
    formNode: document.proj_closing_form,
    content: {act:'calculate'},
    mimetype: "text/plain",
    load: btnCalcualte_Callback,
    error: function(type, error){tool.dialog.errorDialog(error.message);}
  });
}

function btnCalcualte_Callback(type, data){
	dojo.byId("btnCalculate").disabled = false;
  alert(data);
}


