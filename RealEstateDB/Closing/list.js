// Controler for proj_closing
//dojo.addOnLoad(page_load);



// 
function btnUnitClosing_Click(unitNumber){
	//window.location = 'user_closing.phtml?UnitNumber=' + unitNumber;
	newwindow=window.open('user_closing.phtml?UnitNumber=' + unitNumber, 
		unitNumber, 'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,width=900,height=850,left = 100,top = 100');
	if (window.focus) {
		newwindow.focus();
	}
	return false;
}

function btnUnitInterim_Click(unitNumber){
	window.location = 'user_closing.phtml?UnitNumber=' + unitNumber;
}
