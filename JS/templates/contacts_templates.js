
/**
 * Calculates initials from a name (first + last letter)
 * @param {string} name - The full name
 * @returns {string} Two-letter initials
 */
function calculateInitials(name) {
    if (!name || name.trim() === "") return "?";
    const parts = name.trim().split(/\s+/);
    const first = parts[0][0];
    const last = parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] || "";
    return (first + last).toUpperCase();
}

/**
 * Renders a contact entry for the contact list
 * @param {Object} contact - The contact object
 * @returns {string} HTML string for the contact entry
 */
function contactEntry(contact) {
    const color = (contact.colorIndex !== undefined && window.backgroundColorCodes)
        ? window.backgroundColorCodes[contact.colorIndex]
        : '#ccc';
    const initials = calculateInitials(contact.name);

    return `<div class="contactEntry"  data-mail="${contact.email}">
                <div class="contactlistIcon" style="background-color: ${color};">
                    ${initials}
                </div>
                <div class="contactDitails">
                    <div class="name">${contact.name}</div>
                    <div class="mail">${contact.email}</div>
                </div>
            </div>`
}

/**
 * Renders detailed view of a selected contact
 * @param {Object} contact - The contact object to display
 * @returns {string} HTML string for the contact details view
 */
function showContactDetails(contact) {
    const color = (contact.colorIndex !== undefined && window.backgroundColorCodes)
        ? window.backgroundColorCodes[contact.colorIndex]
        : '#ccc';
    const initials = calculateInitials(contact.name);

    return `<div class="selectedIconName">
                <div class="selectetIcon" style="background-color: ${color};">
                    ${initials}
                </div>
                <div class="selectedName">
                    ${contact.name}
                    <div class="selectedNameButtons">
                        <button id="editContactButton" data-mail="${contact.email}"><img src="./assets/img/contacts/edit.svg" alt="edit">Edit</button>
                        <button onclick="deleteContact('${contact.root}','${contact.id}')"><img src="./assets/img/contacts/trash.svg" alt="delite">Delete</button>
                    </div>
                </div>    
            </div>
            <div class="contactInfos">
                Contact Information
            </div>
            <table>
                <tr>
                    <th>Email</th>
                </tr>
                <tr>
                    <td class="mail">${contact.email}</td>
                </tr>
                <tr>
                    <th>Phone</th>
                </tr>
                <tr>
                    <td>${contact.phone}</td>
                </tr>
            </table>
            <div class="sideBarOption">
                <button onclick="mobileEditBar()"><img src="./assets/img/contacts/more_vert.svg" alt="mobile more option"></button>
            </div>
            <div id="mobileEditeBar">
                <button id="editContactButton" data-mail="${contact.email}"><img src="./assets/img/contacts/edit.svg" alt="">Edit</button>
                <button onclick="deleteContact('${contact.root}','${contact.id}')"><img src="./assets/img/contacts/trash.svg" alt="">Delete</button>
            </div>`
}

/**
 * Renders the edit contact dialog with pre-filled contact data
 * @param {Object} contact - The contact object to edit
 * @returns {string} HTML string for the edit contact dialog
 */
function editContact(contact) {
    const color = (contact.colorIndex !== undefined && window.backgroundColorCodes)
        ? window.backgroundColorCodes[contact.colorIndex]
        : '#ccc';
    const initials = calculateInitials(contact.name);
        
    return `<div>
                <div class="ACBetterTeam">
                    <img src="./assets/img/logo_light.svg" alt="">
                    <h2>Edit contact</h2>
                    <hr>
                </div>
                <div class="contactAdd">
                    <div class="ananymPerson" style="background-color: ${color};">
                        ${initials}
                    </div>
                    <div class="contactAddForm">
                        <button class="cancel" onclick="closeDialog()"><img src="./assets/img/contacts/delete.svg" alt="" srcset=""></button>
                        <div class="input-wrapper">
                            <div class="input-container">
                                <input type="text" id="contactUpdateName" name="contactName" value="${contact.name}">
                                <img class="inputIcon" src="./assets/img/contacts/person.svg" alt="" srcset="">
                            </div>
                            <span class="validation-message" id="nameValidationEdit">Please add a real name</span>
                        </div>
                        <div class="input-wrapper">
                            <div class="input-container">
                                <input type="email" id="contactUpdateMail" name="contactMail" value="${contact.email}">
                                <img class="inputIcon" src="./assets/img/contacts/mail.svg" alt="" srcset="">
                            </div>
                            <span class="validation-message" id="emailValidationEdit">Please enter a valid E-Mail address</span>
                        </div>
                        <div class="input-wrapper">
                            <div class="input-container">
                                <input type="tel" id="contactUpdatePhone" name="contactPhone" value="${contact.phone}">
                                <img class="inputIcon" src="./assets/img/contacts/call.svg" alt="" srcset="">
                            </div>
                            <span class="validation-message" id="phoneValidationEdit">Please enter a valid telefonnumber</span>
                        </div>
                        <div class="contactEditButtons">
                            <button class="contactEditDelete" onclick="deleteContact('${contact.root}','${contact.id}')"><span>Delete</span></button>
                            <button class="contactEditSave" onclick="updateContact('${contact.root}','${contact.id}')"><span>Save</span><img class="contactAddButtonsImg" src="./assets/img/contacts/check.svg" alt="" srcset=""></button>
                        </div>
                    </div>
                </div>
            </div>`
}
