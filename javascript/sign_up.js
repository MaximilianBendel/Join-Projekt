let signUpDataJson = [];

const url = "https://join-portfolio-7b325-default-rtdb.europe-west1.firebasedatabase.app/";

async function getSignUpData() {
    let email = document.getElementById('inputEmailSignUp').value;
    let password = document.getElementById('secondPasswordSignUp').value;
    let signUpName = document.getElementById('inputNameSignUp').value;
    let signUpData = signUpDataTemplate(email, password, signUpName);
    signUpDataJson.push(signUpData);
    saveSignUpDataInFirebase();
}

function signUpDataTemplate(email, password, signUpName) {
    return {
        "email": email,
        "password": password,
        "name": signUpName,
    };
}

async function saveSignUpDataInFirebase() {
    let response = await fetch(url + 'SignUpData.json', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpDataJson)
    });

    if (!response.ok) {
        console.error(`Fehler: ${response.status} - ${response.statusText}`);
        throw new Error("Netzwerkantwort war nicht erfolgreich");
    }
}



function changePasswordImgLogIn() {
    let inputPassword = document.getElementById('passwordLogIn').value;
    let image = document.getElementById('passwordLogInImg');
    changePasswordImgTemplate(inputPassword, image);
}

function changeFirstPasswordImgSignUp() {
    let inputPassword = document.getElementById('firstPasswordSignUp').value;
    let image = document.getElementById('firstPasswordLogInImg');
    changePasswordImgTemplate(inputPassword, image);
}

function changesecondPasswordImgSignUp() {
    let inputPassword = document.getElementById('secondPasswordSignUp').value;
    let image = document.getElementById('secondPasswordSignUpImg');
    changePasswordImgTemplate(inputPassword, image);
}

function changePasswordImgTemplate(inputPassword, image) {
    if (inputPassword === "") {
        image.src = "./assets/img/log_in_img/lock.svg";
        image.classList.remove('cursorpointer');
    } else {
        image.classList.add('cursorpointer');
        image.src = "./assets/img/log_in_img/visibility_off.svg";
    }
}

function passwordLogInVisible() {
    let image = document.getElementById('passwordLogInImg');
    let x = document.getElementById("passwordLogIn");
    passwordVisibleTemplate(x, image);
}

function firstPasswordSignUpVisible() {
    let image = document.getElementById('firstPasswordLogInImg');
    let x = document.getElementById("firstPasswordSignUp");
    passwordVisibleTemplate(x, image);
}

function secondPasswordSignUpVisible() {
    let image = document.getElementById('secondPasswordSignUpImg');
    let x = document.getElementById("secondPasswordSignUp");
    passwordVisibleTemplate(x, image);
}

function passwordVisibleTemplate(x, image) {
    if (x.type === "password") {
        x.type = "text";
        image.src = "./assets/img/log_in_img/visibility.svg"
    } else {
        x.type = "password";
        image.src = "./assets/img/log_in_img/visibility_off.svg"
    }
}

async function loadDataToFirebaseAndCheckPasswords(event) {
    event.preventDefault();
    const signUpContainer = document.getElementById('signUpContainer');
    let nameInput = document.querySelector('input[placeholder="Name"]');
    let emailInput = document.getElementById('inputEmailSignUp');
    let password1Input = document.getElementById('firstPasswordSignUp');
    let password2Input = document.getElementById('secondPasswordSignUp');
    checkNameInputTemplate(nameInput);
    checkEmailInputTemplate(emailInput);
    let password1 = password1Input.value;
    let password2 = password2Input.value;
    if (password1 === "" && password2 === "") {
        password1Template(password1Input);
        password2Template(password2Input);
    } else if (password1 !== password2) {
        passwordMismatchTemplate(password1Input, password2Input);
    } else if (password1 === password2 && document.getElementById('errorMessageMismatchSignUp')) {
        removeErrorMessages(password1Input, password2Input);
    } else if (!document.getElementById('errorMessageMismatchSignUp')) {
        await getSignUpData();
        finalSubmit(signUpContainer);
    }
}

function removeErrorMessages(password1Input, password2Input) {
    password1Input.classList.remove('error-border');
    password2Input.classList.remove('error-border');
    document.getElementById('errorMessageMismatchSignUp').remove();
}

function finalSubmit(signUpContainer) {
    signUpContainer.classList.remove('display-none');
    setTimeout(() => {
        signUpContainer.classList.add('move-up');
    }, 10);
    setTimeout(() => {
        window.location.href = './log_in.html';
    }, 2000);
}

function passwordMismatchTemplate(password1Input, password2Input) {
    let errorMessage = password2Input.parentNode.querySelector('.error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.textContent = 'Ups! your password dont match';
        errorMessage.classList.add('error-message');
        errorMessage.id = 'errorMessageMismatchSignUp';
        password2Input.parentNode.appendChild(errorMessage);
    }
    password1Input.classList.add('error-border');
    password2Input.classList.add('error-border');
    return;
}

function password1Template(password1Input) {
    if (!password1Input.parentNode.querySelector('.error-message')) {
        let errorMessage = document.createElement('div');
        errorMessage.textContent = 'Bitte Feld ausfüllen';
        errorMessage.classList.add('error-message');
        errorMessage.id = 'errorMessagePassword1SignUp';
        password1Input.parentNode.appendChild(errorMessage);
    }
    password1Input.classList.add('error-border');
    return;
}

function password2Template(password2Input) {
    if (!password2Input.parentNode.querySelector('.error-message')) {
        let errorMessage = document.createElement('div');
        errorMessage.textContent = 'Bitte Feld ausfüllen';
        errorMessage.classList.add('error-message');
        errorMessage.id = 'errorMessagePassword2SignUp';
        password2Input.parentNode.appendChild(errorMessage);
    }
    password2Input.classList.add('error-border');
    return; 
}

function checkEmailInputTemplate(emailInput) {
    if (emailInput.value.trim() === '') {
        if (!emailInput.parentNode.querySelector('.error-message')) {
            let errorMessage = document.createElement('div');
            errorMessage.textContent = 'Bitte Email-Adresse eingeben!';
            errorMessage.classList.add('error-message');
            errorMessage.id = 'errorMessageEmailSignUp';
            emailInput.parentNode.appendChild(errorMessage);
        }
        emailInput.classList.add('error-border');
        return;
    }
    if (!emailInput.value.includes('@')) {
        let errorMessage = emailInput.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = 'Bitte @-Zeichen beachten!';
        } else {
            errorMessage = document.createElement('div');
            errorMessage.textContent = 'Bitte @-Zeichen beachten!';
            errorMessage.classList.add('error-message');
            errorMessage.id = 'errorMessageEmailSignUp';
            emailInput.parentNode.appendChild(errorMessage);
        }
        emailInput.classList.add('error-border');
        return;
    }
    let errorMessage = emailInput.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    emailInput.classList.remove('error-border');
}

function checkNameInputTemplate(nameInput) {
    if (nameInput.value.trim() === '') {
        if (!nameInput.parentNode.querySelector('.error-message')) {
            let nameErrorMessage = document.createElement('div');
            nameErrorMessage.textContent = 'Bitte Name eingeben !';
            nameErrorMessage.classList.add('error-message');
            nameErrorMessage.id = 'errorMessageNameSignUp';
            nameInput.parentNode.appendChild(nameErrorMessage);
        }
        nameInput.classList.add('error-border');
        return;
    }
}

function removeErrorMessageOnNameInput() {
    let input = document.getElementById('inputNameSignUp');
    let errorMessage = document.getElementById('errorMessageNameSignUp')
    if (input.value.length > 0 && errorMessage) {
        errorMessage.remove();
    } else {
        restoreErrorMessageOnNameInput(input, errorMessage);
        input.classList.add('error-border');
    }
    if (input.value.length > 0) {
        input.classList.remove('error-border');
    }
}

function restoreErrorMessageOnNameInput(input, errorMessage) {
    if (input.value.length <= 0 && !errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.textContent = 'Bitte Name eingeben';
        errorMessage.classList.add('error-message');
        errorMessage.id = 'errorMessageNameSignUp';
        let inputContainer = document.querySelector('.input-container');
        inputContainer.appendChild(errorMessage);
    }
}

function removeErrorMessageOnEmailInput() {
    let input = document.getElementById('inputEmailSignUp');
    let errorMessage = document.getElementById('errorMessageEmailSignUp')
    if (input.value.length > 0 && errorMessage) {
        errorMessage.remove();
    } else {
        restoreErrorMessageOnEmailInput(input, errorMessage, input.parentNode);
        input.classList.add('error-border');
    }
    if (input.value.length > 0) {
        input.classList.remove('error-border');
    }
}

function restoreErrorMessageOnEmailInput(input, errorMessage, container) {
    if (input.value.length <= 0 && !errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.textContent = 'Bitte Email-Adresse eingeben !';
        errorMessage.classList.add('error-message');
        errorMessage.id = 'errorMessageEmailSignUp';
        let inputContainer = document.querySelector('.input-container');
        container.appendChild(errorMessage);
    }
}

function removeErrorMessageOnPassword1Input() {
    let input = document.getElementById('firstPasswordSignUp');
    let errorMessage = document.getElementById('errorMessagePassword1SignUp')
    if (input.value.length > 0 && errorMessage) {
        errorMessage.remove();
    } else {
        restoreErrorMessageOnPassword1Input(input, errorMessage, input.parentNode);
        input.classList.add('error-border');
    }
    if (input.value.length > 0) {
        input.classList.remove('error-border');
    }
}

function restoreErrorMessageOnPassword1Input(input, errorMessage, container) {
    if (input.value.length <= 0 && !errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.textContent = 'Bitte Feld ausfüllen !';
        errorMessage.classList.add('error-message');
        errorMessage.id = 'errorMessagePassword1SignUp';
        let inputContainer = document.querySelector('.input-container');
        container.appendChild(errorMessage);
    }
}

function removeErrorMessageOnPassword2Input() {
    let input = document.getElementById('secondPasswordSignUp');
    let errorMessage = document.getElementById('errorMessagePassword2SignUp')
    if (input.value.length > 0 && errorMessage) {
        errorMessage.remove();
    } else {
        restoreErrorMessageOnPassword2Input(input, errorMessage, input.parentNode);
        input.classList.add('error-border');
    }
    if (input.value.length > 0) {
        input.classList.remove('error-border');
    }
}

function restoreErrorMessageOnPassword2Input(input, errorMessage) {
    if (input.value.length <= 0 && errorMessage) {
        if (errorMessage.textContent !== 'Bitte Feld ausfüllen !') {
            errorMessage.remove();
        }
        if (!input.parentNode.querySelector('.error-message')) {
            errorMessage = document.createElement('div');
            errorMessage.textContent = 'Bitte Feld ausfüllen !';
            errorMessage.classList.add('error-message');
            errorMessage.id = 'errorMessagePassword2SignUp';
            let inputContainer = input.parentNode;
            inputContainer.appendChild(errorMessage);
        }
    } else {
        if (errorMessage && errorMessage.textContent === 'Bitte Feld ausfüllen !') {
            errorMessage.remove();
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const checkbox = document.getElementById('privacyCheckbox');
    const button = document.getElementById('submit');
    button.disabled = !checkbox.checked;
    // Event listener for checkbox state change
    checkbox.addEventListener('change', function () {
        button.disabled = !this.checked;
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const privacyPolicyLink = document.getElementById("privacyPolicyLink");
    const legalNoticeLink = document.getElementById("legalNoticeLink");
    const privacyPolicyLinkSignUp = document.getElementById("privacyLinkSignUp");
    const overlay = document.getElementById("overlay");
    const privacyPolicyPopup = document.getElementById("privacyPolicyPopup"); // Hier korrigiert

    const legalNoticePopup = document.getElementById("legalNoticePopup");

    const showPopup = (popup) => {
        overlay.style.display = "block";
        popup.style.display = "block";
    };

    const hidePopups = () => {
        overlay.style.display = "none";
        privacyPolicyPopup.style.display = "none";
        legalNoticePopup.style.display = "none";
    };

    privacyPolicyLinkSignUp.addEventListener("click", (event) => {
        event.preventDefault();
        showPopup(privacyPolicyPopup);
    });

    privacyPolicyLink.addEventListener("click", (event) => {
        event.preventDefault();
        showPopup(privacyPolicyPopup);
    });

    legalNoticeLink.addEventListener("click", (event) => {
        event.preventDefault();
        showPopup(legalNoticePopup);
    });

    overlay.addEventListener("click", hidePopups);
});

