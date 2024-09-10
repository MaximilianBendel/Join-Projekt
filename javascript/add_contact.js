let lastSelectedContactIndex = null;
let currentEditIndex = -1;

function saveContactsToFirebase() {
    database.ref('contacts').set(allContacts);
}

function loadContactsFromFirebase() {
    database.ref('contacts').once('value').then((snapshot) => {
        if (snapshot.exists()) {
            allContacts = snapshot.val();
        } else {
            saveContactsToFirebase();
        }
        renderContacts();
    });
}

function initContactForaddTask() {
    loadContactsFromFirebase((contacts) => {
        allContacts = contacts;
    });
}

function deleteContactFromFirebase(currentEditIndex) {
    allContacts.splice(currentEditIndex, 1);
    saveContactsToFirebase();
    renderContacts();
    hideElement('editContactDisplay');
    resetSelectedIndexes();
}

async function init() {
    await loadContactsFromFirebase();
    await includeHTML();
    loadActiveUserInitials();
    loadActiveLinkContactPage();
}

function loadActiveLinkContactPage() {
    document.getElementById('summarySite').classList.remove('active-link');
    document.getElementById('addTaskSite').classList.remove('active-link');
    document.getElementById('boardSite').classList.remove('active-link');
    document.getElementById('contactSite').classList.add('active-link');
}

function addContact() {
    let name = document.getElementById('add_contact_name').value;
    let email = document.getElementById('add_contact_email').value;
    let phone = document.getElementById('add_contact_phone').value;
    let contact = createContact(name, email, phone, getRandomColor());

    addContactToArray(contact);
    saveContactsToFirebase();
    renderContacts();

    // Check screen width and only populate edit display if width is less than 620px
    if (window.innerWidth > 620) {
        let newContactIndex = allContacts.length - 1;
        populateEditDisplay(contact, newContactIndex);
    }

    showTempDivContact(); // Call this function to show the temporary div
    hideElement('slidingPage');

    document.getElementById('add_contact_name').value = '';
    document.getElementById('add_contact_email').value = '';
    document.getElementById('add_contact_phone').value = '';
}


function resetSelectedIndexes() {
    lastSelectedContactIndex = null;
    currentEditIndex = -1;
}

function createContact(name, email, phone, color) {
    return {
        name: name,
        email: email,
        phone: phone,
        createdAt: new Date().getTime(),
        contactSelect: false,
        color: color
    };
}

function addContactToArray(contact) {
    allContacts.push(contact);
}

function renderContacts() {
    clearContactsContainers();
    const contactsByLetter = {};

    // Sort contacts by their name
    allContacts.sort((a, b) => a.name.localeCompare(b.name));

    // Group contacts by their starting letter
    allContacts.forEach((contact, index) => {
        let initial = contact.name.charAt(0).toUpperCase();
        if (!contactsByLetter[initial]) {
            contactsByLetter[initial] = [];
        }
        contactsByLetter[initial].push({ contact, index });
    });

    // Render contacts by their starting letter
    for (let letter in contactsByLetter) {
        if (contactsByLetter.hasOwnProperty(letter)) {
            let containerId = 'contacts_container_' + letter;
            renderLetterSection(letter, containerId);

            contactsByLetter[letter].forEach(({ contact, index }) => {
                insertContactIntoContainer(containerId, contact, index);
            });
        }
    }
}

function renderLetterSection(letter, containerId) {
    let contactsList = document.querySelector('.contacts_list');
    if (contactsList) {
        let letterSection = `
            <div class="alphabetical_order">
                <h1>${letter}</h1>
            </div>
            <div class="seperator_order_contacts"></div>
            <div class="contact_single" id="${containerId}"></div>
        `;
        contactsList.innerHTML += letterSection;
    }
}

function clearContactsContainers() {
    const contactsList = document.querySelector('.contacts_list');
    if (contactsList) {
        const elements = contactsList.querySelectorAll('.alphabetical_order, .seperator_order_contacts, .contact_single');
        elements.forEach(element => element.remove());
    }
}

function insertContactIntoContainer(containerId, contact, index) {
    let container = document.getElementById(containerId);
    if (container) {
        let contactHTML = generateContactHTML(contact, index, contact.color);
        contactHTML = contactHTML.replace('<div', `<div onclick="handleContactClick(${index})"`);
        container.innerHTML += contactHTML;
    }
}

function generateContactHTML(contact, index, color) {
    return `
        <div class="contact_card" id="contact${index}">
            <div class="image_container" style="background-color:${color}">
                <div class="initials">${contact.name.charAt(0)}</div>
            </div>
            <div class="contact_info">
                <h1>${contact.name}</h1>
                <p>${contact.email}</p>
                <p>${contact.phone}</p>
            </div>
        </div>
    `;
}

function showEditForm() {
    document.getElementById('editContactForm').classList.remove('hidden');
}

function showEditDisplay() {
    document.getElementById('editContactDisplay').classList.remove('hidden');
}

function toggleContactSelection(index) {
    if (lastSelectedContactIndex !== null && lastSelectedContactIndex !== index) {
        document.getElementById('contact' + lastSelectedContactIndex).classList.remove('selected');
    }
    document.getElementById('contact' + index).classList.toggle('selected');
}

function hideEditDisplay() {
    let editContactDisplay = document.getElementById('editContactDisplay');
    editContactDisplay.classList.add('hidden');
    resetSelectedIndexes();
}

function setColorfulDivBackgroundColor(index) {
    let contactCard = document.getElementById(`contact${index}`);
    let randomColor = contactCard.querySelector('.image_container').style.backgroundColor;
    let contactName = allContacts[index].name;
    let firstNameInitial = contactName.charAt(0);
    let lastNameInitial = contactName.split(' ')[1]?.charAt(0) || '';

    let colorfulDiv = document.getElementById('colorfulDiv');
    colorfulDiv.style.backgroundColor = randomColor;

    colorfulDiv.innerHTML = generateInitials(firstNameInitial, lastNameInitial);
}

function updateEditDisplay(contact) {
    document.getElementById('edit_contact_name').textContent = contact.name;
    document.getElementById('edit_contact_email').textContent = contact.email;
    document.getElementById('edit_contact_phone').textContent = contact.phone;
    document.getElementById('edit_contact_email').setAttribute('href', 'mailto:' + contact.email);
    document.getElementById('edit_contact_name_input').value = contact.name;
    document.getElementById('edit_contact_email_input').value = contact.email;
    document.getElementById('edit_contact_phone_input').value = contact.phone;
}

function populateEditDisplay(contact, index) {
    toggleContactSelection(index);
    if (lastSelectedContactIndex === index) {
        hideEditDisplay();
    } else {
        updateEditDisplay(contact);
        if (window.innerWidth > 620) {
            showEditDisplay();
        } else {
            document.querySelector('#editContactDisplay').classList.remove('hidden');
        }
        lastSelectedContactIndex = index;
        currentEditIndex = index;
        setColorfulDivBackgroundColor(index);
    }
}

function createContactCard(contact, index) {
    let contactCard = document.createElement('div');
    contactCard.classList.add('contact_card');
    contactCard.setAttribute('id', 'contact' + index);
    contactCard.onclick = function () {
        populateEditDisplay(contact, index);
    };
    contactCard.innerHTML = createContactCardContent(contact);
    return contactCard;
}

function saveEditedContact() {
    let name = document.getElementById('edit_contact_name_input').value;
    let email = document.getElementById('edit_contact_email_input').value;
    let phone = document.getElementById('edit_contact_phone_input').value;

    if (currentEditIndex >= 0) {
        updateContactAndRender(name, email, phone);
    }
}

function updateContactAndRender(name, email, phone) {
    allContacts[currentEditIndex]['name'] = name;
    allContacts[currentEditIndex]['email'] = email;
    allContacts[currentEditIndex]['phone'] = phone;

    saveContactsToFirebase();
    renderContacts();
    document.getElementById('editContactForm').classList.add('hidden');
}

function hideEditing() {
    document.getElementById('editContactForm').classList.add('hidden');
}

function showTempDivContact() {
    let tempDivContact = document.getElementById('tempDivContact');
    tempDivContact.classList.remove('hidden');

    tempDivContact.classList.add('show-temp');

    setTimeout(function () {
        tempDivContact.classList.remove('show-temp');
        tempDivContact.classList.add('hide-temp');

        setTimeout(function () {
            tempDivContact.classList.remove('hide-temp');
            tempDivContact.classList.add('hidden'); 
        }, 500);
    }, 1500);
}

function handleContactClick(index) {
    let contact = allContacts[index];
    populateEditDisplay(contact, index);

    if (window.innerWidth <= 620) {
        document.querySelector('.contacts_list').style.display = 'none';
        document.querySelector('#editContactDisplay').classList.remove('hidden');
        document.querySelector('#slogan').classList.add('showSlogan');
        document.querySelector('#arrow').classList.add('show');
    }
}

function hideContactDetails() {
    if (window.innerWidth <= 620) {
        document.querySelector('.contacts_list').style.display = 'block';
        document.querySelector('#editContactDisplay').classList.add('hidden');
        document.querySelector('#slogan').classList.remove('showSlogan');
        document.querySelector('#arrow').classList.remove('show');
    }
}

window.onload = function() {
    init();
};

function toggleMenu(event) {
    event.stopPropagation();
    const menuContainer = document.getElementById('menuContainer');

    // Toggle visibility
    if (menuContainer.classList.contains('hidden')) {
        menuContainer.classList.remove('hidden');
    } else {
        menuContainer.classList.add('hidden');
    }

    // Add event listener to close menu when clicking outside
    document.addEventListener('click', closeMenuOnClickOutside);
}

function closeMenuOnClickOutside(event) {
    const menuContainer = document.getElementById('menuContainer');
    if (!menuContainer.contains(event.target) && !event.target.matches('#menueditcontact')) {
        menuContainer.classList.add('hidden');
        document.removeEventListener('click', closeMenuOnClickOutside);
    }
}

function deleteContactResponsive(currentEditIndex) {
    let position = currentEditIndex;
    allContacts.splice(position, 1);

    saveContactsToFirebase();
    renderContacts();
    hideElement('editContactDisplay');
    resetSelectedIndexes();
    hideContactDetails();
}

// New functions added
function showElement(elementId) {
    let element = document.getElementById(elementId);
    element.classList.remove('hidden');
    element.classList.add('show');
}

function hideElement(elementId) {
    let element = document.getElementById(elementId);
    element.classList.remove('show');
    element.classList.add('hidden');
}
