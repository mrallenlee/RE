$(document).ready( function () {

    var checkboxForAll = $("#TradeContactedAll");
    if (checkboxForAll.closest('table').find(':checkbox:checked').length === checkboxForAll.closest('table').find(':checkbox').length - 1) {
        checkboxForAll.prop("checked", "checked");
    }

    checkboxForAll.on("click", function () {
        $(this).closest('table').find(':checkbox').prop('checked', this.checked);
    });

    checkboxForAll.closest('table').find(':checkbox').on("click", function () {
    	if (!this.checked) {
    		checkboxForAll.prop('checked', false);
    	}
    });
    
});
