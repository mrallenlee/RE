/**
*Use dynamic window class to create information dialog
*/ 

// dispaly edit note div layer 
function displayWaitingDIV($message, $width, $height){
	$defaultWidth = 500;
	$defaultHeight = 280;
	
	newHTML = '<DIV class="popupDiv"><center><table><tr><td align=center><BR><BR>';
	if ($message != undefined){
		newHTML = newHTML + $message; 
	} else {
		newHTML = newHTML + 'Updating. Please wait...'; 
	}
		
	newHTML = newHTML + '<BR><BR><BR></td></tr></table></center></div>';
//	alert('newHTML=' + newHTML);
	getFloatingDivNoStyle(1).innerHTML = newHTML;


	getFloatingDiv(1).position="absolute";
	if ($width != undefined){
		getFloatingDiv(1).width=$width + "px";	
	} else {
		getFloatingDiv(1).width=$defaultWidth + "px";		
	}
	if ($height != undefined){
		getFloatingDiv(1).height=$height + "px";	
	} else {
		getFloatingDiv(1).height=$defaultHeight + "px";		
	}
	// put it at the center of browser	
	centerDIV(getFloatingDivNoStyle(1));
	// display it
	getFloatingDiv(1).visibility="visible";	
}