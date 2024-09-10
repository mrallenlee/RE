

	// PDI Book appoint email feature
	function emailBookPDIAppt(unitNumber, userID){
		// alert("emailBookPDI unitNumber=" + unitNumber);

        // alert('userID=' + userID + ' unitNumber=' + unitNumber);
        $.ajax({
            url: 'pdi_util.phtml',
            data: 'action=emailBookPDIAppt&unitNumber=' + unitNumber + '&userID=' + userID,
            dataType: 'json',
            cache: false,
            success: function(data) {
                alert("Email sent successfully");
                }
            ,
            error: function (data) {
				alert('Error: This is an error in processing the data. Please contact system administrator.');
                

				//alert('sql=' + data['status']);
				//alert('fuck=' + data['fuck']);
				alert('error=' + data);
				// display_user_message("[ <font color=#009900><b>Error at updating records.</b></font> ]<br>\n<br>");
            }});
        }
        

	