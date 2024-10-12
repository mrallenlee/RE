// Global variable for PDI

var PDI_IMAGE_DIR = "..\/images\/PDI\/";
var IMAGE_DIR = "../images/";
var BLANK_IMAGE 	= IMAGE_DIR + "blank.jpg";

function confirm_delete(url)
{
	var msg =	"WARNING: If this record is deleted, then other records\n" +
			"in the database linked to it could or will be deleted.\n" +
			"\n" +
			"Would you like to delete this record?";
	
	if (confirm(msg))
	{
		location.href = url;
	}
}

function set_rptdate(type, i)
{
	if (eval("document.frm_edit_pdidefect." + type + "Defect_" + i + ".checked") === true)
	{
		var today = new Date();
		var today_mth = today.getMonth() + 1;
		eval("document.frm_edit_pdidefect." + type + "ReportDate_" + i + ".value = today.getFullYear() + '-' + today_mth + '-' + today.getDate()");
	}
	else
	{
		eval("document.frm_edit_pdidefect." + type + "ReportDate_" + i + ".value = ''");
	}
}

function set_fixeddate(type, i)
{
	if (eval("document.frm_edit_pdidefect." + type + "Fixed_" + i + ".checked") === true)
	{
		var today = new Date();
		var today_mth = today.getMonth() + 1;
		eval("document.frm_edit_pdidefect." + type + "FixedDate_" + i + ".value = today.getFullYear() + '-' + today_mth + '-' + today.getDate()");
	}
	else
	{
		eval("document.frm_edit_pdidefect." + type + "FixedDate_" + i + ".value = ''");
	}
}

function change_link(type)
{
	var selected_list;

	if (type === "trade_unit")
	{
		selected_list = document.frm_links.trade_unit_contractor_selector;
	}
	else if (type === "trade_floor")
	{
		selected_list = document.frm_links.trade_floor_contractor_selector;
	}
	else if (type === "trade_allfloors")
	{
		selected_list = document.frm_links.trade_allfloors_contractor_selector;
	}

	if (selected_list.options[selected_list.selectedIndex].value === 0)
	{
		alert("Please choose a contractor.");
	}
	else
	{
		if (type === "trade_unit")
			location.href = "report_pdi_details.phtml?search_UnitNumber=" + UNIT + "&search_ContractorID=" + selected_list.options[selected_list.selectedIndex].value;
		else if (type === "trade_floor")
			location.href = "report_pdi_details.phtml?search_Floor="+ document.frm_links.floor.value + "&search_ContractorID=" + selected_list.options[selected_list.selectedIndex].value;
		else if (type === "trade_allfloors")
			location.href = "report_pdi_details.phtml?search_ContractorID=" + selected_list.options[selected_list.selectedIndex].value;
	}

}

/**
* Handle change event on the File Selector. Display Thumbnail on provided imag element
* fileObjName 
* imgObjName
* ID - Defect ID, or 'NEW' for new defect
* localDefectID - local defect ID added dynamacially by js i.e. 1,2,3...
*/ 
function handleImageSelector(fileObjName, imgObjName, ID, localDefectID) {

	var fileObj = document.getElementById(fileObjName);
	var file 	= fileObj.files[0];

	var imgObj 	= document.getElementById(imgObjName);
    
    if (!file.type.startsWith('image/')){ alert('Please select image files for upload!'); return; }
    
    imgObj.height = 100;


    // load selected file to Thumbnail
    var reader = new FileReader();
    reader.onload 	= function(){
      	var dataURL = reader.result;
      	imgObj.src 	= dataURL;
    };

	reader.readAsDataURL(file);
	
	// Call upload image function automatically
	uploadImage(fileObjName, ID, localDefectID)
}


/**
 * postUploadImageFunc
 * Function to be run after image uploaded
 * @param {*} filepath - includes dir and file name 
 * @param {*} PDIDefectID
 * @param {*} localDefectID 
 */
function postUploadImageFunc(filepath, PDIDefectID, localDefectID) {
	// call post process function after file upload
	var inputObj = document.getElementById("DefectImageName_" + localDefectID);
	inputObj.value = filepath;

	// alert('inputobj.value=' + inputObj.value )

	var inputObj = document.getElementById("DefectHasImage_" + localDefectID);
	inputObj.value = 1;
} // postUploadImageFunc

/**
* Upload selected image to server via xhttp call
* fileObjName - Obj name continas the upload file
* ID - PDI Defect ID
* loaclDefectID - the local defect ID i.e. 0, 1, 2, 3, etc...
*/ 
function uploadImage(fileObjName, ID, localDefectID) {

	var fileObj = document.getElementById(fileObjName);
	var file 	= fileObj.files[0];

	// alert("uploadImage Function called" + fileObj);	

    var uri = "upload_file.phtml";
    var xhr = new XMLHttpRequest();
    var fd = new FormData();

    fd.append('myFile', file);

	/* Add error message checking in success scope */
	$.ajax({
		url: 'upload_file_ajax.phtml?component=PDI&ID=' + ID,
		type: "POST",
		data: fd, 
		contentType: false,
		dataType: 'json',
		cache: false,
		processData: false,
		success: function(data) {
			// initialize the first row

			if (data['status'] == 'ERROR'){
				alert (data['status']  + " : " + data['message']);
			} else {

				postUploadImageFunc(data['filepath'], ID, localDefectID) 				
				// call post process function after file upload
				// var inputObj = document.getElementById("DefectImageName_" + localDefectID);
				// inputObj.value = data['filepath'];
				// alert("Upload " + data['status'] + " : " + data['message']);
				// + " filepath=" + data['filepath']);
				// TODO
				// Update the input text file with the new file name and hasImage properties
				alert('Image uploaded successfully');
			}
		},
		error: function(data){

			alert("Error: " + data['message']);
		}
	});    
} // uploadImage


/**
* Upload selected image to server
*/ 
function deleteImage(imageObjName, PDIDefectID, localDefectID) {

	var imageObj 	= document.getElementById(imageObjName);

	// alert("deleteImage Function called" + imageObj + 'src=' + imageObj.src);
	
	// Set image to load blank image
	imageObj.src = BLANK_IMAGE;
	// call post process function after file upload
	var inputObj = document.getElementById("DefectImageName_" + localDefectID);
	inputObj.value = "";

	// alert('inputobj.value=' + inputObj.value )

	var inputObj = document.getElementById("DefectHasImage_" + localDefectID);
	inputObj.value = 0;	
}


var num_of_rows = 0;

var filter_date = function (one_date) {
	return (one_date === "0000-00-00" || one_date === null) ? "" : one_date;
};

var set_checkbox_status = function (name, id, value) {
	var element = $("#" + name + "_" + id);
	
	if (value === "1") {
		element.attr("checked", "checked");
	} else {
		element.removeAttr("checked");
	}
};

var set_selectbox_status = function (name, id, value) {
	$("#" + name + "_" + id).val(value);
};

var generate_defect_form = function (num_of_rows, row) {


	var row = row || {};
	row["QAFixedDate"] 		= row["QAFixedDate"] || "";
	row["PDIFixedDate"] 	= row["PDIFixedDate"] || "";
	row["day30FixedDate"] 	= row["day30FixedDate"] || "";
	row["month11FixedDate"] = row["month11FixedDate"] || "";
	row["QAReportDate"] 	= row["QAReportDate"] || "";
	row["PDIReportDate"] 	= row["PDIReportDate"] || "";
	row["day30ReportDate"] 	= row["day30ReportDate"] || "";
	row["month11ReportDate"]= row["month11ReportDate"] || "";
	row["DefectDesc"] 		= row["DefectDesc"] || "";
	row["PDIDefectID"] 		= row["PDIDefectID"] || "NEW";
	row["UnitDefectID"] 	= row["UnitDefectID"] || "NEW";
	row["CreatedBy"]	 	= row["CreatedBy"] || "NEW";
	row["hasImage"] 		= row["hasImage"] || "";
	row["imageName"] 		= row["hasImage"]==1 ? row["imageName"] : "";
					
	
	return PDI_TABLE_TEMPLATE.replace(/\{1\}/g, num_of_rows)
	                         .replace(/\{QAFixedDate\}/g, filter_date(row["QAFixedDate"]))
	                         .replace(/\{PDIFixedDate\}/g, filter_date(row["PDIFixedDate"]))
	                         .replace(/\{day30FixedDate\}/g, filter_date(row["day30FixedDate"]))
	                         .replace(/\{month11FixedDate\}/g, filter_date(row["month11FixedDate"]))
	                         .replace(/\{QAReportDate\}/g, filter_date(row["QAReportDate"]))
	                         .replace(/\{PDIReportDate\}/g, filter_date(row["PDIReportDate"]))
	                         .replace(/\{day30ReportDate\}/g, filter_date(row["day30ReportDate"]))
	                         .replace(/\{month11ReportDate\}/g, filter_date(row["month11ReportDate"]))
	                         .replace(/\{DefectDesc\}/g, row["DefectDesc"])
	                         .replace(/\{PDIDefectID\}/g, row["PDIDefectID"])
	                         .replace(/\{UnitDefectID\}/g, row["UnitDefectID"])
	                         .replace(/\{DefectHasImage\}/g, row["hasImage"])
	                         .replace(/\{DefectImageName\}/g, row["imageName"])
							 .replace(/\{UnitDefectID\}/g, row["UnitDefectID"])
							 .replace(/\{CreatedBy\}/g, row["CreatedBy"]);
};

var setInputStatus = function (num_of_rows, row) {
	if (row) {
		set_checkbox_status("QADefect", num_of_rows, row['QADefect']);
		set_checkbox_status("QAFixed", num_of_rows, row['QAFixed']);
		set_checkbox_status("PDIDefect", num_of_rows, row['PDIDefect']);
		set_checkbox_status("PDIFixed", num_of_rows, row['PDIFixed']);
		set_checkbox_status("PDISignoff", num_of_rows, row['PDISignoff']);
		set_checkbox_status("day30Defect", num_of_rows, row['day30Defect']);
		set_checkbox_status("day30Fixed", num_of_rows, row['day30Fixed']);
		set_checkbox_status("day30Signoff", num_of_rows, row['day30Signoff']);
		set_checkbox_status("month11Defect", num_of_rows, row['month11Defect']);
		set_checkbox_status("month11Fixed", num_of_rows, row['month11Fixed']);
		set_checkbox_status("month11Signoff", num_of_rows, row['month11Signoff']);
		set_checkbox_status("TradeContacted", num_of_rows, row['TradeContacted']);
		
		set_selectbox_status("SectionID", num_of_rows, row["SectionID"]);
		set_selectbox_status("ContractorID", num_of_rows, row["ContractorID"]);

		set_selectbox_status("PDICatID", num_of_rows, row["PDICatID"]);
		// update the PDITypeID select box
		refreshPDITypeComboBox("PDICatID_" + num_of_rows, false);
		set_selectbox_status("PDITypeID", num_of_rows, row["PDITypeID"]);
		
	
	}
};

var refreshPDIs = function () {
	$.ajax({
		url: 'row_process_pdi.php',
		data: 'action=get&unit=' + UNIT,
		dataType: 'json',
		cache: false,
		success: function(data) {
			// initialize the first row
			if (data.length === 0) {
				$("#update").hide();
			}
		
			// Refresh PDI Category before generating the list again
			refreshPDICatComboBoxTemplate();

			$.each(data, function (index, pdi_row) {
			    one_defect_html = generate_defect_form(num_of_rows, pdi_row);
			    $("#defect_table").append(one_defect_html);

			    // ALLEN Remove JEC
			    // To activate editable combo box
			    // PDITypeID JEC is activate in RefreshPDITypeComboBox
				//$("#PDICatID_" + num_of_rows).jec();
			    
			    setInputStatus(num_of_rows, pdi_row);
			    $("#update").show();		    
				
			    num_of_rows++;
			});
			$(".datepicker").datepicker({dateFormat: 'yy-mm-dd'});
		}
	});
};

var display_user_message = function (message) {
	$(".user_message").html("");
	$(".user_message").html(message);
};



//Refresh PDICatID Combo box in the TEMPLATE
var refreshPDICatComboBoxTemplate = function () {
//	alert('refreshPDICatComboBoxTemplate init');		

	$.ajax({
		url: 'row_process_pdi.php',
		type: 'post',
		data: 'action=getPDICategory',
		cache: false,
		dataType: 'json',
		async: false,
		success: function(data) {
			// reset variable
			PDI_TABLE_TEMPLATE_CAT_OPTIONS = '';
			
			// Add new category via beside textfield
			PDI_TABLE_TEMPLATE_CAT_OPTIONS +=' \
				<OPTION VALUE="-1">Add New Category...</OPTION> ';     


			$.each(data, function (index, row) {
			
				var row = row || {};
				row["PDICatID"] 		= row["PDICatID"] || "";
				row["Name"] 			= row["Name"] || "";
				row["Description"] 		= row["Description"] || "";
											
				PDI_TABLE_TEMPLATE_CAT_OPTIONS +=' \
					<OPTION VALUE="' + row["PDICatID"] + '">' + row["Name"] + '</OPTION> ';           			
			});

			
			// overwrite the whoe template with the latest category ID value
			PDI_TABLE_TEMPLATE = PDI_TABLE_TEMPLATE_1 + PDI_TABLE_TEMPLATE_CAT_OPTIONS + PDI_TABLE_TEMPLATE_2;
//			alert('new PDI_TABLE_TEMPLATE=' + PDI_TABLE_TEMPLATE );
		},
		error: function () {
			//alert('refreshPDICatComboBoxTemplate ajax error');
			display_user_message("[ <font color=#009900><b>Error at retrieving the PDI Cat related to the PDI Category.</b></font> ]<br>\n<br>");
		}
	});				
};


// Refresh PDICatID Combo box 
// ******************************** NOT FINISHED *****************************
// Param: 
// divName is the PDICatID obj
// async boolean to indicate if this should be asynchronize 
var refreshPDICatComboBox = function (divName, asynchronize) {
	//Set default value
	asynchronize = ((asynchronize != null) ? asynchronize : true);		
	
	// find the select obj and get the selected value, which is the PDICatID
	selectObj = document.getElementById(divName);
	PDICatID = selectObj.value;

	$.ajax({
		url: 'row_process_pdi.php',
		type: 'post',
		data: 'action=getPDICategory',
		cache: false,
		dataType: 'json',
		async: asynchronize,
		success: function(data) {
//	alert('data='+data);		
			// Find the Cat select obj and clear the list 
			PDICatSelectObj = $(selectObj).siblings("[name^='PDICatID']");
			// Remove the JEC before removing all the option, 
			// will reactivate it again after options are inserted
			// $(PDICatSelectObj).jecKill();
			$(PDICatSelectObj).children("option").remove();
			
			// Add a new option for using the text field to add new Category
			var row = row || {};
			row["PDICatID"] 		= "-1";
			row["Name"] 			= "Add new Category";
			row["Description"] 		= "Add new Category";
					
			var o = new Option(row["Name"],  row["PDICatID"]);
			$(o).html(row["Name"]);			
			$(PDICatSelectObj).append(o);

			$.each(data, function (index, row) {
			
				var row = row || {};
				row["PDICatID"] 		= row["PDICatID"] || "";
				row["PDICatID"] 		= row["PDICatID"] || "";
				row["Name"] 			= row["Name"] || "";
				row["Description"] 		= row["Description"] || "";
				
				/*TODO Allen */
				// Store the description name rather than Cat ID 
				var o = new Option(row["Name"],  row["PDICatID"]);
//				//var o = new Option(row["Name"],  row["Name"]);
								
				/// jquerify the DOM object 'o' so we can use the html method
				$(o).html(row["Name"]);
				$(PDICatSelectObj).append(o);
			
			});
			
			// Activate JEC after adding options		
			// $(PDICatSelectObj).jec();		
			
		},
		error: function () {
			display_user_message("[ <font color=#009900><b>Error at retrieving the PDI Cat related to the PDI Category.</b></font> ]<br>\n<br>");
		}
	});			
};




// Refresh PDITypeID Combo box with the value of PDICatID combobox
// Param: 
// divName is the PDICatID obj
// async boolean to indicate if this should be asynchronize 
var refreshPDITypeComboBox = function (divName, asynchronize) {
	//Set default value
	asynchronize = ((asynchronize != null) ? asynchronize : true);		
	
	// find the select obj and get the selected value, which is the PDICatID
	selectObj = document.getElementById(divName);
	PDICatID = selectObj.value;

	$.ajax({
		url: 'row_process_pdi.php',
		type: 'post',
		data: 'action=getPDIType&PDICatID=' + PDICatID,
		cache: false,
		dataType: 'json',
		async: asynchronize,
		success: function(data) {
	//alert('data='+data);		
			// Find the type select obj and clear the list 
			PDITypeSelectObj = $(selectObj).siblings("[name^='PDITypeID']");
			// Remove the JEC before removing all the option, 
			// will reactivate it again after options are inserted
			// $(PDITypeSelectObj).jecKill();
			$(PDITypeSelectObj).children("option").remove();

			// Add option to add New PDI Type
			var row = row || {};
			row["PDITypeID"] 		= "-1";
			row["PDICatID"] 		= PDICatID;
			row["Name"] 			= "Add New Defect Type...";
			row["Description"] 		= "Add New Defect Type...";
			
			/*TODO Allen */
			// Store the description name rather than Type ID 
			var o = new Option(row["Name"],  row["PDITypeID"]);
//				//var o = new Option(row["Name"],  row["Name"]);
							
			/// jquerify the DOM object 'o' so we can use the html method
			$(o).html(row["Name"]);
			$(PDITypeSelectObj).append(o);			
			
			// Add PDI Defect based on DB options
			$.each(data, function (index, row) {
			
				var row = row || {};
				row["PDITypeID"] 		= row["PDITypeID"] || "";
				row["PDICatID"] 		= row["PDICatID"] || "";
				row["Name"] 			= row["Name"] || "";
				row["Description"] 		= row["Description"] || "";
				
				/*TODO Allen */
				// Store the description name rather than Type ID 
				var o = new Option(row["Name"],  row["PDITypeID"]);
//				//var o = new Option(row["Name"],  row["Name"]);
								
				/// jquerify the DOM object 'o' so we can use the html method
				$(o).html(row["Name"]);
				$(PDITypeSelectObj).append(o);
			
			});
			
			// ALLEN remove JEC
			// Activate JEC after adding options		
			//$(PDITypeSelectObj).jec();		
			
		},
		error: function () {
			display_user_message("[ <font color=#009900><b>Error at retrieving the PDI Type related to the PDI Category.</b></font> ]<br>\n<br>");
		}
	});			
};


/**
* dataVlidation - validate necessary data
* Return: true if all pass, false otherwise
* validate DefectType (PDITypeID) field for now
*/ 
function dataValidation(){
	console.log("inside dataValidation");
	// count number of not exist happens
	errorCount 		= 0;
	num_of_rows 	= 0;

	// continue the loop until reaching 10 not exist elements
	for (; errorCount < 10; num_of_rows++) {
		if ($("#PDITypeID_" + num_of_rows).length == 0) { 
 			// -- Not Exist
 			//alert("Not exist " + num_of_rows);
 			errorCount++;
		} else {
			// Check PDI Category value
			defectCatValue = "";
			//defectCatValue = $("#PDICatID_" + num_of_rows).attr("value");
			defectCatValue = $("#PDICatID_" + num_of_rows).val();
			//alert("value=" + defectTypeValue + " TypeID=" + num_of_rows);
			if (defectCatValue == -1){
				// -1 means adding new defect category, need to check if there is any value input 
				// as the new category
				var newDefectCatValue = $("#PDICatID_New_Text_" + num_of_rows).val();
				if (newDefectCatValue == "") {
					console.log("Error: You have selected to add a new Defect Category. Please kindly input a new Defect Category value in the textfield.");
					$("#PDICatID_New_Text_" + num_of_rows).focus();
					alert("Error: You have selected to add a new Defect Category. Please kindly input a new Defect Category value in the textfield.");
					return false;
				}
			}			

			// Chceck Defect Type
			defectTypeValue = "";
			//defectCatValue = $("#PDICatID_" + num_of_rows).attr("value");
			defectTypeValue = $("#PDITypeID_" + num_of_rows).val();
			//alert("value=" + defectTypeValue + " TypeID=" + num_of_rows);
			if (defectTypeValue == -1){
				// -1 means adding new defect type, need to check if there is any value input 
				// as the new defect type
				var newDefectTypeValue = $("#PDITypeID_New_Text_" + num_of_rows).val();
				if (newDefectTypeValue == "") {
					console.log("Error: You have selected to add a new Defect Type. Please kindly input a new Defect Type value in the textfield.");
					$("#PDITypeID_New_Text_" + num_of_rows).focus();
					alert("Error: You have selected to add a new Defect Type. Please kindly input a new Defect Type value in the textfield.");
					return false;
				}
			}
			
		}
	}


	return true;
}



// ------------------------------------------------------------------------------------------------------------------------
// Update email address for the primary purchaser
// ------------------------------------------------------------------------------------------------------------------------
var updateEmailAddress = function (userID, email, asynchronize){
	//Set default value
	asynchronize = ((asynchronize != null) ? asynchronize : true);		

	$.ajax({
		url: '../../RealEstateDB/framework/Services/userService.phtml',
		type: 'post',
		// data: 'action=updateEmail&userID=' + userID + '&email=' + btoa(email),
		data: {action : "updateEmail", userID : userID, email : btoa(email)},
		cache: false,
		dataType: 'json',
		async: asynchronize,
		success: function(data) {
			console.log("Email updated successfully");
			console.log(data);
			hideEmailTextButtons();
			$originalEmailTextValue = email;

			alert("Email updated successfully");
		},
		error: function () {
			alert("Error: Email cannot be updated");
			console.log("Error: Email cannot be updated");
			console.log(data);
			// display_user_message("[ <font color=#009900><b>Error at retrieving the PDI Type related to the PDI Category.</b></font> ]<br>\n<br>");
		}
	});
} // updateEmailAddress

function hideEmailTextButtons(){
	$('#btn-update-email-text').hide();
	$('#btn-cancel-email-text').hide();
} // hideEmailTextButtons 


function showEmailTextButtons(){
	$('#btn-update-email-text').show();
	$('#btn-cancel-email-text').show();
} // showEmailTextButtons
// ------------------------------------------------------------------------------------------------------------------------
// Init script
// ------------------------------------------------------------------------------------------------------------------------
$(document).ready( function () {
	// initialize
	refreshPDIs();
	
	$("#add").on("click", function () {
		one_defect_html = generate_defect_form(num_of_rows, 
				"",
				"",
				"",
				"");

		$("#defect_table").append(one_defect_html);
		$(".datepicker").datepicker({dateFormat: 'yy-mm-dd'});
		refreshPDITypeComboBox("PDICatID_" + num_of_rows, false);
		$("#update").show();
		display_user_message("");
		//alert('defect_html=' + one_defect_html);

		// Activate JEC for PDICatID select box
		// JEC for PDITypeID is activated in the RefreshPDITypeComboBox function
		// $("#PDICatID_" + num_of_rows).jec();
		
		num_of_rows++;
	});
	
	$(document).on("click", "#update", function(){
	// $("#update").on("click", function () {

		// data validation. If return false, return
		if (!dataValidation()) {
			console.log("after dataValidation. False, returning");
			return;
		}

		console.log("after dataValidation. True, call row_procesS_pdi.php");
		$.ajax({
			url: 'row_process_pdi.php',
			type: 'post',
			data: $("#frm_edit_pdidefect").serialize() + '&action=update&unit=' + UNIT,
//			dataType: 'json',
			cache: false,
			success: function(data) {
//				alert('success data=' + data);				
//				if (data["status"] == 'SUCCESS') {
					// reload pdi table
					$('#defect_table').empty();
					num_of_rows = 0;
					refreshPDIs();
				
				// display success message
					display_user_message("[ <font color=#009900><b>Records updated successfully.</b></font> ]<br>\n<br>");
//				} else { // handle error
//					display_user_message("[ <font color=#009900><b>" + data['sql_error'] + ".</b></font> ]<br>\n<br>");
//				}
			},
			error: function (data) {
				alert('Error: This is an error in processing the data. Please contact system administrator.');

				//alert('sql=' + data['status']);
				//alert('fuck=' + data['fuck']);
				alert('sql_error=' + data['sql_error']);
				display_user_message("[ <font color=#009900><b>Error at updating records.</b></font> ]<br>\n<br>");
			}
		});
	});


	$(document).on("click",".delete_button",function(){
		console.log("delete button");

		PDIDefectID = $(this).siblings("[name^='PDIDefect']").attr("value");
		// PDIDefectID = 1234;
		

		// Confirm if want to be deleted	
		var msg =	"Are you sure you want to delete this defect? Please save other PDI changes before any delete.";
	
		if (!confirm(msg))
		{
			return;
		}


		if (PDIDefectID === "") {
			// new record, not saved into db yet
			$(this).closest("table").remove();
			num_of_rows--;
		} else {
			// delete from database
			$.ajax({
				url: 'row_process_pdi.php',
				type: 'post',
				data: 'action=delete&PDIDefectID=' + PDIDefectID,
				cache: false,
				success: function(data) {
					// A TEST to only remove the defect, but not refresh the screen ALLEN
		

					// reload pdi table
					$('#defect_table').empty();
					num_of_rows = 0;

					refreshPDIs();
					
					// display success message
					display_user_message("[ <font color=#009900><b>The record has been deleted successfully.</b></font> ]<br>\n<br>");
				},
				error: function () {
					display_user_message("[ <font color=#009900><b>Error at deleting this record.</b></font> ]<br>\n<br>");
				}
			});
		}
	});

	
	// init update email features and hide the update and cancel button
	hideEmailTextButtons();
});
