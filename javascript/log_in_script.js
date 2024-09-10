const loginUrl = "https://join-portfolio-7b325-default-rtdb.europe-west1.firebasedatabase.app/SignUpData.json";

async function checkLogIn(event) {
    event.preventDefault();
    let email = document.getElementById('emailLogIn').value;
    let password = document.getElementById('passwordLogIn').value;

    try {
        let data = await fetchUserData();
        let userEntry = findUser(data, email, password);

        if (userEntry) {
            handleSuccessfulLogin(userEntry);
        } else {
            passwordError(document.getElementById('passwordLogIn'));
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
}

async function fetchUserData() {
    let response = await fetch(loginUrl);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
}

function findUser(data, email, password) {
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            let userDataArray = data[key];
            if (Array.isArray(userDataArray)) {
                for (let userData of userDataArray) {
                    if (userData.email === email && userData.password === password) {
                        return [key, userData];
                    }
                }
            }
        }
    }
    return null;
}

async function handleSuccessfulLogin(userEntry) {
    const [key, userData] = userEntry;
    const userName = userData.name;
    const userKey = await saveActiveUserInFirebase(userName);
    const activeUser = { key: userKey, data: { name: userName } };
    localStorage.setItem('activeUser', JSON.stringify(activeUser));
    localStorage.setItem('hasShownWelcome', 'false');  // Ensure to reset this flag on successful login
    window.location.href = './summary_user.html';
}

async function saveActiveUserInFirebase(name) {
    try {
        const response = await fetch('https://join-portfolio-7b325-default-rtdb.europe-west1.firebasedatabase.app/LogInData.json', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: name })
        });
        const data = await response.json();
        return data.name;
    } catch (error) {
        console.error('Error saving active user in Firebase:', error);
    }
}

function guestLogIn() {
    const guestUser = { key: "guest", data: { name: "Guest" } };
    localStorage.setItem('activeUser', JSON.stringify(guestUser));
    localStorage.setItem('hasShownWelcome', 'false');  // Ensure to reset this flag on guest login
    window.location.href = './summary_user.html';
}

function passwordError(passwordField) {
    if (!passwordField.parentNode.querySelector('.error-message')) {
        let errorMessage = document.createElement('div');
        errorMessage.textContent = 'Wrong Password. Try again';
        errorMessage.classList.add('error-message');
        errorMessage.id = 'errorMessagePassword';
        passwordField.parentNode.appendChild(errorMessage);
    }
    passwordField.classList.add('error-border');
}

function changePasswordImgLogIn() {
    let inputPassword = document.getElementById('passwordLogIn').value;
    let image = document.getElementById('passwordLogInImg');
    changePasswordImgTemplate(inputPassword, image);
}

function passwordLogInVisible() {
    let image = document.getElementById('passwordLogInImg');
    let x = document.getElementById("passwordLogIn");
    passwordVisibleTemplate(x, image);
}

function passwordVisibleTemplate(x, image) {
    if (x.type === "password") {
        x.type = "text";
        image.src = "./assets/img/log_in_img/visibility.svg";
    } else {
        x.type = "password";
        image.src = "./assets/img/log_in_img/visibility_off.svg";
    }
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

document.addEventListener("DOMContentLoaded", () => {
    const privacyPolicyLink = document.getElementById("privacyPolicyLink");
    const legalNoticeLink = document.getElementById("legalNoticeLink");
    const overlay = document.getElementById("overlay");
    const privacyPolicyPopup = document.getElementById("privacyPolicyPopup");
    const legalNoticePopup = document.getElementById("legalNoticePopup");

    const showPopup = (popup) => {
        if (overlay && popup) {
            overlay.style.display = "block";
            popup.style.display = "block";
        } else {
            console.error('Overlay or popup element not found');
        }
    };

    const hidePopups = () => {
        if (overlay && privacyPolicyPopup && legalNoticePopup) {
            overlay.style.display = "none";
            privacyPolicyPopup.style.display = "none";
            legalNoticePopup.style.display = "none";
        } else {
            console.error('Overlay or popup elements not found');
        }
    };

    if (privacyPolicyLink) {
        privacyPolicyLink.addEventListener("click", (event) => {
            event.preventDefault();
            showPopup(privacyPolicyPopup);
        });
    } else {
        console.error('Element with ID privacyPolicyLink not found');
    }

    if (legalNoticeLink) {
        legalNoticeLink.addEventListener("click", (event) => {
            event.preventDefault();
            showPopup(legalNoticePopup);
        });
    } else {
        console.error('Element with ID legalNoticeLink not found');
    }

    if (overlay) {
        overlay.addEventListener("click", hidePopups);
    } else {
        console.error('Element mit ID overlay not found');
    }
});

