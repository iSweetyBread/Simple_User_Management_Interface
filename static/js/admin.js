const jq = jQuery.noConflict();

import { apiReq, getUserCred, loadInfo, theme, navs, pass, mail, logout, getTab, setCookie, displayLoader } from "./api.js";
import { ValidateEmail, ValidateName, ValidatePassword } from "./utils.js";
import { renders } from "./renders.js";
const userCred = getUserCred();

let userTable;

jq(document).ready(async function(){
	//--initial user section
	theme();
	//load previous tab
	if(getTab()){
		showTab(getTab())
	}else{
		showTab("mainViewLink")
	};
	navs();

	//handlers for switching tab
	jq("#mainViewLink").click(() => showTab("mainViewLink"));
	jq("#settingsViewLink").click(() => {showTab("settingsViewLink"); jq("#settingsViewPage input").val(""); jq(".userNotif").text("").addClass("d-none");});
	jq("#usersViewLink").click(() => showTab("usersViewLink"));
	jq("#addNewUserLink").click(() => jq('#modalAddNewUser').modal('show'));

	jq("#btnLogout").click(() => logout());
	pass(userCred);
	mail(userCred);

	//--section done

	jq("#reloadUserList").click(function(){
		jq("#reloadUserList").prop("disabled", true).append('<span class="loader"></span>');

		userTable.ajax.reload(function(){
			jq("#reloadUserList").prop("disabled", false);
			jq("#reloadUserList").find(".loader").remove();
		}, false); 
	});

	//handler for "Add new user" button
	jq("#btnAddNewUser").click(async function(){
		const login = jq("#inputLoginNewUser").val().trim();
		const email = jq("#inputEmailNewUser").val().trim();
		const role = jq("#selectTypeNewUser").val();
		const password = jq("#inputPasswordNewUser").val();
		const repeatPassword = jq("#inputPasswordRepeatNewUser").val();
		const note = jq("#inputCommentNewUser").val().trim() || "-/-";
		const notify = jq("#notifyUserCheckbox").is(":checked"); 

		jq(".userNotif").text("").addClass("d-none");

		try{
			ValidateName(login);
		}catch(error){
			jq("#errorLoginNewUser").text(error).removeClass("d-none");
			displayLoader("#errorLoginNewUser");
			return;
		}
		try{
			ValidateEmail(email);
		}catch(error){
			jq("#errorEmailNewUser").text(error).removeClass("d-none");
			displayLoader("#errorEmailNewUser");
			return;
		}
		if(!role){
			jq("#errorTypeNewUser").text("Please select a user role.").removeClass("d-none");
			displayLoader("#errorTypeNewUser");
			return;
		}
		try{
			ValidatePassword(password);
		}catch(error){
			jq("#errorPasswordNewUser").text(error).removeClass("d-none");
			displayLoader("#errorPasswordNewUser");
			return;
		}
		if(password !== repeatPassword){
			jq("#errorPasswordRepeatNewUser").text("Passwords do not match.").removeClass("d-none");
			displayLoader("#errorPasswordRepeatNewUser");
			return;
		}

		try{
			const response = await apiReq({'q':'user','c':'add','user':login,'token':userCred.token,'pass':password,'mail':email,'role':role,'note':note,'notify':notify});
		
			jq("#successAddUserMessage").text("New user added successfully!").removeClass("d-none");
			displayLoader("#successAddUserMessage");
			userTable.ajax.reload(null, false); 
		}catch(error){
			jq("#errorPasswordRepeatNewUser").text(error).removeClass("d-none");
			displayLoader("#errorFinalNewUser");
			return;
		}
	});
	//reser add new user modal window
	jq('#modalAddNewUser').on('show.bs.modal', function(){
		jq(this).find('input, textarea, select').val('');
		jq(this).find('input[type="checkbox"]').prop('checked', false);
		jq(this).find('p.text-danger, p.text-success').addClass('d-none').text('');
		jq(this).find('#btnAddNewUser').addClass('disabled');
	});

	//hadler for inline edit user comment button
	jq('#userTable').on('click', '.btnEditUserComment', function(){
		let rowId = jq(this).data('id');
		let span = jq(`.inputUserCommentText[data-id="${rowId}"]`);
		let input = jq(`.inputUserComment[data-id="${rowId}"]`);

		let text = span.val().replace(/\\n/g, "\n");
    	input.val(text);
		span.addClass('d-none');
		input.removeClass('d-none').focus();

		input.css({ "resize": "none", "overflow": "auto", "white-space": "normal", "height": "auto" });

		jq(this).addClass('d-none');
		jq(`.btnSaveUserComment[data-id="${rowId}"]`).removeClass('d-none');
		jq(`.btnCancelUserComment[data-id="${rowId}"]`).removeClass('d-none');
	});
	//hadler for inline save edit user comment button
	jq('#userTable').on('click', '.btnSaveUserComment', async function(){
		let rowId = jq(this).data('id');
		let span = jq(`.inputUserCommentText[data-id="${rowId}"]`);
		let input = jq(`.inputUserComment[data-id="${rowId}"]`);
		let newComment = input.val().trim() || "-/-";
		newComment = newComment.replace(/\r?\n/g, "\\n");

		try{
			const response = await apiReq({'q':'user','c':'note','user':rowId,'token':userCred.token,'note':newComment});

			let displayText = newComment.replace(/\\n/g, "\n");
			span.text(displayText);
			span.removeClass('d-none');
			input.addClass('d-none');

			span.css({ "resize": "none", "overflow": "hidden", "white-space": "pre-wrap", "height": "auto" });
			input[0].style.height = input[0].scrollHeight + "px";

			jq(this).addClass('d-none');
			jq(`.btnEditUserComment[data-id="${rowId}"]`).removeClass('d-none');
			jq(`.btnCancelUserComment[data-id="${rowId}"]`).addClass('d-none');

			jq(`.commentSuccess[data-id="${rowId}"]`).text("Comment saved successfully!").removeClass("d-none");
		}catch(error){
			showErrorPopover(jq(this), error);
			jq(`.commentSuccess[data-id="${rowId}"]`).addClass("d-none");
			return;
		}
	});
	//hadler for inline cancel edit user comment button
	jq('#userTable').on('click', '.btnCancelUserComment', function(){
		let rowId = jq(this).data('id');
		let span = jq(`.inputUserCommentText[data-id="${rowId}"]`);
		let input = jq(`.inputUserComment[data-id="${rowId}"]`);

		input.val(span.val().replace(/\\n/g, "\n"));
		input.addClass('d-none');
		span.removeClass('d-none');

		span.css({ "resize": "none", "overflow": "hidden", "white-space": "nowrap", "height": "28px" });

		jq(this).addClass('d-none');
		jq(`.btnSaveUserComment[data-id="${rowId}"]`).addClass('d-none');
		jq(`.btnEditUserComment[data-id="${rowId}"]`).removeClass('d-none');
	});
	//hadler for inline expand user comment button
	jq('#userTable').on('click', '.btnExpandComment', function(){
		let rowId = jq(this).data('id');
		let span = jq(`.inputUserCommentText[data-id="${rowId}"]`);

		if (span.data("expanded")) {
			span.css({
				"resize": "none",
				"overflow": "hidden",
				"white-space": "nowrap",
				"height": "28px"
			});
			span.data("expanded", false);
		} else {
			span.css({
				"white-space": "pre-wrap",
				"overflow": "hidden",
				"height": "auto"
			});
			span[0].style.height = span[0].scrollHeight + "px";
			span.data("expanded", true);
		}
	});

	//handler for change user password button
	jq('#userTable').on('click', '.btnChangePasswordRoot', function(e) {
		e.preventDefault();
		const btn = jq(this);
		const rowId = btn.data("id");

		jq(".popoverBtn").not(btn).each(function() {
			const otherPopover = bootstrap.Popover.getInstance(this);
			if (otherPopover) {
				otherPopover.hide();
			}
		});

		//popover render
		btn.popover({
			html: true,
			trigger: "manual",
			placement: "top",
			sanitize: false,
			content: () => renders.popover.changeUserPassword(rowId),
		});

		btn.popover("show");

		const popoverInstance = bootstrap.Popover.getInstance(btn[0]);
		if (popoverInstance && popoverInstance.tip) {
			const tip = jq(popoverInstance.tip);

			//handler for close buttons
			tip.find(".btn-close, .btnClosePopover").off("click").on("click", function() {
				btn.popover("hide");
			});

			//handler for confirm button
			tip.find(".btnConfirmPassword").off("click").on("click", async function() {
				const newPassword = tip.find(`#newPassword${rowId}`).val().trim();
				const repeatPassword = tip.find(`#repeatPassword${rowId}`).val().trim();

				jq(".userNotif").text("").addClass("d-none");

				try{
					ValidatePassword(newPassword)
				}catch(error){
					jq("#errorNewPassRoot").text(error).removeClass("d-none");
					displayLoader("#errorNewPassRoot");
					return;
				}

				if(newPassword !== repeatPassword){
					jq("#errorRepeatPassRoot").text("Passwords do not match.").removeClass("d-none");
					displayLoader("#errorRepeatPassRoot");
					return;
				}

				try{
					const response = await apiReq({'q':'user','c':'pass','user':rowId,'token':userCred.token,'pass':newPassword});

					jq("#successPassRoot").text("Password updated successfully!").removeClass("d-none");
					displayLoader("#successPassRoot");
				}catch(error){
					jq("#errorRepeatPassRoot").text(error).removeClass("d-none");
					displayLoader("#errorRepeatPassRoot");
					return;
				}
			});

			jq(document).off("click.popover").on("click.popover", function(event) {
				if (!btn.is(event.target) && btn.has(event.target).length === 0 &&
					!tip.is(event.target) && tip.has(event.target).length === 0) {
					btn.popover("hide");
				}
			});
			btn.off("hide.bs.popover").on("hide.bs.popover", function() {
				tip.find("input").val("");
				jq(".userNotif").text("").addClass("d-none");
				jq(document).off("click.popover");
			});
		}
	});
	//handler for delete user button
	jq('#userTable').on('click', '.btnDeleteUser', function(e) {
		e.preventDefault();
		const btn = jq(this);
		const id = btn.data("id");
		const type = btn.data("type");

		jq(".popoverBtn").not(btn).each(function() {
			const otherPopover = bootstrap.Popover.getInstance(this);
			if (otherPopover) {
				otherPopover.hide();
			}
		});

		//popover render
		btn.popover({
			html: true,
			trigger: "manual",
			placement: "right",
			sanitize: false,
			content: () => renders.popover.deleteUser(id, type),
		});

		btn.popover("show");

		const popoverInstance = bootstrap.Popover.getInstance(btn[0]);
		if (popoverInstance && popoverInstance.tip) {
			const tip = jq(popoverInstance.tip);

			//handler for close buttons
			tip.find(".btn-close, .btnCancelDelete").off("click").on("click", function(){
				btn.popover("hide");
			});

			//handler for confirm button
			tip.find(".btnConfirmDelete").off("click").on("click", async function(){
				jq(".userNotif").text("").addClass("d-none");

				try{
					const response = await apiReq({'q':'user','c':'del','user':id,'token':userCred.token});

					btn.popover("hide");

					jq("#userTable").DataTable().row(function(idx, data, node){return data[0] == id;}).remove().draw(false);
				}catch(error){
					jq("#errorDeleteUser").text(error).removeClass("d-none");
					displayLoader("#errorDeleteUser");
					return;
				}
			});

			jq(document).off("click.popover").on("click.popover", function(event){
				if(!btn.is(event.target) && btn.has(event.target).length === 0 &&
					!tip.is(event.target) && tip.has(event.target).length === 0) {
					btn.popover("hide");
				}
			});

			btn.off("hide.bs.popover").on("hide.bs.popover", function(){
				jq(".userNotif").text("").addClass("d-none");
				jq(document).off("click.popover");
			});
		}
	});

	//handler for inline lock/unlock button
	jq("#userTable").on('click', '.btnToggleLock', async function(){
		const userId = jq(this).data('id');
		const btn = jq(this);
		const text = btn.find('.inputUserLockText');
		const icon = btn.find('i');

		const isLocked = text.text().trim() === "locked";

		btn.prop('disabled', true);

		try{
			const response = await apiReq({'q':'user','c':'lock','user':userId,'token':userCred.token,'lock':!isLocked});

			btn.removeClass("btn-outline-success btn-outline-warning").addClass(!isLocked ? 'btn-outline-warning' : 'btn-outline-success');
			text.text(!isLocked ? "locked" : "unlocked");
			icon.removeClass('bi-lock-fill bi-unlock-fill').addClass(!isLocked ? 'bi-lock-fill' : 'bi-unlock-fill');

			btn.closest('tr').removeClass('table-secondary table-light').addClass(!isLocked ? 'table-secondary' : 'table-light');
			btn.closest('tr').find('span.form-control').css({
					"background-color": !isLocked ? "transparent" : "",
					"border": !isLocked ? "none" : "",
					"box-shadow": !isLocked ? "none" : "",
				});
			jq(`.lockSuccess[data-id="${userId}"]`).text("Updated successfully").removeClass('d-none');
		}catch(error){
			showErrorPopover(btn, error);
			return;
		}finally{
			btn.prop('disabled', false);
		}
	});

	//handler for inline root/un-root button
	jq("#userTable").on('click', '.btnToggleRoot', async function(){
		const userId = jq(this).data('id');
		const btn = jq(this);
		const text = btn.find('.inputUserRootText');
		const icon = btn.find('i');

		const isRoot = text.text().trim() === "root";

		btn.prop('disabled', true);

		try {
			const response = await apiReq({'q':'user','c':'root','user':userId,'token':userCred.token,'root':!isRoot});

			btn.removeClass("btn-outline-secondary btn-outline-danger").addClass(!isRoot ? 'btn-outline-danger' : 'btn-outline-secondary');
			text.text(!isRoot ? "root" : "non-root");
			icon.removeClass('bi-shield-fill-check bi-person-fill').addClass(!isRoot ? 'bi-shield-fill-check' : 'bi-person-fill');

			jq(`.rootSuccess[data-id="${userId}"]`).text("Updated successfully").removeClass('d-none');
		} catch (error) {
			showErrorPopover(btn, error);
			return;
		} finally {
			btn.prop('disabled', false);
		}
	});

	//handler for inline edit user email button
	jq('#userTable').on('click', '.btnEditUserEmail', function(){
		let rowId = jq(this).data('id');
		let span = jq(`.inputUserEmailText[data-id="${rowId}"]`);
		let input = jq(`.inputUserEmail[data-id="${rowId}"]`);

		jq(`.emailSuccess[data-id="${rowId}"]`).addClass("d-none");

		input.val(span.text());
		span.addClass('d-none');
		input.removeClass('d-none').focus();

		jq(this).addClass('d-none');
		jq(`.btnSaveUserEmail[data-id="${rowId}"]`).removeClass('d-none');
		jq(`.btnCancelUserEmail[data-id="${rowId}"]`).removeClass('d-none');
	});
	//handler for inline save edit user email button
	jq('#userTable').on('click', '.btnSaveUserEmail', async function(){
		let rowId = jq(this).data('id');
		let span = jq(`.inputUserEmailText[data-id="${rowId}"]`);
		let input = jq(`.inputUserEmail[data-id="${rowId}"]`);
		let newEmail = input.val().trim();

		try{
			ValidateEmail(newEmail);
		}catch(error){
			jq(`.emailSuccess[data-id="${rowId}"]`).addClass("d-none");
			showErrorPopover(jq(this), error);
			input.focus();
			return;
		}

		try{
			const response = await apiReq({'q':'user','c':'mail','user':rowId,'token':userCred.token,'mail':newEmail});

			span.text(newEmail);
			span.removeClass('d-none');
			input.addClass('d-none');

			jq(this).addClass('d-none');
			jq(`.btnEditUserEmail[data-id="${rowId}"]`).removeClass('d-none');
			jq(`.btnCancelUserEmail[data-id="${rowId}"]`).addClass('d-none');

			jq(`.emailSuccess[data-id="${rowId}"]`).text("Email changed successfully!").removeClass("d-none");
		}catch(error){
			showErrorPopover(jq(this), error);
			jq(`.emailSuccess[data-id="${rowId}"]`).addClass("d-none");
			return;
		}
	});
	//handler for inline cancel edit user email button
	jq('#userTable').on('click', '.btnCancelUserEmail', function(){
		let rowId = jq(this).data('id');
		let span = jq(`.inputUserEmailText[data-id="${rowId}"]`);
		let input = jq(`.inputUserEmail[data-id="${rowId}"]`);

		input.val(span.text());
		input.addClass('d-none');
		span.removeClass('d-none');

		jq(this).addClass('d-none');
		jq(`.btnSaveUserEmail[data-id="${rowId}"]`).addClass('d-none');
		jq(`.btnEditUserEmail[data-id="${rowId}"]`).removeClass('d-none');
	});

	//handler for inline pick user role button
	jq('#userTable').on('click', '.btnEditUserRole', function(){
		let rowId = jq(this).data('id');
		let span = jq(`.inputUserRoleText[data-id="${rowId}"]`);
		let select = jq(`.inputUserRole[data-id="${rowId}"]`);

		select.val(span.text());
		span.addClass('d-none');
		select.removeClass('d-none').focus();

		jq(this).addClass('d-none');
		jq(`.btnSaveUserRole[data-id="${rowId}"]`).removeClass('d-none');
		jq(`.btnCancelUserRole[data-id="${rowId}"]`).removeClass('d-none');
	});
	//handler for inline save user role button
	jq('#userTable').on('click', '.btnSaveUserRole', async function(){
		let rowId = jq(this).data('id');
		let span = jq(`.inputUserRoleText[data-id="${rowId}"]`);
		let select = jq(`.inputUserRole[data-id="${rowId}"]`);
		let newRole = select.val();

		try{
			const response = await apiReq({'q':'user','c':'role','user':rowId,'token':userCred.token,'role':newRole});

			span.text(newRole);
			span.removeClass('d-none');
			select.addClass('d-none');

			jq(this).addClass('d-none');
			jq(`.btnEditUserRole[data-id="${rowId}"]`).removeClass('d-none');
			jq(`.btnCancelUserRole[data-id="${rowId}"]`).addClass('d-none');

			jq(`.roleSuccess[data-id="${rowId}"]`).text("Role updated successfully!").removeClass("d-none");
		}catch(error){
			showErrorPopover(jq(this), error);
			jq(`.roleSuccess[data-id="${rowId}"]`).addClass("d-none");
			return;
		}
	});
	//handler for inline cancel pick user role button
	jq('#userTable').on('click', '.btnCancelUserRole', function(){
		let rowId = jq(this).data('id');
		let span = jq(`.inputUserRoleText[data-id="${rowId}"]`);
		let input = jq(`.inputUserRole[data-id="${rowId}"]`);

		input.val(span.text());
		input.addClass('d-none');
		span.removeClass('d-none');

		jq(this).addClass('d-none');
		jq(`.btnSaveUserRole[data-id="${rowId}"]`).addClass('d-none');
		jq(`.btnEditUserRole[data-id="${rowId}"]`).removeClass('d-none');
	});
});

//blocks add new user button, before all the necessary inputs have text
jq(document).on("input", "#inputLoginNewUser, #inputEmailNewUser, #selectTypeNewUser, #inputPasswordNewUser, #inputPasswordRepeatNewUser", function() {
	const addLogin = jq("#inputLoginNewUser").val();
	const addEmail = jq("#inputEmailNewUser").val();
	const addType = jq("#selectTypeNewUser").val();
	const addPass = jq("#inputPasswordNewUser").val();
	const addRepeatPass = jq("#inputPasswordRepeatNewUser").val();

	if(addLogin && addEmail && addType && addPass && addRepeatPass){
		jq("#btnAddNewUser").removeClass("disabled");
	}else{
		jq("#btnAddNewUser").addClass("disabled");
	}
});

//datatables table initialisation
function users(){
	return jq("#userTable").DataTable({
		//populates table with data
		ajax: function(data, callback, settings) {
			const controller = new AbortController();

			loadList({ signal: controller.signal })
				.then(rows => callback({ data: rows }))
				.catch(error => {
					if (error.name !== "AbortError") {
						console.error(error);
						callback({ data: [] });
					}
				});
			return { abort: () => controller.abort() };
		},
		//renders columns for the table
		columns: [
			{
				title: "login",
				data: 0,
				width: "12rem",
				render: function(data, row, id){
					return renders.table.loginColumn(id[0], data);
				}
			},
			{
				title: "email",
				data: 2,
				width: "18rem",
				render: function(data, row, id){
					return renders.table.emailColumn(id[0], data); 
				}
			},
			{
				title: "role",
				data: 3,
				width: "13rem",
				render: function(data, row, id){
					const roles = ["admin", "oper", "user"];
					const options = roles.map(role => 
						`<option value="${role}" ${role === data ? 'selected' : ''}>${role}</option>`
					).join('');
					return renders.table.roleColumn(id[0], data, options); 
				}
			},
			{
				title: "root",
				data: 1,
				width: "8rem",
				render: function(data, row, id){
					return renders.table.rootColumn(id[0], data); 
				}
			},
			{
				title: "lock",
				data: 5,
				width: "8rem",
				render: function(data, row, id){
					return renders.table.lockColumn(id[0], data); 
				}
			},
			{
				title: "comment",
				data: 4,
				width: null,
				orderable: false,
				render: function(data, row, id){
					const text = data !== null ? data.replace(/\\n/g, "\n") : "";
					return renders.table.commentColumn(id[0], text); 
				}
			},
			{
				data: null,
				width: "18rem",
				orderable: false,
				render: function(data, row, id){
					return renders.table.btnColumn((userCred.login === id[0] ? "disabled" : ""), id[0]); 
				},
			}
		],
		//styles for locked and unlocked rows
		createdRow: function(row, data){
			if(data[5]){
				jq(row).css("background-color", "var(--bs-secondary-bg)");
			}else{
				jq(row).css("background-color", "var(--bs-body-bg)");
			}
			jq(row).find("span.form-control").css({
				"background-color": "transparent",
				"border": "none",
				"box-shadow": "none",
				"color": "inherit"
			});
		}
	});
}

//function for restoring user's last tab
function showTab(tabId){
	const tabIds = '#mainViewPage, #settingsViewPage, #usersViewPage';
	const lnkIds = '#mainViewLink, #settingsViewLink, #usersViewLink';

	jq(tabIds).removeClass("active show").addClass("d-none");
	jq(lnkIds).removeClass("active");

	if(tabId === "mainViewLink"){
		loadInfo(userCred);
		jq("#mainViewPage").removeClass("d-none").addClass("active show");
	}else if (tabId === "settingsViewLink"){
		jq("#settingsViewPage").removeClass("d-none").addClass("active show");
	}else if(tabId === "usersViewLink"){
		if (userTable && userTable.ajax) {
			userTable.ajax.reload(null, false);
		}else{
			userTable = users();
		}
		jq("#usersViewPage").removeClass("d-none").addClass("active show");
	}

	jq("#" + tabId).addClass("active");

	setCookie('tabId', tabId);
}

//function for loading other users' data into a list of objects
async function loadList(){
	const response = await apiReq({'q':'user','c':'list','token':userCred.token});

	return response.data;
}

//function for creating error popovers
function showErrorPopover(btn, error) {
	//hide any other popovers first
	jq(".popoverBtn").not(btn).each(function(){
		const otherPopover = bootstrap.Popover.getInstance(this);
		if(otherPopover){
			otherPopover.hide();
		}
	});

	//render the popover
	btn.popover({
		html: true,
		trigger: "manual",
		placement: "right",
		sanitize: false,
		content: () => renders.popover.error(error),
	});

	btn.popover("show");

	const popoverInstance = bootstrap.Popover.getInstance(btn[0]);
	if (popoverInstance && popoverInstance.tip){
		const tip = jq(popoverInstance.tip);

		//handle close buttons
		tip.find(".btn-close, .btnCloseError").off("click").on("click", function(){
			btn.popover("hide");
		});

		//handle copy button
		tip.find(".btnCopyErrors").off("click").on("click", function(){
			const errorText = tip.find("#errorList").text().trim();
			navigator.clipboard.writeText(errorText);
		});

		//close when clicking outside
		jq(document).off("click.popover").on("click.popover", function(event){
			if (!btn.is(event.target) && btn.has(event.target).length === 0 &&
				!tip.is(event.target) && tip.has(event.target).length === 0) {
				btn.popover("hide");
			}
		});

		btn.off("hide.bs.popover").on("hide.bs.popover", function(){
			jq(document).off("click.popover");
		});
	}
}
