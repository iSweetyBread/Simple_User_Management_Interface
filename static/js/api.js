const jq = jQuery.noConflict();

const debug = true;
import { ValidateEmail, ValidatePassword } from "./utils.js";

const url = "./api.cgi";

async function sendReq(d){
    return new Promise((resolve, reject) => {
        jq.ajax({
            url: url,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(d),
            success: resolve,
            error: (xhr, status, err) => reject(err || status)
        });
    });
}
export async function apiReq(d){
	const uri = window.location.pathname;
    const pattern = /login.html/;
    try{
		//NOTAPI
		
		let response = null;
		//login simulation
		if(d.auth == true && d.user && d.pass){
			if(d.user == "user" && d.pass == "user"){
				response = {"auth": true, "root": false, "token": 123123123123123}
			}else if(d.user == "root" && d.pass == "root"){
				response = {"auth": true, "root": true, "token": 456456456456456}
			}else{
				response = {"auth": false, "root": false, "error": "failed to login"}
			}
		}
		//load user info simulation
		if(d.c == "get"){
			if(d.user == "user", d.token == 123123123123123){
				response = {"auth": true, "root": false, "data":{"login": "user", "mail": "user@gmail.com", "role": "user"}}
			}else if(d.user == "root", d.token == 456456456456456){
				response = {"auth": true, "root": true, "data":{"login": "root", "mail": "root@gmail.com", "role": "root"}}
			}
		}
		//change user mail simulation
		if(d.c == "mail"){
			if(d.user == "user", d.token == 123123123123123){
				response = {"auth": true, "root": false, "success": true}
			}else if(d.user == "root", d.token == 456456456456456){
				response = {"auth": true, "root": true, "success": true}
			}
		}
		//change user password simulation
		if(d.c == "pass"){
			if(d.user == "user", d.token == 123123123123123, d.cpass == "user"){
				response = {"auth": true, "root": false, "success": true}
			}else if(d.user == "root", d.token == 456456456456456, d.cpass == "root"){
				response = {"auth": true, "root": true, "success": true}
			}else{
				if(d.user == "root"){
					response = {"auth": true, "root": true, "error": "wrong password"}
				}else if(d.user == "user"){
					response = {"auth": true, "root": false, "error": "wrong password"}
				}
			}
		}
		//load list of users simulation
		if(d.c == "list"){
			response = {"auth": true, "root": true, "data":
						[
							["asd", false, "asd@gmail.com", "user", "-/-", false],
							["fgh", true, "fgh@gmail.com", "root", "-/-", false],
							["jkl", false, "jkl@gmail.com", "user", "-/-", true],
							["zxc", false, "zxc@gmail.com", "oper", "random text", false],
							["vbn", true, "vbn@gmail.com", "root", "-/-", false],
						],
			};
		}
		//change user role simulation
		if(d.c == "role" || d.c == "root" || d.c == "lock" || d.c == "note" || d.c == "del" || d.c == "pass" || d.c == "add"){
			response = {"auth": true, "root": true, "success": true}
		}
		//NOTAPI

		//NOTAPI
        // const response = await sendReq(d);
		//NOTAPI

        if(response.error){
			if(!pattern.test(uri) && response && response.auth == false){
//Checks user's authentication during session
				setCookie('token', '', 0);
				setCookie('user', '', 0);
				setCookie('tabId', '', 0);
				localStorage.clear();
				sessionStorage.clear();
			
				jq('#sessionExpiredModal').modal('show');
			
				jq("#btnGoLogin").click(function() {
					window.location.replace("../login.html");
				});
			}else{
            	throw new Error(response.error);
			}
        }else{
            return response;
        }
    }catch(error){
        throw error;
    }
}

// general users functions
export function theme(){
	//handler for theme selection
	let theme = getCookie('theme');
	if(!theme || theme === 'auto'){
		theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	jq('html').attr('data-bs-theme', theme);

	jq('.dropdown-item').click(function(e){
		e.preventDefault();
		let selected = jq(this).data('theme');
		if(selected === 'auto'){
			jq('html').attr('data-bs-theme', window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
		}else{
			jq('html').attr('data-bs-theme', selected);
		}
		
		setCookie('theme', selected);
	});
}

export function navs() {
	//handler for tab navigation
	jq(".nav-link").click(function(){
		jq(".nav-link").removeClass("active");
		jq(this).addClass("active");

		jq(".nav-link").attr("aria-current", "");
		jq(this).attr("aria-current", "page");
	});
}

export function pass(userCred) {
	//handler for hide/show password buttons
	jq(".toggle-password-btn").click(function(){
		const input = jq(this).siblings(".toggle-password-input");
		const icon = jq(this).find("i");

		if(input.attr("type") === "password"){
			input.attr("type", "text");
			icon.removeClass("bi-eye-slash").addClass("bi-eye");
		}else{
			input.attr("type", "password");
			icon.removeClass("bi-eye").addClass("bi-eye-slash");
		}
	});

	// input handler
	jq("#inputCurrentPassword, #inputNewPassword, #inputNewPasswordRepeat").on("input", function(){
		const current = jq("#inputCurrentPassword").val();
		const newPass = jq("#inputNewPassword").val();
		const repeatPass = jq("#inputNewPasswordRepeat").val();
		if(current && newPass && repeatPass){
			jq("#btnChangePassword").removeClass("disabled");
		} else {
			jq("#btnChangePassword").addClass("disabled");
		}
	});

	//handler for "Change password" button
	jq("#btnChangePassword").click(async function(){
		const cPass = jq("#inputCurrentPassword").val();
		const newPass = jq("#inputNewPassword").val();
		const repeatPass = jq("#inputNewPasswordRepeat").val();

		jq(".userNotif").text("").addClass("d-none");

		try{
			ValidatePassword(newPass);
		}catch(error){
			jq("#errorNewPassword").text(error).removeClass("d-none");
			displayLoader("#errorNewPassword");
			return;
		}
		if(newPass !== repeatPass){
			jq("#errorRepeatPassword").text("Passwords do not match.").removeClass("d-none");
			displayLoader("#errorRepeatPassword");
			return;
		}

		try{
			const response = await apiReq({'q':'user','c':'pass','user':userCred.login,'token':userCred.token,'cpass':cPass,'pass':newPass});

			jq("#successPassMessage").text("Password updated successfully!").removeClass("d-none");
			displayLoader("#successPassMessage");
			jq("#inputCurrentPassword, #inputNewPassword, #inputNewPasswordRepeat").val("");
		}catch(error){
			jq("#errorRepeatPassword").text(error).removeClass("d-none");
			displayLoader("#errorRepeatPassword");
			return;
		}
	});
}

export function mail(userCred) {
	jq("#inputEmailEmail").on("input", function(){
		const email = jq("#inputEmailEmail").val();
		if(email){
			jq("#btnChangeEmail").removeClass("disabled");
		}else{
			jq("#btnChangeEmail").addClass("disabled");
		}
	});

	//handler for "Change email" button
	jq("#btnChangeEmail").click(async function(){
		const email = jq("#inputEmailEmail").val().trim();

		jq(".userNotif").text("").addClass("d-none");

		try{
			ValidateEmail(email);
		}catch(error){
			jq("#errorEmailEmail").text(error).removeClass("d-none");
			displayLoader("#errorEmailEmail");
			return;
		}

		try{			
			const response = await apiReq({'q':'user','c':'mail','user':userCred.login,'token':userCred.token,'mail':email});

			jq("#successEmailMessage").text("Email updated successfully!").removeClass("d-none");
			displayLoader("#successEmailMessage");
			jq("#inputEmailEmail").val("");
		}catch(error){
			jq("#errorEmailEmail").text(error).removeClass("d-none");
			displayLoader("#errorEmailEmail");
			return;
		}
	});
}

//logout function
export function logout() {
//	jq("#btnLogout").click(function(){
		setCookie('token', '', 0);
		setCookie('user', '', 0);
		setCookie('tabId', '', 0);
		localStorage.clear();
		sessionStorage.clear();
		window.location.replace("../login.html");
//	});
}

//function for saving user's current tab
export function getTab(){
	try{
		const cookies = document.cookie.split("; ");
		return cookies.find(i => i.startsWith("tabId")).split("=")[1];
	}catch{
		return null;
	}
}

//function for getting user's login and token
export function getUserCred(){
	const cookies = document.cookie ? document.cookie.split("; ") : [];
	if(!cookies.length){logout();return;}

	const userCookie = cookies.find(i => i.startsWith("user="));
	const tokenCookie = cookies.find(i => i.startsWith("token="));
	if(!userCookie || !tokenCookie){logout();return;}

	const user = userCookie.split("=")[1];
	const token = tokenCookie.split("=")[1];

	return {login: user, token: token}
}

//function for displaying user's data
export async function loadInfo(userCred){
	let info;
	try{
		jq("#infoLoader").show();
		info = await apiReq({'q':'user','c':'get','user':userCred.login,'token':userCred.token});
	}catch(error){
		window.location.replace("../login.html");
		return;
	}finally{
		jq("#infoLoader").hide();
	}

	jq("#currentUserLogin").text(info.data.login);
	jq("#currentUserEmail").text(info.data.mail);
	jq("#currentUserRole").text(info.data.role);
}

//extracts cookies
export function getCookie(name){
    const cookie = document.cookie.split("; ").find(row => row.startsWith(name + "="));
    return cookie ? cookie.split("=")[1] : null;
}
//sets cookies
export function setCookie(name, value, age = 60*60*24*365){
	document.cookie = `${name}=${value};Max-Age=${age};path=/;SameSite=Lax`;
}
//shows animation after receiving a response/error for input
export function displayLoader(element){
	const loader = jq('<div class="loader2"><div>');
	jq(element).first().before(loader);
	setTimeout(() => {
		loader.css("opacity", "0");
		setTimeout(() => {loader.remove(), 500});
	}, 500);
}