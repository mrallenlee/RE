// Controler for proj_closing
dojo.addOnLoad(page_load);

function number_format(nbr,dec) {
	if(dec==undefined) dec=0;
	var result = Number(nbr).toFixed(dec);
	
	var nStr = '' + result;
	var x = nStr.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return '$' + x1 + x2;
}

var INTERIM_TABLE_TEMPLATE='\
<table id="interim_statement"> \
 	<tr class="head"> \
      <td>Unit Number</td> \
      <td>Purchaser Name</td> \
      <td>Occupancy Date</td> \
      <td>Offer Price</td> \
      <td>Contracted Deposit</td> \
      <td>Total Deposit</td> \
      <td>Unadjusted Balance</td> \
      <td>Balance Due On final Closing</td> \
      <td>Occupancy Fee</td> \
      <td>ProRated Occupancy Fee</td> \
      <td>Total Common Expenses</td> \
      <td>Realty Taxes</td> \
      <td>Interest On Balance</td> \
      <td>Tarion Number</td> \
      <td>Additional Purchaser</td> \
      <td>CAM Unit Nbr</td> \
      <td>CAM Unit Level</td> \
      <td>CAM Reg Parking Nbr</td> \
      <td>CAM Reg Parking Level</td> \
      <td>CAM Compact Parking Nbr</td> \
      <td>CAM Compact Parking Level</td> \
      <td>CAM Tandem Parking Nbr</td> \
      <td>CAM Tandem Parking Level</td> \
      <td>CAM Reg Locker Nbr</td> \
      <td>CAM Reg Locker Level</td> \
      <td>CAM Bike Racker Nbr</td> \
      <td>CAM Bike Racker Level</td> \
      <td>ProRated CAM</td> \
      <td>ProRated Tax</td> \
      <td>ProRated Interest</td> \
    </tr> \
    <!--XXXX--> \
</table> \
';
var  INTERIM_TABLE_HEADER='\
 <tr class="head"> \
      <td>Unit Number</td> \
      <td>Purchaser Name</td> \
      <td>Occupancy Date</td> \
      <td>Offer Price</td> \
      <td>Contracted Deposit</td> \
      <td>Total Deposit</td> \
      <td>Unadjusted Balance</td> \
      <td>Balance Due On final Closing</td> \
      <td>Occupancy Fee</td> \
      <td>ProRated Occupancy Fee</td> \
      <td>Total Common Expenses</td> \
      <td>Realty Taxes</td> \
      <td>Interest On Balance</td> \
      <td>Tarion Number</td> \
      <td>Additional Purchaser</td> \
      <td>CAM Unit Nbr</td> \
      <td>CAM Unit Level</td> \
      <td>CAM Reg Parking Nbr</td> \
      <td>CAM Reg Parking Level</td> \
      <td>CAM Compact Parking Nbr</td> \
      <td>CAM Compact Parking Level</td> \
      <td>CAM Tandem Parking Nbr</td> \
      <td>CAM Tandem Parking Level</td> \
      <td>CAM Reg Locker Nbr</td> \
      <td>CAM Reg Locker Level</td> \
      <td>CAM Bike Racker Nbr</td> \
      <td>CAM Bike Racker Level</td> \
      <td>ProRated CAM</td> \
      <td>ProRated Tax</td> \
      <td>ProRated Interest</td> \
    </tr> \
';

var FINAL_TABLE_TEMPLATE='\
<table id="final_statement"> \
    <tr class="head"> \
      <td>Unit Number</td> \
      <td>Purchaser Name</td> \
      <td>Purchaser Address</td> \
      <td>Tarion Number</td> \
      <td>Offer Price</td> \
      <td>GST</td> \
      <td>Contracted Deposit</td> \
      <td>Total Deposit Paid</td> \
      <td>Occupancy Date</td> \
      <td>Occupancy Deposit</td> \
      <td>Deposit Interest</td> \
      <td>Unit CAM Fee</td> \
      <td>Unit CAM Fee ProRated</td> \
      <td>Unit CAM Fee Paid</td> \
      <td>Parking CAM Fee</td> \
      <td>Parking CAM Fee ProRated</td> \
      <td>Parking CAM Fee Paid</td> \
      <td>Locker CAM Fee</td> \
      <td>Locker CAM Fee ProRated</td> \
      <td>Locker CAM Fee Paid</td> \
      <td>Number Of Unit</td> \
      <td>1st Year Total Realty Land Taxes</td> \
      <td>2nd Year Total Realty Land Taxes</td> \
      <td>1st Year SupplementalRealty Land Taxes</td> \
      <td>2nd Year SupplementalRealty Land Taxes</td> \
      <td>Sales Taxon Chattels</td> \
      <td>Development Fee</td> \
      <td>Tarion Fee</td> \
      <td>Water And Swere Connection Fee</td> \
      <td>Hydro Meter Fee</td> \
      <td>Water Meter Fee</td> \
      <td>Law Society Levy</td> \
      <td>Cheque Recovery Cost</td> \
      <td>Discharge Fee</td> \
      <td>Credit Amount</td> \
      <td>Credit Description</td> \
      <td>Balance</td> \
      <td>Occupancy Fee</td> \
    </tr> \
    <!--XXXX--> \
</table> \
';

var FINAL_TABLE_HEADER ='\
    <tr class="head"> \
      <td>Unit Number</td> \
      <td>Purchaser Name</td> \
      <td>Purchaser Address</td> \
      <td>Tarion Number</td> \
      <td>Offer Price</td> \
      <td>GST</td> \
      <td>Contracted Deposit</td> \
      <td>Total Deposit Paid</td> \
      <td>Occupancy Date</td> \
      <td>Occupancy Deposit</td> \
      <td>Deposit Interest</td> \
      <td>Unit CAM Fee</td> \
      <td>Unit CAM Fee ProRated</td> \
      <td>Unit CAM Fee Paid</td> \
      <td>Parking CAM Fee</td> \
      <td>Parking CAM Fee ProRated</td> \
      <td>Parking CAM Fee Paid</td> \
      <td>Locker CAM Fee</td> \
      <td>Locker CAM Fee ProRated</td> \
      <td>Locker CAM Fee Paid</td> \
      <td>Number Of Unit</td> \
      <td>1st Year Total Realty Land Taxes</td> \
      <td>2nd Year Total Realty Land Taxes</td> \
      <td>1st Year SupplementalRealty Land Taxes</td> \
      <td>2nd Year SupplementalRealty Land Taxes</td> \
      <td>Sales Taxon Chattels</td> \
      <td>Development Fee</td> \
      <td>Tarion Fee</td> \
      <td>Water And Swere Connection Fee</td> \
      <td>Hydro Meter Fee</td> \
      <td>Water Meter Fee</td> \
      <td>Law Society Levy</td> \
      <td>Cheque Recovery Cost</td> \
      <td>Discharge Fee</td> \
      <td>Credit Amount</td> \
      <td>Credit Description</td> \
      <td>Balance</td> \
      <td>Occupancy Fee</td> \
    </tr> \
 ';

// page init function
function page_load(){
  
  // register events
 	dojo.event.connect(dojo.byId("btnGo"), "onclick", btnGo_Click);
 	dojo.event.connect(dojo.byId("btnDelete"), "onclick", btnDelete_Click);
 	dojo.event.connect(dojo.byId("btnDownload"), "onclick", btnDownload_Click);
 	
 	// init form 
 	form_Init();
}

// init form data
function form_Init(){
  
  // get list of old statements
  dojo.io.bind({
    url: "statement_act.phtml",
    content: {act:"list_old_statements"},
    method: "POST",
    mimetype:  "text/plain",
    load: form_Init_Callback,
    error: function(type, error){tool.dialog.errorDialog(error.message);}
  });
}

function form_Init_Callback(type, evlObj ) {
//  alert( "The script returned\n" + evlObj );
  try {
    eval("var statements = " + evlObj);
  } catch (e) {
    tool.dialog.errorDialog(evlObj);
    return;
  }
    
  var form = document.statement_form;
  var ctrl_statemnt = form.statement.options;
  ctrl_statemnt.length=0;
  ctrl_statemnt[ctrl_statemnt.length] = new Option("New Interim Statement","NewInterimStatement");
  ctrl_statemnt[ctrl_statemnt.length] = new Option("New Final Statement","NewFinalStatement");

  for (var i in statements) {
    ctrl_statemnt[ctrl_statemnt.length] = new Option(statements[i], statements[i]);
  }  
  
  document.getElementById("statment_table").innerHTML = "" ;

}

function btnGo_Click(){
	dojo.byId("btnGo").disabled = true;
  dojo.io.bind({
    formNode: document.statement_form,
    content: {act:'get_statement'},
    mimetype: "text/plain",
    load: btnGo_Callback,
    error: function(type, error){tool.dialog.errorDialog(error.message);}
  });
  
}

function btnGo_Callback(type, evlObj){
	dojo.byId("btnGo").disabled = false;
	
	if(document.statement_form.statement.value.indexOf("New")>=0) {
		if(evlObj.indexOf("Interim")==0  || evlObj.indexOf("Final")==0) {
			alert("Statement " + evlObj + " has been generated successfully.");
			
		  var form = document.statement_form;
		  var ctrl_statemnt = form.statement.options;
		  ctrl_statemnt[ctrl_statemnt.length] = new Option(evlObj,evlObj);
		  ctrl_statemnt[ctrl_statemnt.length - 1].selected = true;
		  btnGo_Click();
		} else {
			tool.dialog.errorDialog(evlObj);
		}

		return;
	}
	
//  alert( "The script returned\n" + evlObj );
  try {
  	
    eval("var statementData = " + evlObj);
  } catch (e) {
    tool.dialog.errorDialog(evlObj);
    return;
  }

  var form = document.statement_form;
  var rowBuf = new tool.string.StringBuffer();
  
  if(form.statement.value.indexOf('Interim')>=0) {
    for (var i in statementData) {
    	if(i==1) alert(number_format(row["ProRatedCAM"]));
      var row = statementData[i];
      rowBuf.append("<tr>");
      rowBuf.append("<td>", row["UnitNumber"],"</td>");
      rowBuf.append("<td>", row["PurchaserName"],"</td>");
      rowBuf.append("<td align='right'>", row["OccupancyDate"], "</td>");
      rowBuf.append("<td align='right'>", number_format(row["OfferPrice"]), "</td>");
      rowBuf.append("<td align='right'>", number_format(row["ContractedDeposit"],2), "</td>");
      rowBuf.append("<td align='right'>", number_format(row["TotalDeposit"],2), "</td>");
      rowBuf.append("<td align='right'>", number_format(row["UnadjustedBalance"],2), "</td>");
      rowBuf.append("<td align='right'>", number_format(row["BalanceDueOnFinalClosing"],2), "</td>");
      rowBuf.append("<td align='right'>", number_format(row["OccupancyFee"],2), "</td>");
      rowBuf.append("<td align='right'>", number_format(row["ProRatedOccupancyFee"],2), "</td>");
      rowBuf.append("<td align='right'>", number_format(row["TotalCommonExpenses"],2), "</td>");
      rowBuf.append("<td align='right'>", number_format(row["RealtyTaxes"],2), "</td>");
      rowBuf.append("<td align='right'>", number_format(row["InterestOnBalance"],2), "</td>");
      rowBuf.append("<td align='right'>", row["TarionNumber"], "</td>");
      rowBuf.append("<td>", row["AdditionalPurchaser"], "</td>");
      rowBuf.append("<td align='right'>", row["UnitNbr"], "</td>");
      rowBuf.append("<td align='right'>", row["UnitLevel"], "</td>");
      rowBuf.append("<td align='right'>", row["RegParkingNumber"], "</td>");
      rowBuf.append("<td align='right'>", row["RegParkingLevel"], "</td>");
      rowBuf.append("<td align='right'>", row["CompactParkingNumber"], "</td>");
      rowBuf.append("<td align='right'>", row["CompactParkingLevel"], "</td>");
      rowBuf.append("<td align='right'>", row["TandemParkingNumber"], "</td>");
      rowBuf.append("<td align='right'>", row["TandemParkingLevel"], "</td>");
      rowBuf.append("<td align='right'>", row["RegLockerNumber"], "</td>");
      rowBuf.append("<td align='right'>", row["RegLockerLevel"], "</td>");
      rowBuf.append("<td align='right'>", row["BikeRackerNumber"], "</td>");
      rowBuf.append("<td align='right'>", row["BikeRackerLevel"], "</td>");
      rowBuf.append("<td align='right'>", number_format(row["ProRatedCAM"]), "</td>");
      rowBuf.append("<td align='right'>", number_format(row["ProRatedTax"]), "</td>");
      rowBuf.append("<td align='right'>", number_format(row["ProRatedInterest"]), "</td>");
      rowBuf.append("</tr>");
      if ((i%HEADER_ROW)==24) rowBuf.append(INTERIM_TABLE_HEADER);
    }
    
    document.getElementById("statment_table").innerHTML = INTERIM_TABLE_TEMPLATE.replace("<!--XXXX-->", rowBuf.toString());

  } else { //final statement

    for (var i in statementData) {
      var row = statementData[i];
      rowBuf.append("<tr>");
      rowBuf.append("<td>", row["UnitNumber"], "</td>");
      rowBuf.append("<td>", row["PurchaserName"], "</td>");
      rowBuf.append("<td>", row["PurchaserAddress"], "</td>");
      rowBuf.append("<td>", row["TarionNumber"], "</td>");
      rowBuf.append("<td>", number_format(row["OfferPrice"],2), "</td>");
      rowBuf.append("<td>", number_format(row["GST"],2), "</td>");
      rowBuf.append("<td>", number_format(row["ContractedDeposit"],2), "</td>");
      rowBuf.append("<td>", number_format(row["TotalDepositPaid"],2), "</td>");
      rowBuf.append("<td>", number_format(row["OccupancyDate"],2), "</td>");
      rowBuf.append("<td>", number_format(row["OccupancyDeposit"],2), "</td>");
      rowBuf.append("<td>", number_format(row["DepositInterest"],2), "</td>");
      rowBuf.append("<td>", number_format(row["UnitCamFee"],2), "</td>");
      rowBuf.append("<td>", number_format(row["UnitCamFeeProRated"],2), "</td>");
      rowBuf.append("<td>", number_format(row["UnitCamFeePaid"],2), "</td>");
      rowBuf.append("<td>", number_format(row["ParkingCamFee"],2), "</td>");
      rowBuf.append("<td>", number_format(row["ParkingCamFeeProRated"],2), "</td>");
      rowBuf.append("<td>", number_format(row["ParkingCamFeePaid"],2), "</td>");
      rowBuf.append("<td>", number_format(row["LockerCamFee"],2), "</td>");
      rowBuf.append("<td>", number_format(row["LockerCamFeeProRated"],2), "</td>");
      rowBuf.append("<td>", number_format(row["LockerCamFeePaid"],2), "</td>");
      rowBuf.append("<td>", row["NumberOfUnit"], "</td>");
      rowBuf.append("<td>", number_format(row["LandTaxYear1"],2), "</td>");
      rowBuf.append("<td>", number_format(row["LandTaxYear2"],2), "</td>");
      rowBuf.append("<td>", number_format(row["SupplLandTaxYear1"],2), "</td>");
      rowBuf.append("<td>", number_format(row["SupplLandTaxYear2"],2), "</td>");
      rowBuf.append("<td>", number_format(row["SixFeeProvTax"],2), "</td>");
      rowBuf.append("<td>", number_format(row["SixFeeConnCharge"],2), "</td>");
      rowBuf.append("<td>", number_format(row["SixFeeWaterMeter"],2), "</td>");
      rowBuf.append("<td>", number_format(row["SixFeeHydroCharge"],2), "</td>");
      rowBuf.append("<td>", number_format(row["SixFeeDevCharge"],2), "</td>");
      rowBuf.append("<td>", number_format(row["SixFeeTarion"],2), "</td>");
      rowBuf.append("<td>", number_format(row["LawSocietyLevy"],2), "</td>");
      rowBuf.append("<td>", number_format(row["CheqRecoveryCost"],2), "</td>");
      rowBuf.append("<td>", number_format(row["DischargeFee"],2), "</td>");
      rowBuf.append("<td>", number_format(row["CreditAmount"],2), "</td>");
      rowBuf.append("<td>", number_format(row["CreditDescription"],2), "</td>");
      rowBuf.append("<td>", number_format(row["Balance"],2), "</td>");
      rowBuf.append("<td>", number_format(row["OccupancyFee"],2), "</td>");
      rowBuf.append("</tr>");
      if ((i%HEADER_ROW)==24) rowBuf.append(FINAL_TABLE_HEADER);
    }        
   	
		document.getElementById("statment_table").innerHTML = FINAL_TABLE_TEMPLATE.replace("<!--XXXX-->", rowBuf.toString());
  }
}


function btnDelete_Click(){
  if(document.statement_form.statement.value.indexOf("New")>=0) {
		tool.dialog.errorDialog("Please select a existing statement first!");  	
		return false;
	}
	
  dojo.io.bind({
    formNode: document.statement_form,
    content: {act:'del_statement'},
    mimetype: "text/plain",
    load: btnDelete_Callback,
    error: function(type, error){tool.dialog.errorDialog(error.message);}
  });
}

function btnDelete_Callback(type, data){
  alert(data);
  if(data.indexOf("successfull")>0) form_Init();
}


function btnDownload_Click(){
	var statement = document.statement_form.statement.value;

  if(statement.indexOf("New")>=0) {
		tool.dialog.errorDialog("Please select a existing statement first!");  	
		return false;
	}
	
	var sql="";
	if(statement.indexOf("Interim") >= 0) {
//		sql = "select UnitNumber, PurchaserName, PurchaserAddress, OccupancyDate, OfferPrice, " +
//				" ContractedDeposit, TotalDeposit, UnadjustedBalance, BalanceDueOnFinalClosing, " + 
//				" OccupancyFee, ProRatedOccupancyFee, TotalCommonExpenses, RealtyTaxes, " + 
//				" InterestOnBalance, TarionNumber,AdditionalPurchaser,UnitNbr,UnitLevel,RegParkingNumber,RegParkingLevel,CompactParkingNumber,CompactParkingLevel,TandemParkingNumber,TandemParkingLevel,RegLockerNumber,RegLockerLevel,BikeRackerNumber,BikeRackerLevel" +
//			  	" from UserClosingInterimStatement";
			sql = "select * from UserClosingInterimStatement";
	} else {
//		sql = "select UnitNumber,PurchaserName,PurchaserAddress,TarionNumber,OfferPrice,GST,ContractedDeposit,TotalDepositPaid,OccupancyDate,OccupancyDeposit,"+
// 				"DepositInterest,UnitCamFee,UnitCamFeeProRated,UnitCamFeePaid,ParkingCamFee,ParkingCamFeeProRate,ParkingCamFeePaid,LockerCamFee,LockerCamFeeProRated,"+
// 				"LockerCamFeePaid,NumberOfUnit,LandTaxYear1,LandTaxYear2,SupplLandTaxYear1,SupplLandTaxYear2,SixFeeProvTax,SixFeeConnCharge,SixFeeWaterMeter,SixFeeHydroCharge,"+
// 				"SixFeeDevCharge,SixFeeTarion,LawSocietyLevy,CheqRecoveryCost,DischargeFee,CreditAmount,CreditDescription,Balance from UserClosingFinalStatement";
			sql = "select * from UserClosingFinalStatement";
 	}
 	
	var sql = sql + " where CreatedDate='" + statement.substr(statement.indexOf("_") + 1) + "'";
	sql = sql + " order by cast(UnitNumber as signed) ";
	
	window.location="../dumpCSVSql.phtml?sql="+sql+"&filename=ClosingStatement.csv";
}