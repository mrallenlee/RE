//// user_admin.html controler
var menue_name="";
var lastUserName="";
var lastGroupName="";
function fireClick(el) {
	if(dojo.render.html.ie) {
		el.fireEvent("onclick");
	} else {
		var e = document.createEvent("MouseEvents");
		e.initEvent("click", true, false);
		el.dispatchEvent(e);
	}
}

function btnUserPassword_Click(){
	document.passwd_form.newPassword.value="";
	document.passwd_form.confirmPassword.value="";
	dojo.widget.byId('pane_password').show()
}
function btnPasswordOK_Click(){
	if (document.passwd_form.newPassword.value=="") {
		alert("Password is empty!");
		return;
	}
	
	if (document.passwd_form.newPassword.value!=document.passwd_form.confirmPassword.value) {
		alert("The Password you typed do not match!");
		return;
	}
	
	var user = new DataObject("LoginUser");
	user.setField("Passwd", document.passwd_form.newPassword.value);
	var user_return = DOFactory.update(user, {UserName: user_form.UserName.value});
	
	dojo.widget.byId('pane_password').hide();
}
function btnPasswordCancel_Click(){
	dojo.widget.byId('pane_password').hide();
}

function btnUserNew_Click(){
	var user_form = document.user_form;
	
	if (user_form.btnUserNew.innerHTML == "New") {
		user_form.UserName.value = "";
		user_form.Description.value = "";
		dojo.widget.byId("expiryDate").setValue(new Date());
		
		user_form.btnUserNew.innerHTML = "Save";
		user_form.btnUserDelete.disabled = true;
		user_form.btnUserUpdate.disabled = true;
		user_form.btnUserPassword.disabled = true;
		user_form.UserName.disabled = false;
	} else {
		if (user_form.UserName.value=="") {
			alert("user name required!");
			return false;
		}
				
		if (dojo.widget.byId("expiryDate").getValue() == "") {
			alert("expiry date required!");
			return false;
		}

		var user = new DataObject("LoginUser");
		user.setField("UserName", user_form.UserName.value);
		user.setField("Passwd", user_form.UserName.value);
		user.setField("ExpiryDate", dojo.widget.byId("expiryDate").getValue());
		user.setField("IsActive", user_form.isActive[0].checked ? 'Y':'N');
		user.setField("Description", user_form.userDescription.value);
		user.setField("GroupName", user_form.userGroup.value);
		
		var user_return = DOFactory.create(user);
		lastUserName = user_form.UserName.value;
		data_refresh();
	}
}

function btnGroupNew_Click(){
	var group_form = document.group_form;
	
	if (group_form.btnGroupNew.innerHTML == "New") {
		group_form.GroupName.value = "";
		group_form.GroupFullName.value = "";
		group_form.GroupDescription.value = "";
		group_form.GroupLevel.value = "0";
		
		group_form.btnGroupNew.innerHTML = "Save";
		group_form.btnGroupDelete.disabled = true;
		group_form.btnGroupUpdate.disabled = true;
		group_form.GroupName.disabled = false;
	} else {
		if (group_form.GroupName.value=="") {
			alert("group name required!");
			return false;
		}
				
		var group = new DataObject("LoginGroup");
		group.setField("GroupName", group_form.GroupName.value);
		group.setField("GroupFullName", group_form.GroupFullName.value);
		group.setField("Description", group_form.GroupDescription.value);
		group.setField("GroupLevel", group_form.GroupLevel.value);
		
		var group_return = DOFactory.create(group);
		lastGroupName = group_form.GroupName.value;
		
		data_refresh();
	}
}
function btnUserDelete_Click(){
	var user_form = document.user_form;
	
	var user = new DataObject("LoginUser");
	user.setField("UserName", user_form.UserName.value);
	
	var user_return = DOFactory.del(user);
	lastUserName = "";
	data_refresh();
}

function btnGroupDelete_Click(){
	var group_form = document.group_form;
	
	var group = new DataObject("LoginGroup");
	group.setField("GroupName", group_form.GroupName.value);
	
	var group_return = DOFactory.del(group);
	lastGroupName = "";
	data_refresh();
}

function btnUserUpdate_Click(){
	var user_form = document.user_form;
	
	var user = new DataObject("LoginUser");
//	user.setField("UserName", user_form.UserName.value);
	user.setField("ExpiryDate", dojo.widget.byId("expiryDate").getValue());
	user.setField("IsActive", user_form.isActive[0].checked ? 'Y':'N');
	user.setField("Description", user_form.userDescription.value);
	user.setField("GroupName", user_form.userGroup.value);
	
	var user_return = DOFactory.update(user, {UserName: user_form.UserName.value});
	lastUserName = user_form.UserName.value;
	data_refresh();
}

function btnGroupUpdate_Click(){
	var group_form = document.group_form;
	
	var group = new DataObject("LoginGroup");
	group.setField("GroupFullName", group_form.GroupFullName.value);
	group.setField("Description", group_form.GroupDescription.value);
	group.setField("GroupLevel", group_form.GroupLevel.value);
	
	var group_return = DOFactory.update(group, {GroupName: group_form.GroupName.value});
	lastGroupName = group_form.GroupName.value;
	data_refresh();
}

function form_refresh() {
}

function data_init() {
	// init group dropdown list
	var groupDropdown = document.user_form.userGroup;
	for (var i=groupDropdown.options.length-1; i>=0; i--)  groupDropdown.options[i]=null;

	var dataobjects = DOFactory.find('LoginGroup');
	for(var i=0; i<dataobjects.length; i++) groupDropdown.options[i]=new Option(dataobjects[i].getField("GroupName"),dataobjects[i].getField("GroupName"));
}

function data_refresh() {
	var dataobjects = DOFactory.find(menue_name=="menu_user"? 'LoginUser' : 'LoginGroup');
	var grid = dojo.widget.byId(menue_name=="menu_user"?'table_user' : 'table_group');
	grid.store.clearData();
	
	var row = 1;
	for(var i=0; i<dataobjects.length; i++) {
		var dataobject = dataobjects[i];
	
		if (menue_name=="menu_user") {
			grid.store.addData({
				id: dataobject.getField("LoginUserID"),
				name: dataobject.getField("UserName"),
				active: dataobject.getField("IsActive"),
				expiry: dataobject.getField("ExpiryDate"),
				description: dataobject.getField("Description"),
				group: dataobject.getField("GroupName")
				}, dataobject.getField("LoginUserID"));
			
			if (lastUserName!="" && lastUserName==dataobject.getField("UserName")) row = i + 1;
				
		} else {
			grid.store.addData({
				id: dataobject.getField("LoginGroupID"),
				name: dataobject.getField("GroupName"),
				fullName: dataobject.getField("GroupFullName"),
				description: dataobject.getField("Description"),
				level: dataobject.getField("GroupLevel")
				}, dataobject.getField("LoginGroupID"));

			if (lastGroupName!="" && lastGroupName==dataobject.getField("GroupName")) row = i + 1;
		}	
	}

	if(dataobjects.length > 0) {
		if (menue_name=="menu_user")  {
			fireClick(dojo.byId("table_user").rows[row].cells[0]);
		} else {
			fireClick(dojo.byId("table_group").rows[row].cells[0]);
		}
	}
	
	// refresh group dropdown
	if (menue_name=="menu_group") {
		var groupDropdown = document.user_form.userGroup;
		for (var i=groupDropdown.options.length-1; i>=0; i--)  groupDropdown.options[i]=null;
		for(var i=0; i<dataobjects.length; i++) groupDropdown.options[i]=new Option(dataobjects[i].getField("GroupName"),dataobjects[i].getField("GroupName"));
	}

}

function screen_refresh() {
	if (menue_name=="menu_user") {
		dojo.byId("form_user").style['visibility'] = 'visible';
		dojo.byId("table_user").style['visibility'] = 'visible';
		dojo.byId("menu_user").style['background'] = "#d2d2ff";
		
		dojo.byId("form_group").style['visibility'] = 'hidden';
		dojo.byId("table_group").style['visibility'] = 'hidden';
		dojo.byId("menu_group").style['background'] = "";
		
		
		
	} else {
		dojo.byId("form_user").style['visibility'] = 'hidden';
		dojo.byId("table_user").style['visibility'] = 'hidden';
		dojo.byId("menu_user").style['background'] = "";
		
		dojo.byId("form_group").style['visibility'] = 'visible';
		dojo.byId("table_group").style['visibility'] = 'visible';
		dojo.byId("menu_group").style['background'] = "#d2d2ff";
	}		

	data_refresh();
}

function table_user_row_selected(evt) {
	var data = dojo.widget.byId("table_user").getSelectedData();
	var userform = document.user_form;
	
	userform.UserName.disabled = true;
	userform.UserName.value = data.name;
	userform.userDescription.value = data.description;
	dojo.widget.byId("expiryDate").setValue(data.expiry);
	userform.userGroup.value = data.group;
	userform.isActive[data.active=='Y'? 0:1].checked = true;

	userform.btnUserNew.innerHTML = "New";
	userform.btnUserDelete.disabled = false;
	userform.btnUserUpdate.disabled = false;
	userform.btnUserPassword.disabled = false;
}

function table_group_row_selected(evt) {
	var data = dojo.widget.byId("table_group").getSelectedData();
	var groupform = document.group_form;
	
	groupform.GroupName.disabled = true;
	groupform.GroupName.value = data.name;
	groupform.GroupDescription.value = data.description;
	groupform.GroupFullName.value = data.fullName;
	groupform.GroupLevel.value = data.level;

	groupform.btnGroupNew.innerHTML = "New";
	groupform.btnGroupDelete.disabled = false;
	groupform.btnGroupUpdate.disabled = false;
}


function form_load(){
	// Event register
//	dojo.event.connect(
//		[dojo.byId("menu_user"), dojo.byId("menu_group")], "onmousemove",
//		function(evt){
//			if (evt.target.id != menue_name)
//				evt.target.style['background']="#f0f0ff";
//		});
//	dojo.event.connect(
//		[dojo.byId("menu_user"), dojo.byId("menu_group")], "onmouseout",
//		function(evt){
//			if (evt.target.id != menue_name)
//				evt.target.style['background']="";
//		});

	dojo.event.connect(
		[dojo.byId("menu_user"), dojo.byId("menu_group")], "onclick",
		function(evt){
			if (menue_name != evt.target.id) {
				menue_name = evt.target.id;
				screen_refresh();
			}
		});
		
	dojo.event.connect(dojo.widget.byId("table_user"), "onSelect", table_user_row_selected);
	dojo.event.connect(dojo.widget.byId("table_group"), "onSelect", table_group_row_selected);

	dojo.event.connect(dojo.byId("btnUserNew"), "onclick", btnUserNew_Click);
	dojo.event.connect(dojo.byId("btnUserDelete"), "onclick", btnUserDelete_Click);
	dojo.event.connect(dojo.byId("btnUserUpdate"), "onclick", btnUserUpdate_Click);
	dojo.event.connect(dojo.byId("btnUserPassword"), "onclick", btnUserPassword_Click);

	dojo.event.connect(dojo.widget.byId("btnPasswdOK"), "onClick", btnPasswordOK_Click);
	dojo.event.connect(dojo.widget.byId("btnPasswdCancel"), "onClick", btnPasswordCancel_Click);

	dojo.event.connect(dojo.byId("btnGroupNew"), "onclick", btnGroupNew_Click);
	dojo.event.connect(dojo.byId("btnGroupDelete"), "onclick", btnGroupDelete_Click);
	dojo.event.connect(dojo.byId("btnGroupUpdate"), "onclick", btnGroupUpdate_Click);

	menue_name = "menu_user";
	screen_refresh();
	data_init();
}

dojo.addOnLoad(form_load);

