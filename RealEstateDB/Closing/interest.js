// Controler for interest.phtml

dojo.addOnLoad(page_load);

var NUM_OF_YEAR = 2; // max 11
var MAX_NUM_OF_YEAR = 11; 

var interestRateYears;
var interestRateMonths;
var selectedRow;
var selectedCol;

// page init function
function page_load(){
  // register events
 	dojo.event.connect(dojo.byId("btnUpdate"), "onclick", btnUpdate_Click);
  dojo.event.connect(dojo.byId("btnPrevious"), "onclick", btnPrevious_Click);
  dojo.event.connect(dojo.byId("btnNext"), "onclick", btnNext_Click);

 	// init form 
 	form_Init();
}

function setYears(start, end) {
  var headers = document.getElementById("InterestRateTable").rows[0].cells;
  
  interestRateYears = new Array();
  for(var i=start, j=1; i<=end; i++, j++) {
    interestRateYears[j] = i;
    headers[j].innerHTML = i;
  } 
  
  document.getElementById("startYear").innerHTML = start;
  document.getElementById("endYear").innerHTML = end;
  
  getInterestRates(start,end);
}

function setSelectedInterestRate(row, col) {
  selectedCol = col;
  selectedRow = row;
  document.getElementById("InterestRateDate").innerHTML = interestRateMonths[selectedRow] + " " + interestRateYears[selectedCol];
  document.form_InterestRate.InterestRate.value = document.getElementById("InterestRateTable").rows[row].cells[col].innerHTML;
  document.form_InterestRate.InterestRate.focus();
  document.form_InterestRate.InterestRate.select();
}

function getInterestRates(startYear, endYear) {
  // retrieve interest rates
  dojo.io.bind({
    url: "interest_act.phtml",
    content: {act:"find", startYear:startYear, endYear:endYear},
    method: "POST",
    mimetype:  "text/plain",
    load: getInterestRates_Callback,
    error: function(type, error){tool.dialog.errorDialog(error.message);}
  });
}

function getInterestRates_Callback(type, evlObj) {
  try {
    eval("var interestRates = " + evlObj);
  } catch (e) {
    tool.dialog.errorDialog(evlObj);
    return;
  }

	var table = document.getElementById("InterestRateTable");
	for (var i=1;	i<interestRateYears.length; i++) {
		for (var j=1; j<interestRateMonths.length; j++) {
			table.rows[j].cells[i].innerHTML = "0";
		}
	}
	
  for (var i in interestRates) {
		var interestRate = interestRates[i];
		var row = interestRate["Month"];
		var col = interestRate["Year"] - interestRateYears[1] + 1;
		table.rows[row].cells[col].innerHTML = interestRate["Rate"];
	}
	
	 setSelectedInterestRate(1,1);
}

// init form data
function form_Init(){
  
  // attach mouse events to highligh cell when mouse over
  var table = document.getElementById("InterestRateTable");
  var tds = table.getElementsByTagName('td');
	for(var i = 0; i < tds.length; i++)	{
		var td = tds[i];
    td.onmouseover = function() { 
    	this.className = 'TDhighlight'; 
    	this.title = this.innerHTML + ", " + interestRateMonths[this.parentNode.rowIndex] + " " + interestRateYears[this.cellIndex];
    };
		td.onmouseout =	function() { this.className = "" };
		td.onclick = td_Click	;
	}
	

	interestRateMonths = new Array();
	for(var i=1; i<table.rows.length; i++) {
	  interestRateMonths[i] = table.rows[i].cells[0].innerHTML;
  }

  var today=new Date();
  var endYear = today.getFullYear();
  var startYear = today.getFullYear() - NUM_OF_YEAR + 1;
  setYears(startYear, endYear);
  
  
  var rows = table.rows;
	for(var r=0; r < rows.length; r++) {
		var cells = rows[r].cells;
		for(var c=NUM_OF_YEAR + 1; c <= MAX_NUM_OF_YEAR; c++) {
//				try {
			    cells[c].style.display ="none";
	//			} catch (e) {
		//		}
		}
	}  
}


function td_Click() {
  this.className = "TDEdit";
  
  setSelectedInterestRate(this.parentNode.rowIndex,this.cellIndex);
}


function validation() {
	var errstr = "";
	if (! tool.validator.isNumeric(document.form_InterestRate.InterestRate.value)) errstr += "Interest Rate must be numberic.\n";
	
  if(errstr!="") tool.dialog.errorDialog(errstr);
  return errstr=="" ;
}

function btnUpdate_Click(){
	if(! validation()) return false;
		
  dojo.io.bind({
    url: "interest_act.phtml",
    content: {
    					act:"update", 
    					Year:interestRateYears[selectedCol], 
    					Month:selectedRow, 
    					Rate:document.form_InterestRate.InterestRate.value
    				},
    method: "POST",
    mimetype:  "text/plain",
    load: btnUpdate_Callback,
    error: function(type, error){tool.dialog.errorDialog(error.message);}
  });
}

function btnUpdate_Callback(type, msg) {
	if(msg.indexOf("success") > 0) {
		alert(msg);
		document.getElementById("InterestRateTable").rows[selectedRow].cells[selectedCol].innerHTML = document.form_InterestRate.InterestRate.value;
	} else {
		tool.dialog.errorDialog(msg);
	}
}

function btnPrevious_Click(){
  setYears(interestRateYears[1] - 1, interestRateYears[NUM_OF_YEAR] - 1);
}

function btnNext_Click(){
  setYears(interestRateYears[1] + 1, interestRateYears[NUM_OF_YEAR] + 1);
}
