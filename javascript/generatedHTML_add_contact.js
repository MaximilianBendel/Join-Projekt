/**
 * An array of predefined colors.
 * @type {string[]}
 */

const colors = ['#FF6F61', '#6B8E23', '#4682B4', '#DA70D6', '#FF6347', '#40E0D0', '#FFD700', '#FFA07A', '#7FFFD4', '#BA55D3', '#6495ED', '#8A2BE2', '#FF4500', '#00CED1', '#B0E0E6', '#8B008B', '#20B2AA', '#9932CC', '#FF1493', '#00FF7F', '#FF7F50', '#4682B4', '#9370DB', '#D2691E', '#32CD32', '#8B4513', '#00FFFF', '#8FBC8F', '#FF69B4', '#00BFFF', '#FFA500', '#006400', '#8B008B', '#2E8B57', '#B22222', '#00FA9A'];

/**
 * Returns a random color from the predefined list of colors.
 * @returns {string} A random color from the `colors` array.
 */
function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

/**
 * Generates the HTML content for a contact card.
 * @param {Object} contact - The contact object.
 * @param {number} index - The index of the contact in the contact list.
 * @param {string} randomColor - The random color assigned to the contact.
 * @returns {string} The HTML string for the contact card.
 */
function generateContactHTML(contact, index, randomColor) {
    const lastNameInitial = contact.name.split(' ')[1]?.charAt(0) || '';

    return `
        <div id="contact${index}" onclick="populateEditDisplay(allContacts[${index}], ${index})" class="contact_card">
            <div class="image_container" style="background-color: ${randomColor};">
                <div class="initials">
                    <span class="initials1">${contact.name.charAt(0)}</span>
                    <span class="initials2">${lastNameInitial}</span>
                </div>
            </div>
            <div class="contact_info">
                <h1>${contact.name}</h1>
                <a href="mailto:${contact.email}">${contact.email}</a>
            </div>
        </div>
    `;
}

/**
 * Creates the content for a contact card.
 * @param {Object} contact - The contact object.
 * @returns {string} The HTML string for the content of the contact card.
 */
function createContactCardContent(contact) {
    return `
        <div class="image_container">
            <img src="./assets/img/contacts_img/Ellipse 5.svg" alt="">
        </div>
        <div class="contact_card_text">
            <h3>${contact.name}</h3>
            <a href="mailto:${contact.email}">${contact.email}</a>
        </div>`;
}

/**
 * Generates the initials for a contact's name.
 * @param {string} firstNameInitial - The initial of the contact's first name.
 * @param {string} lastNameInitial - The initial of the contact's last name.
 * @returns {string} The HTML string for the initials.
 */
function generateInitials(firstNameInitial, lastNameInitial) {
    return `
        <div class="initials_edit">
            <span class="initials3">${firstNameInitial}</span>
            <span class="initials4">${lastNameInitial}</span>
        </div>
    `;
}