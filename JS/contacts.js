import { db } from "./firebaseAuth.js";
import {
    ref,
    push,
    set,
    update,
    remove,
    get
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

const contactList = document.getElementById("contacList");
const contactDetails = document.getElementById("contactSelectet");
const contactSidebarCss = document.querySelector('.sideBar');
const contactDetailsCss = document.querySelector('.contacts');
const dialogAddPerson = document.getElementById("dialogAddPerson");
const dialogEdit = document.getElementById("dialogEdit");
const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\+?\d{1,4}[\s\-()]*(\d[\s\-()]*){6,14}$/;

window.addEventListener("load", () => {
    nameList();
});

// Fetch Contactlist and display them sorted by name with letter sections
async function nameList() {
    await window.fetchContacts();

    contacts.sort((a, b) => a.name.localeCompare(b.name, "de"));

    contactList.innerHTML = "";
    let currentLetter = "";

    contacts.forEach(contact => {
        const letter = contact.name[0].toUpperCase();
        if (letter !== currentLetter) {
            currentLetter = letter;
            contactList.innerHTML += letterSection(letter);
        }
        contactList.innerHTML += contactEntry(contact);
    });
}

// Show contact details on click
contactList.addEventListener("click", (event) => {
    const entry = event.target.closest(".contactEntry");
    if (!entry) return;

    const mail = entry.dataset.mail;
    const contact = contacts.find(c => c.email === mail);

    if (contact) {
        contactDetails.innerHTML = showContactDetails(contact);
        Detailsvisible();
    }
});

// Mobile view: show sidebar and hide details
function sideBarvisible() {
    contactSidebarCss.classList.remove('hidden');
    contactDetailsCss.classList.remove('visible');
}

// Mobile view: show details and hide sidebar
function Detailsvisible() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 1100) {
        contactSidebarCss.classList.add('hidden');
        contactDetailsCss.classList.add('visible');
    }
}

// Add Dialog open
function openDialogAdd() {
    dialogAddPerson.showModal();
}

// Edit Dialog open
function openDialogEdit() {
    dialogEdit.showModal();
}

// Close all Dialog
function closeDialog() {
    dialogAddPerson.close();
    clearForm();
    dialogEdit.close();
}

// Clear form inputs and remove invalid class
function clearForm() {
    const inputs = dialogAddPerson.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('invalid');
    });
    // Hide all validation messages
    const validationMessages = dialogAddPerson.querySelectorAll('.validation-message');
    validationMessages.forEach(msg => msg.classList.remove('show'));
}

// Backdrop click Add to close Dialogs
dialogAddPerson.addEventListener("click", (event) => {
    if (event.target === dialogAddPerson) {
        closeDialog();
    }
});

// Backdrop click Edite to close Dialogs
dialogEdit.addEventListener("click", (event) => {
    if (event.target === dialogEdit) {
        closeDialog();
    }
});

// Open edit dialog on edit button click
document.addEventListener("click", (event) => {
    const button = event.target.closest("#editContactButton");
    if (!button) return;

    const mail = button.dataset.mail;
    const contact = contacts.find(c => c.email === mail);

    if (contact) {
        dialogEdit.innerHTML = editContact(contact);
        dialogEdit.showModal();
    }
});

// Open mobile edit bar
contactDetails.addEventListener('click', (e) => {
    const bar = document.getElementById('mobileEditeBar');
    if (!bar) return;
    if (e.target.closest('.sideBarOption')) {
        bar.classList.add('visible');
    } else {
        bar.classList.remove('visible');
    }
});

// Input validation on blur and red border for invalid inputs
const validators = {
    text: value => value.trim() !== '',
    email: value => mailRegex.test(value),
    tel: value => phoneRegex.test(value),
};

const validationMessageIds = {
    contactAddName: 'nameValidation',
    contactAddMail: 'emailValidation',
    contactAddPhone: 'phoneValidation'
};

dialogAddPerson.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', () => {
        const validator = validators[input.type];
        if (!validator) return;
        const isValid = validator(input.value);
        input.classList.toggle('invalid', !isValid);

        // Show/hide validation message
        const messageId = validationMessageIds[input.id];
        if (messageId) {
            const message = document.getElementById(messageId);
            if (message) {
                message.classList.toggle('show', !isValid);
            }
        }
    });
});

// Check if form is valid before uploading contact
function isFormValid() {
    const inputs = dialogAddPerson.querySelectorAll('input');
    let allValid = true;

    // Validate all inputs and show error messages
    inputs.forEach(input => {
        const isValid = validateInput(input);
        if (!isValid) {
            allValid = false;
        }
    });

    if (!allValid) {
        return;
    }
    uploadContact();
}

function validateInput(input) {
    const validator = validators[input.type];
    if (!validator) return true;
    const isValid = validator(input.value);
    input.classList.toggle('invalid', !isValid);

    // Show/hide validation message
    const messageId = validationMessageIds[input.id];
    if (messageId) {
        const message = document.getElementById(messageId);
        if (message) {
            message.classList.toggle('show', !isValid);
        }
    }

    return isValid;
}

// Upload new contact to database
async function uploadContact() {
    const name = document.getElementById("contactAddName");
    const email = document.getElementById("contactAddMail");
    const phone = document.getElementById("contactAddPhone");
    let NewContact = createContactObject(name, email, phone);

    try {
        const newContactRef = push(ref(db, "contact"));
        await set(newContactRef, NewContact);
        closeDialog();
        await nameList();
    } catch (error) {
        // Silent error handling
    }
}

function createContactObject(nameInput, emailInput, phoneInput) {
    return {
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        createdAt: new Date().toISOString()
    };
}

// Update contact to database
async function updateContact(root, id) {
    const name = document.getElementById("contactUpdateName");
    const email = document.getElementById("contactUpdateMail");
    const phone = document.getElementById("contactUpdatePhone");
    let UpdateContact = createContactObject(name, email, phone);

    try {
        const contactRef = ref(db, `${root}/${id}`);
        await update(contactRef, UpdateContact);

        closeDialog();
        await nameList();

        const updatedContact = contacts.find(c => c.id === id);
        if (updatedContact) {
            contactDetails.innerHTML = showContactDetails(updatedContact);
        }
    } catch (error) {
        // Silent error handling
    }
}

// Delete contact from database
async function deleteContact(root, id) {
    try {
        await removeContactFromTasks(id);
        const contactRef = ref(db, `${root}/${id}`);
        await remove(contactRef);

        contactDetails.innerHTML = "";
        sideBarvisible();
        await nameList();
    } catch (error) {
        // Silent error handling
    }
}

async function removeContactFromTasks(contactId) {
    const tasksRef = ref(db, "tasks");
    const snapshot = await get(tasksRef);

    if (snapshot.exists()) {
        const tasks = snapshot.val();
        await updateAllTasksRemoveContact(tasks, contactId);
    }
}

async function updateAllTasksRemoveContact(tasks, contactId) {
    for (let taskId in tasks) {
        await removeContactFromSingleTask(tasks[taskId], taskId, contactId);
    }
}

async function removeContactFromSingleTask(task, taskId, contactId) {
    if (task.assignedPersons) {
        const originalLength = task.assignedPersons.length;
        task.assignedPersons = task.assignedPersons.filter(p => p.id !== contactId);

        if (task.assignedPersons.length !== originalLength) {
            const taskRef = ref(db, `tasks/${taskId}`);
            await update(taskRef, { assignedPersons: task.assignedPersons });
        }
    }
}

// Render letter section and contact entry
function letterSection(letter) {
    return `<div class="sectionList">${letter}</div><hr>`
}

function contactEntry(contact) {
    const color = (contact.colorIndex !== undefined && window.backgroundColorCodes)
        ? window.backgroundColorCodes[contact.colorIndex]
        : '#ccc';

    return `<div class="contactEntry"  data-mail="${contact.email}">
                <div class="contactlistIcon" style="background-color: ${color};">
                    ${contact.initials}
                </div>
                <div class="contactDitails">
                    <div class="name">${contact.name}</div>
                    <div class="mail">${contact.email}</div>
                </div>
            </div>`
}

// Render contact details
function showContactDetails(contact) {
    const color = (contact.colorIndex !== undefined && window.backgroundColorCodes)
        ? window.backgroundColorCodes[contact.colorIndex]
        : '#ccc';

    return `<div class="selectedIconName">
                <div class="selectetIcon" style="background-color: ${color};">
                    ${contact.initials}
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

// Render edit contact dialog
function editContact(contact) {
    return `<div>
                <div class="ACBetterTeam">
                    <img src="./assets/img/logo_light.svg" alt="">
                    <h2>Edit contact</h2>
                    <hr>
                </div>
                <div class="contactAdd">
                    <div class="ananymPerson">
                        <img src="./assets/img/contacts/person_white.svg" alt="">
                    </div>
                    <div class="contactAddForm">
                        <button class="cancel" onclick="closeDialog()"><img src="./assets/img/contacts/delete.svg" alt="" srcset=""></button>
                        <div>
                            <input type="text" id="contactUpdateName" name="contactName" value="${contact.name}">
                            <img class="inputIcon" src="./assets/img/contacts/person.svg" alt="" srcset="">
                        </div>
                        <div>
                            <input type="email" id="contactUpdateMail" name="contactMail" value="${contact.email}">
                            <img class="inputIcon" src="./assets/img/contacts/mail.svg" alt="" srcset="">
                        </div>
                        <div>
                            <input type="phone" id="contactUpdatePhone" name="contactPhone" value="${contact.phone}">
                            <img class="inputIcon" src="./assets/img/contacts/call.svg" alt="" srcset="">
                        </div>
                        <div class="contactEditButtons">
                            <button class="contactEditDelete" onclick="deleteContact('${contact.root}','${contact.id}')"><span>Delete</span></button>
                            <button class="contactEditSave" onclick="updateContact('${contact.root}','${contact.id}')"><span>Save</span><img class="contactAddButtonsImg" src="./assets/img/contacts/check.svg" alt="" srcset=""></button>
                        </div>
                    </div>
                </div>
            </div>`
}

function mobileEditBar() {
    const bar = document.getElementById('mobileEditeBar');
    if (bar) bar.classList.add('visible');
}

window.openDialogAdd = openDialogAdd;
window.openDialogEdit = openDialogEdit;
window.closeDialog = closeDialog;
window.isFormValid = isFormValid;
window.uploadContact = uploadContact;
window.updateContact = updateContact;
window.deleteContact = deleteContact;
window.sideBarvisible = sideBarvisible;
window.mobileEditBar = mobileEditBar;
window.nameList = nameList;            