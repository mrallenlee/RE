			
			function addInventoryItem(){
				x_getNewInventoryItemHTMLForm(nextInventoryItemNum, getNewInventoryItemHTMLForm_CallBack);
			}
			
			// ajax call to add additional purchaser html form content 
			function getNewInventoryItemHTMLForm_CallBack(html){
				InventoryItemGroupDIVObj = document.getElementById("InventoryItemDIV");
				nextInventoryItemNumObj = document.getElementById("nextInventoryItemNum");
				
				// innerHTML may not keep form data in some broswer, use DOM menthod to append new DIV
				// By MingLei Yuan, May 22, 2007
//				var htmlWithDIV = '<DIV id="AdditionalPurchaserDIV' + nextAdditionalPurchaserNum + '"><h4>Additional Purchaser ' + nextAdditionalPurchaserNum + '</h4><table>' + html + '</table></DIV>';
//				additionalPurchaserGroupDIVObj.innerHTML = additionalPurchaserGroupDIVObj.innerHTML + htmlWithDIV;
				var newInventoryItemDom = document.createElement("DIV");
				newInventoryItemDom.setAttribute('id', "InventoryItemDIV" + nextInventoryItemNum);
				newInventoryItemDom.innerHTML = '<table cellspacing=1>' + html + '</table>';
				InventoryItemGroupDIVObj.appendChild(newInventoryItemDom);

				nextInventoryItemNum++;
				nextInventoryItemNumObj.value = nextInventoryItemNumObj.value + 1;
				InventoryItemGroupDIVObj.style.visibility="visible"; 					
			}
			
			// delete additional purchaser. It sets the additional purchaser action to be delete, 
			// and set the div to be invisible 
			function deleteInventoryItem(index){
				var actionName = 'InventoryItem' + '_' + index + '_Action';
				InventoryItemActionObj = document.getElementById(actionName);
				InventoryItemActionObj.value = 'delete';
				
				var divName = 'InventoryItemDIV' + index;
				InventoryItemDIVObj = document.getElementById(divName);
				InventoryItemDIVObj.style.display="none";
			}