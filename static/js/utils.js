export function ValidateName(text){
    const pattern = /^[\w]{4,16}[\w]$/;
    if(pattern.test(text)){
        return true;
    }else{
        throw "Invalid Name. Login name must containe only Latin word symbols and be 4-16 symbols long.";
    }
}

export function ValidateEmail(text){
    const pattern = /^\w+@[\w\.]+\.\w+$/;
    if(pattern.test(text)){
        return true;
    }else{
        throw "Invalid Email";
    }
}

export function ValidatePassword(text){
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{12,}$/;

    if(pattern.test(text)) {
        return true;
    }else{
        throw "Invalid password. Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@.#$!%*?&).";
    }
}