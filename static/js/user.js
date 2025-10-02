const jq = jQuery.noConflict();

import { getUserCred, loadInfo, theme, navs, pass, mail, logout, getTab, setCookie, displayLoader } from "./api.js";
const userCred = getUserCred();

jq(document).ready(async function(){
	theme();
	//load previous tab
	if(getTab()){showTab(getTab())}else{showTab("mainViewLink")};
	navs();

	//handlers for switching tab
	jq("#mainViewLink").click(() => showTab("mainViewLink"));
	jq("#settingsViewLink").click(() => {showTab("settingsViewLink"); jq("#settingsViewPage input").val(""); jq(".userNotif").text("").addClass("d-none");});

	jq("#btnLogout").click(() => logout());
	pass(userCred);
	mail(userCred);

//	logout();
});

//function for restoring user's last tab
function showTab(tabId){
	const tabIds = '#mainViewPage, #settingsViewPage';
	const lnkIds = '#mainViewLink, #settingsViewLink';

	jq(tabIds).removeClass("active show").addClass("d-none");
	jq(lnkIds).removeClass("active");

	if(tabId === "mainViewLink"){
		loadInfo(userCred);
		jq("#mainViewPage").removeClass("d-none").addClass("active show");
	}else if (tabId === "settingsViewLink"){
		jq("#settingsViewPage").removeClass("d-none").addClass("active show");
	}

	jq("#" + tabId).addClass("active");

	setCookie('tabId', tabId);
}

