const jq = jQuery.noConflict();

import { apiReq, setCookie, theme, displayLoader } from "./api.js";

jq(document).ready(async function(){
    //checks, if the user is in the recovery process and sends second step recovery request
	theme();
    const recovery = getRecoveryToken();
    if(recovery){
        jq(".userNotif").text("").addClass("d-none");

        try{
            const response = await apiReq({'q':'recovery', 'token':recovery});

            jq("#successRecoveryFinal").text("Recovery successful. Check your email for new password").removeClass("d-none");
            displayLoader("#successRecoveryFinal");
        }catch(error){
            jq("#errorLogin").text(error).removeClass("d-none");
            displayLoader("#errorLogin");
        }
    }

    //blocks Login button, untill there is text in the inputs
    jq("#loginName, #loginPassword").on("input", toggleLoginBtn);
    setTimeout(toggleLoginBtn, 500);

    //evokes modal window for password recovery
    jq("#btnRecover").click(function(){
        const modal = new bootstrap.Modal(jq("#passwordRecoveryModal"));
        modal.show();
    });
    //handles recover password button
    jq("#btnPasswordRecoveryEmail").click(async function(){
        const recoveryText = jq("#inputPasswordRecovery").val();

        jq(".userNotif").text("").addClass("d-none");
        
        try{
            const response = await apiReq({'q':'recovery', 'string':recoveryText});
            if(response.error){
                jq("#errorRecovery").text(response.error).removeClass("d-none");
                displayLoader("#errorRecovery");
            }else{
                jq("#successRecovery").text(response.text).removeClass("d-none");
                displayLoader("#successRecovery");
            }
        }catch(error){
            jq("#errorRecovery").text(error).removeClass("d-none");
            displayLoader("#errorRecovery");
            return;
        }
    });

    //handles login button
    jq("#btnLogin").click(async function(){
        const user = jq("#loginName").val().trim();
        const pass = jq("#loginPassword").val().trim();

        try{
            const response = await apiReq({'auth':true,'user':user,'pass':pass});
            let page;
            if(response.root){
                page = "./admin.html";
            }else{
                page = "./user.html";
            }

            setCookie('user', user);
            setCookie('token', response.token)
            window.location.replace(page);
        }catch(error){
            jq("#errorLogin").text(error).removeClass("d-none");
            displayLoader("#errorLogin");
        }
    });

    //handler for hide/show password buttons
    jq("#btnVisible").click(function(){
        const pass = jq("#loginPassword");
        if(pass.attr("type") === "password"){
            pass.attr("type", "text");
        }else{
            pass.attr("type", "password");
        }
        jq("#visibilityIcon").toggleClass("bi-eye bi-eye-slash");
    });
});

//extracts recovery token
function getRecoveryToken(){
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
}

function toggleLoginBtn(){
    const login = jq("#loginName").val();
    const password = jq("#loginPassword").val();
    
    if(login.length > 0 && password.length > 0){
        jq("#btnLogin").removeClass("disabled");
    }else{
        jq("#btnLogin").addClass("disabled");
    }
}
