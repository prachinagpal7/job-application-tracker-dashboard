let form = document.querySelector("#auth-form");
form.addEventListener("submit", function(e){
    e.preventDefault();
    createAcc();
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
        alert("Please fill all fields");
        return;
    }

    const userData = {
        myName: nameValue,
        myLastName: lastNameValue,
        myEmail: emailValue,
        myPassword: passwordValue,
        myApplications: []
    }

    localStorage.setItem('userStoredData', JSON.stringify(userData) );
    window.location.href = "/dashboard/dashboard.html";
}