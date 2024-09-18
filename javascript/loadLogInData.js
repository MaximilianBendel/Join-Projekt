const loginUrl = "https://join-portfolio-7b325-default-rtdb.europe-west1.firebasedatabase.app/.json";

async function loadLogInData() {
    try {
        const response = await fetch(loginUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        for (const key in data) {
            const userArray = data[key];
            if (Array.isArray(userArray) && userArray.length > 0) {
                userArray.forEach(user => {
                    if (user.name) {
                        logInName.push(user.name);
                        activeKey.push(key);
                    }
                });
            }
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function openLegalNotice() {
    window.open('./legal_notice.html', '_blank');
}

function openPrivacyPolice() {
    window.open('./privay_policy.html', '_blank');
}

async function loadActiveUser() {
    const activeUser = JSON.parse(localStorage.getItem('activeUser'));
    if (activeUser) {
        const userKey = activeUser.key;
        if (userKey === "guest") {
            const activeUserElement = document.getElementById('activeUser');
            const userInitialsElement = document.getElementById('userInitials');
            if (activeUserElement) {
                activeUserElement.innerHTML = "Guest";
            } else {
                console.error('Element with ID activeUser not found');
            }
            if (userInitialsElement) {
                userInitialsElement.innerHTML = "G";
            } else {
                console.error('Element with ID userInitials not found');
            }
            return;
        }
        try {
            const response = await fetch(`https://join-portfolio-7b325-default-rtdb.europe-west1.firebasedatabase.app/LogInData/${userKey}.json`);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const userData = await response.json();
            if (!userData || typeof userData.name !== 'string') {
                console.error('Invalid user data structure:', userData);
                return;
            }
            const name = userData.name;
            const activeUserElement = document.getElementById('activeUser');
            const userInitialsElement = document.getElementById('userInitials');
            if (activeUserElement) {
                activeUserElement.innerHTML = name;
            } else {
                console.error('Element with ID activeUser not found');
            }
            if (userInitialsElement) {
                userInitialsElement.innerHTML = getInitials(name);
            } else {
                console.error('Element with ID userInitials not found');
            }
        } catch (error) {
            console.error('Error loading active user from Firebase:', error);
        }
    } else {
        console.error('No active user found in localStorage');
    }
}


function loadActiveUserInitials() {
    const activeUser = JSON.parse(localStorage.getItem('activeUser'));
    if (activeUser && typeof activeUser.data.name === 'string') {
        document.getElementById('userInitials').innerHTML = getInitials(activeUser.data.name);
    } else {
        console.error('No active user found in localStorage or name is not a string');
    }
}

function getInitials(name) {
    return name.split(' ').map(word => word.charAt(0)).join('');
}

async function deleteActiveUser() {
    try {
        const activeUser = JSON.parse(localStorage.getItem('activeUser'));
        if (!activeUser) throw new Error('No active user found in localStorage');
        const userKey = activeUser.key;
        if (userKey === "guest") {
            localStorage.removeItem('activeUser');
            return;
        }
        const deleteResponse = await fetch(`https://join-portfolio-7b325-default-rtdb.europe-west1.firebasedatabase.app/LogInData/${userKey}.json`, {
            method: 'DELETE'
        });
        if (!deleteResponse.ok) {
            throw new Error('Failed to delete user data');
        }
        localStorage.removeItem('activeUser');
    } catch (error) {
        console.error('Error deleting user data:', error);
    }
}

function openLogIn() {
    deleteActiveUser();
    setTimeout(() => {
        window.location.href = './index.html';
    }, 2000);
}

function openSubMenu() {
    document.getElementById('submenucontainer').classList.remove('display-none');
}

function closeSubmenu() {
    document.getElementById('submenucontainer').classList.add('display-none');
}

document.addEventListener('click', (event) => {
    const submenu = document.getElementById('submenucontainer');
    const userDiv = document.querySelector('.user');
    if (!submenu) {
        console.error('Element with ID submenucontainer not found');
        return;
    }
    if (!userDiv) {
        console.error('Element with class user not found');
        return;
    }
    if (!submenu.contains(event.target) && !userDiv.contains(event.target)) {
        closeSubmenu();
    }
});
