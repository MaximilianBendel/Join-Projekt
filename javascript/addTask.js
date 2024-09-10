let tasks = [];
let subtasks = [];
let prio = "medium";
let url = 'https://jointask-cedc0-default-rtdb.europe-west1.firebasedatabase.app/.json';
let board = "toDo";
let authorityForTask = [];
let allContacts = [];

async function initAddTaskSite() {
    await includeHTML();
    await loadTasksFromFirebase();
    loadActiveUserInitials();
    loadActiveLinkAddTask();
    await initContactForaddTask();
    setMinDateForDateInput();

    document.addEventListener('click', closeContactListOnClickOutside);

    // Ensure the input field does not trigger the contact list
    const assignContactInput = document.getElementById('assignContact');
    if (assignContactInput) {
        assignContactInput.onclick = function(event) {
            event.stopPropagation();
        };
    }
}

function loadActiveLinkAddTask() {
    document.getElementById('summarySite').classList.remove('active-link');
    document.getElementById('addTaskSite').classList.add('active-link');
    document.getElementById('boardSite').classList.remove('active-link');
    document.getElementById('contactSite').classList.remove('active-link');
}

function setMinDateForDateInput() {
    let dateInput = document.getElementById('date');
    let today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

async function addTask() {
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let date = document.getElementById('date');
    let category = assignCategory();
    addPersonToTask();
    let task = assignTask(title, description, date, category);
    tasks.push(task);
    await saveTasksInFirebase();
    await showTempDivTask();
    setTimeout(function () {
        window.location.href = 'board.html';
    }, 2000);
}

function assignTask(title, description, date, category) {
    return {
        "title": title.value,
        "description": description.value,
        "date": date.value,
        "category": category,
        "priority": prio,
        "subtask": subtasks,
        "board": board,
        "authorityForTask": authorityForTask
    };
}

function assignCategory() {
    let category = document.getElementById('category');
    if (category.value == "User Story") {
        return "userStory.png";
    } else {
        return "technicalTask.png";
    }
}

async function saveTasksInFirebase() {
    await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tasks)
    });
}

async function loadTasksFromFirebase() {
    let response = await fetch(url);
    tasks = await response.json();
    if (tasks == null) {
        tasks = [];
    }
    loadTasks();
}

function addSubTask() {
    let subtask = {
        "subtask": document.getElementById('subtask').value,
        "done": false
    };
    if (document.getElementById('subtask').value.length > 0) {
        subtasks.push(subtask);
        loadSubtasks();
        document.getElementById('subtask').value = '';
    }
}

function loadSubtasks() {
    document.getElementById('addSubTask').innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i]['subtask'];
        document.getElementById('addSubTask').innerHTML += loadSubtaskHTML(i, subtask);
    }
}

function loadSubtaskHTML(i, subtask) {
    return `
    <div class="spaceBetweenSubtaskAndIcons" id="subtask${i}">
    <span>${subtask}</span>
    <span> 
     <img class="subtaskIcon" onclick="editSubtask(${i})" src="./assets/img/editIcon.png" alt="">
     <img class="subtaskIcon" onclick="deleteSubtask(${i})" src="./assets/img/deleteIcon.png" alt="">
     </span>
     </div>
    `;
}

function deleteSubtask(i) {
    subtasks.splice(i, 1);
    loadSubtasks();
}

function editSubtask(i) {
    document.getElementById(`subtask${i}`).innerHTML = `
<input id="changeSubtask${i}" type="text" value="${subtasks[i]['subtask']}">
<span> 
<img class="subtaskIcon" onclick="deleteSubtask(${i})" src="./assets/img/deleteIcon.png" alt="">
<img class="subtaskIcon" onclick="saveChangeSubtask(${i})" src="./assets/img/checkIcon.png" alt="">
</span>
`;
}

function saveChangeSubtask(i) {
    subtasks[i]['subtask'] = document.getElementById(`changeSubtask${i}`).value;
    loadSubtasks();
}

function resetSubTask() {
    subtasks = [];
    document.getElementById('addSubTask').innerHTML = "";
}

function changePrioToUrgent() {
    document.getElementById('urgent').src = './assets/img/activeUrgentPriority.png';
    document.getElementById('medium').src = './assets/img/mediumPriority.png';
    document.getElementById('low').src = './assets/img/lowPriority.png';
    document.getElementById('urgent').parentElement.classList.add('urgentPriority');
    document.getElementById("medium").parentElement.classList.remove('mediumPriority');
    document.getElementById('low').parentElement.classList.remove('lowPriority');
    prio = "urgent";
}

function changePrioToMedium() {
    document.getElementById("urgent").src = './assets/img/urgentPriority.png';
    document.getElementById("medium").src = './assets/img/activeMediumPriority.png';
    document.getElementById("low").src = './assets/img/lowPriority.png';
    document.getElementById("urgent").parentElement.classList.remove('urgentPriority');
    document.getElementById("medium").parentElement.classList.add('mediumPriority');
    document.getElementById("low").parentElement.classList.remove('lowPriority');
    prio = "medium";
}

function changePrioToLow() {
    document.getElementById("urgent").src = './assets/img/urgentPriority.png';
    document.getElementById("medium").src = './assets/img/MediumPriority.png';
    document.getElementById("low").src = './assets/img/activeLowPriority.png';
    document.getElementById("urgent").parentElement.classList.remove('urgentPriority');
    document.getElementById("medium").parentElement.classList.remove('mediumPriority');
    document.getElementById("low").parentElement.classList.add('lowPriority');
    prio = "low";
}

function showContacts(event) {
    if (event) {
        event.stopPropagation();
    }
    const addContactElement = document.getElementById('addContact');
    const isHidden = addContactElement.classList.contains('d-none');
    
    if (isHidden) {
        addContactSection();
        addContactElement.classList.remove('d-none');
        updateContactList();
    } else {
        removeContactFilter();
    }
}


function filterContact(i, search, name, contactSelect) {
    if (name.toLowerCase().includes(search)) {
        if (contactSelect) {
            loadSelectedContact(i, name);
        } else {
            loadUnSelectedContact(i, name);
        }
    }
}

function loadSelectedContact(i, name) {
    document.getElementById('addContact').innerHTML += `
    <div class="contact" id="contact${i}" onclick="addContactToTask(event, ${i})">${name}<img class="checkboxSelectedContact" src="./assets/img/checkboxDone.svg" alt=""></div>
    `;
    document.getElementById(`contact${i}`).classList.add('activContact');
}

function loadUnSelectedContact(i, name) {
    document.getElementById('addContact').innerHTML += `
    <div class="contact" id="contact${i}" onclick="addContactToTask(event, ${i})">${name}<img class="checkboxAddContact" src="./assets/img/checkboxToDo.png" alt=""></div>
    `;
    document.getElementById(`contact${i}`).classList.remove('activContact');
}

function addContactToTask(event, i) {
    event.stopPropagation(); // Stop the event from propagating to the document
    const contactSelect = allContacts[i]['contactSelect'];
    allContacts[i]['contactSelect'] = !contactSelect;
    updateContactList();
}

function updateContactList() {
    document.getElementById('addContact').innerHTML = '';
    let search = document.getElementById('assignContact').value;
    search = search.toLowerCase();
    let sortedContacts = [...allContacts].sort((a, b) => a.name.localeCompare(b.name)); // Kontakte sortieren
    for (let i = 0; i < sortedContacts.length; i++) {
        const contact = sortedContacts[i];
        let name = contact['name'];
        let contactSelect = contact['contactSelect'];
        filterContact(i, search, name, contactSelect);
    }
}

function addPersonToTask() {
    for (let i = 0; i < allContacts.length; i++) {
        if (allContacts[i]['contactSelect'] == true) {
            let name = allContacts[i]['name'];
            let color = allContacts[i]['color'] || 'blue';
            let contact = {
                'name': name,
                'color': color
            }
            authorityForTask.push(contact);
        }
    }
}

function addContactSection() {
    document.getElementById('contactSection').innerHTML = `
    <img onclick="showContacts(event)" class="taskIcon" src="./assets/img/extensionIcon.png" alt="">
    `;
    document.getElementById('addContact').classList.remove('d-none');
    document.getElementById('addContactIcon').innerHTML = '';
}

function removeAddContactSection() {
    for (let i = 0; i < allContacts.length; i++) {
        if (allContacts[i]['contactSelect'] == true) {
            let contact = allContacts[i];
            let color = contact['color'] || 'blue';
            const lastNameInitial = contact.name.split(' ')[1]?.charAt(0) || '';
            document.getElementById('addContactIcon').innerHTML += loadIconForContacts(contact, lastNameInitial, color);
        }
    }
    removeContactFilter();
}

function loadIconForContacts(contact, lastNameInitial, color) {
    return ` <div class="imageContainer" style="background-color: ${color};">
    <span class="initials1">${contact.name.charAt(0)}</span>
    <span class="initials2">${lastNameInitial}</span>
</div>
`;
}

function removeContactFilter() {
    document.getElementById('contactSection').innerHTML = `
    <img onclick="showContacts(event)" class="taskIcon" src="./assets/img/removeExtensionIcon.png" alt="">
    `;
    document.getElementById('addContact').classList.add('d-none');
    displaySelectedContacts();
}

function displaySelectedContacts() {
    document.getElementById('addContactIcon').innerHTML = ''; // Clear existing icons
    for (let i = 0; i < allContacts.length; i++) {
        if (allContacts[i]['contactSelect'] == true) {
            let contact = allContacts[i];
            let color = contact['color'] || 'blue';
            const lastNameInitial = contact.name.split(' ')[1]?.charAt(0) || '';
            document.getElementById('addContactIcon').innerHTML += loadIconForContacts(contact, lastNameInitial, color);
        }
    }
}

function closeContactListOnClickOutside(event) {
    const contactList = document.getElementById('addContact');
    const contactSection = document.getElementById('contactSection');

    if (contactList && !contactList.contains(event.target) && !contactSection.contains(event.target)) {
        removeContactFilter();
    }
}

async function showTempDivTask() {
    let tempDivTask = document.getElementById('tempDivTask');
    tempDivTask.classList.remove('hidden');

    tempDivTask.classList.add('show-temp');

    setTimeout(function () {
        tempDivTask.classList.remove('show-temp');
        tempDivTask.classList.add('hide-temp');

        setTimeout(function () {
            tempDivTask.classList.remove('hide-temp');
            tempDivTask.classList.add('hidden'); 
        }, 500);
    }, 1500);
}

async function initContactForaddTask() {
    const database = firebase.database();
    const snapshot = await database.ref('contacts').once('value');
    if (snapshot.exists()) {
        allContacts = snapshot.val();
        allContacts.sort((a, b) => a.name.localeCompare(b.name)); // Kontakte alphabetisch sortieren
    }
}
