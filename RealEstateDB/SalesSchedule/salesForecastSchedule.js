/**
* Javascript for salesForecastScheulde
* Calculate total unit
*/
var inventoryNum; // assign by phtml
var targetSalesInputPrefix; // 

function calculateInventoryRemainNum(currentInputObj){
//	alert ('in InventoryRemainNum inventoryNum=' + inventoryNum);
	var currentInventoryNum = inventoryNum;

//	alert('currentInputObj=' + currentInputObj);
	if (isNaN(currentInputObj.value)){
		alert('Error: Please input a valid number.');		
		currentInputObj.focus();
		return;
	}
	for (var i=0; 1; i++){
		var idName = targetSalesInputPrefix + '_' + i;
		var inputObj = document.getElementById(idName);
		if (typeof(inputObj) == 'undefined' || inputObj == null){
			break;
		}
		else if (!isNaN(inputObj.value)){
			currentInventoryNum -= inputObj.value;
		}
	}
	// only display 0 if number is negative in order to make it easier
	// to read
	if (currentInventoryNum < 0) {
		currentInventoryNum  = 0;
	}
	updateInventoryRemainNum(currentInventoryNum);
};

function updateInventoryRemainNum(remain){
	var invRemainDIV = document.getElementById('InventoryRemainDIV');
	invRemainDIV.innerHTML = remain;
};