async function userInitials() {
    await includeHTML();
    loadActiveUserInitials();
    displayNoneHeader(); 
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

function displayNoneHeader() {
    var element1 = document.querySelector('.header_p');
    var element2 = document.querySelector('.user');
    var element3 = document.querySelector('.help');
    element1.classList.add('hidden');
    element2.classList.add('not-clickable');
    element3.classList.add('hidden');

}