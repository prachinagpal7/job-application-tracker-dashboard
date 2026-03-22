let isLoginMode = false;
let form = document.querySelector("#auth-form");
const toggleFooterText = document.querySelector("#auth-footer p");
const toggleHeader = document.querySelector("#auth-header h1");
const toggleHeaderText = document.querySelector("#auth-header p");
const nameFields = document.querySelector("#name-fields");
const button = document.querySelector("#primary-btn");
const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');

function setupToggle() {
    const toggleFooter = document.querySelector("#auth-footer span");
    toggleFooter.addEventListener("click", function(e) {
        e.preventDefault();
        isLoginMode = !isLoginMode;

        if (isLoginMode) {
            nameFields.classList.add("hidden");
            toggleHeader.textContent = "Welcome Back";
            toggleHeaderText.textContent = "Log in to your job tracker account";
            button.textContent = "Sign In";
            toggleFooterText.innerHTML = `Don't have an account? <span>Sign up</span>`;
            firstName.removeAttribute("required");
            lastName.removeAttribute("required");
        } else {
            nameFields.classList.remove("hidden");
            toggleHeader.textContent = "Get Started";
            toggleHeaderText.textContent = "Create your job tracker account";
            button.textContent = "Create Account";
            toggleFooterText.innerHTML = `Already have an account? <span>Sign in</span>`;
            firstName.setAttribute("required", true);
            lastName.setAttribute("required", true);           
        }
        form.reset();
        setupToggle();
    });
}

setupToggle();

form.addEventListener("submit", function(e){
    e.preventDefault();
    if(isLoginMode){
        loginUser();
    } else {
        createAcc();
    }
});

function createAcc(){
    let inputName = document.querySelector('#firstName');
    let nameValue = inputName.value.trim();
    let inputLastName = document.querySelector('#lastName');
    let lastNameValue = inputLastName.value.trim();
    let inputEmail = document.querySelector('#email');
    let emailValue = inputEmail.value.trim();
    let inputPassword = document.querySelector('#password');
    let passwordValue = inputPassword.value.trim();

    if (!nameValue || !lastNameValue || !emailValue || !passwordValue) {
        showToast("Please fill all fields");
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    let existingUser = users.find(user => user.myEmail === emailValue);
    if(existingUser){
        showToast("User already exists. Please login!");
        return;
    }

    const newUser = {
        myName: nameValue,
        myLastName: lastNameValue,
        myEmail: emailValue,
        myPassword: passwordValue,
        myApplications: [],
    }

    users.push(newUser);

    localStorage.setItem('users', JSON.stringify(users) );
    localStorage.setItem('currentUser', emailValue );
    localStorage.setItem('toastMessage', "Account created successfully! Welcome to Career Track Compass." );
    window.location.href = "/dashboard/dashboard.html";
}

function loginUser(){
    let inputEmail = document.querySelector('#email');
    let emailValue = inputEmail.value.trim();
    let inputPassword = document.querySelector('#password');
    let passwordValue = inputPassword.value.trim();

    if (!emailValue || !passwordValue) {
        showToast("Please fill all fields");
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    let existingUser = users.find(user => (user.myEmail === emailValue) && (user.myPassword === passwordValue));
    if(!existingUser){
        showToast("Invalid email or password!");
        return;
    }

    localStorage.setItem('currentUser', emailValue );
    localStorage.setItem('toastMessage', "Login successful!" );
    window.location.href = "/dashboard/dashboard.html";
} 

function showToast(message) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-message");

    toastMsg.textContent = message;

    toast.classList.remove("hidden");
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("hidden");
    }, 2500);
}