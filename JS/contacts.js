// Keine imports - db ist global durch firebase_auth.js

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

/**
 * Fetches contact list and displays them sorted by name with letter sections
 * Filters out contacts without valid names
 * @async
 * @returns {Promise<void>}
 */
async function nameList() {
    await window.fetchContacts();

    // Filter out contacts without a name
    const validContacts = contacts.filter(contact => contact.name && contact.name.trim() !== "");

    validContacts.sort((a, b) => a.name.localeCompare(b.name, "de"));

    contactList.innerHTML = "";
    let currentLetter = "";

    validContacts.forEach(contact => {
        const letter = contact.name[0].toUpperCase();
        if (letter !== currentLetter) {
            currentLetter = letter;
            contactList.innerHTML += letterSection(letter);
        }
        contactList.innerHTML += contactEntry(contact);
    });
}

/**
 * Event listener to show contact details when a contact is clicked
 */
contactList.addEventListener("click", (event) => {
    const entry = event.target.closest(".contactEntry");
    if (!entry) return;

    const mail = entry.dataset.mail;
    const contact = contacts.find(c => c.email === mail);

    if (contact) {
        setActiveContact(mail);
        contactDetails.innerHTML = showContactDetails(contact);
        Detailsvisible();
    }
});

/**
 * Sets the active state for a contact entry by email
 * Removes active class from all entries and adds it to the selected one
 * @param {string} email - The email of the contact to set as active
 * @returns {void}
 */
function setActiveContact(email) {
    // Remove active class from all entries
    const allEntries = document.querySelectorAll('.contactEntry');
    allEntries.forEach(entry => entry.classList.remove('active'));
    
    // Add active class to clicked entry
    const activeEntry = document.querySelector(`.contactEntry[data-mail="${email}"]`);
    if (activeEntry) {
        activeEntry.classList.add('active');
    }
}

/**
 * Mobile view: shows sidebar and hides contact details
 * @returns {void}
 */
function sideBarvisible() {
    contactSidebarCss.classList.remove('hidden');
    contactDetailsCss.classList.remove('visible');
}

/**
 * Mobile view: shows contact details and hides sidebar for screens <= 1100px
 * @returns {void}
 */
function Detailsvisible() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 1100) {
        contactSidebarCss.classList.add('hidden');
        contactDetailsCss.classList.add('visible');
    }
}

/**
 * Opens the add person dialog
 * @returns {void}
 */
function openDialogAdd() {
    dialogAddPerson.showModal();
}

/**
 * Opens the edit contact dialog
 * @returns {void}
 */
function openDialogEdit() {
    dialogEdit.showModal();
}

/**
 * Closes all dialog windows and clears the add person form
 * @returns {void}
 */
function closeDialog() {
    dialogAddPerson.close();
    clearForm();
    dialogEdit.close();
}

/**
 * Clears all form inputs and removes validation states
 * Hides all validation messages
 * @returns {void}
 */
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

/**
 * Event listener to close add person dialog when clicking the backdrop
 */
dialogAddPerson.addEventListener("click", (event) => {
    if (event.target === dialogAddPerson) {
        closeDialog();
    }
});

/**
 * Event listener to close edit dialog when clicking the backdrop
 */
dialogEdit.addEventListener("click", (event) => {
    if (event.target === dialogEdit) {
        closeDialog();
    }
});

/**
 * Event listener to open edit dialog when edit button is clicked
 * Finds the contact by email and populates the edit form
 */
document.addEventListener("click", (event) => {
    const button = event.target.closest("#editContactButton");
    if (!button) return;

    const mail = button.dataset.mail;
    const contact = contacts.find(c => c.email === mail);

    if (contact) {
        dialogEdit.innerHTML = editContact(contact);
        dialogEdit.showModal();
        attachEditValidation();
    }
});

/**
 * Event listener to toggle mobile edit bar visibility
 * Shows bar when clicking sidebar option, hides it otherwise
 */
contactDetails.addEventListener('click', (e) => {
    const bar = document.getElementById('mobileEditeBar');
    if (!bar) return;
    if (e.target.closest('.sideBarOption')) {
        bar.classList.add('visible');
    } else {
        bar.classList.remove('visible');
    }
});

/**
 * Input validation functions for different field types
 * @type {Object.<string, function(string): boolean>}
 */
const validators = {
    text: value => value.trim() !== '',
    email: value => mailRegex.test(value),
    tel: value => phoneRegex.test(value),
};

/**
 * Maps input field IDs to their corresponding validation message element IDs
 * @type {Object.<string, string>}
 */
const validationMessageIds = {
    contactAddName: 'nameValidation',
    contactAddMail: 'emailValidation',
    contactAddPhone: 'phoneValidation',
    contactUpdateName: 'nameValidationEdit',
    contactUpdateMail: 'emailValidationEdit',
    contactUpdatePhone: 'phoneValidationEdit'
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

/**
 * Attaches validation event listeners to edit dialog input fields
 * Should be called when the edit dialog is opened
 * @returns {void}
 */
function attachEditValidation() {
    dialogEdit.querySelectorAll('input').forEach(input => {
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
}

/**
 * Checks if the add contact form is valid before uploading
 * Validates all inputs and displays error messages if needed
 * @returns {void}
 */
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

/**
 * Validates a single input field and shows/hides validation messages
 * @param {HTMLInputElement} input - The input element to validate
 * @returns {boolean} True if input is valid, false otherwise
 */
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

/**
 * Uploads a new contact to the Firebase database
 * Shows success message and refreshes the contact list
 * @async
 * @returns {Promise<void>}
 */
async function uploadContact() {
    const name = document.getElementById("contactAddName");
    const email = document.getElementById("contactAddMail");
    const phone = document.getElementById("contactAddPhone");
    
    // Save email value before closing dialog
    const emailValue = email.value;
    
    let NewContact = createContactObject(name, email, phone);

    try {
        const newContactRef = db.ref("contact").push();
        await newContactRef.set(NewContact);
        closeDialog();
        await nameList();
        
        // Find and display the newly created contact using saved email value
        const createdContact = contacts.find(c => c.email === emailValue);
        
        if (createdContact) {
            setActiveContact(createdContact.email);
            contactDetails.innerHTML = showContactDetails(createdContact);
            Detailsvisible();
        }
        
        showContactMessage("Contact successfully created");
    } catch (error) {
        // Silent error handling
    }
}

/**
 * Creates a contact object from form input values
 * @param {HTMLInputElement} nameInput - Name input element
 * @param {HTMLInputElement} emailInput - Email input element
 * @param {HTMLInputElement} phoneInput - Phone input element
 * @returns {Object} Contact object with name, email, phone, and createdAt timestamp
 */
function createContactObject(nameInput, emailInput, phoneInput) {
    return {
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        createdAt: new Date().toISOString()
    };
}

/**
 * Updates an existing contact in the Firebase database
 * Validates all inputs before updating and shows success message
 * @async
 * @param {string} root - The root path ('users' or 'contact')
 * @param {string} id - The contact ID to update
 * @returns {Promise<void>}
 */
async function updateContact(root, id) {
    const name = document.getElementById("contactUpdateName");
    const email = document.getElementById("contactUpdateMail");
    const phone = document.getElementById("contactUpdatePhone");
    
    // Validate all inputs before updating
    const inputs = [name, email, phone];
    let allValid = true;
    
    inputs.forEach(input => {
        const isValid = validateInput(input);
        if (!isValid) {
            allValid = false;
        }
    });
    
    if (!allValid) {
        return;
    }
    
    let UpdateContact = createContactObject(name, email, phone);

    try {
        const contactRef = db.ref(`${root}/${id}`);
        await contactRef.update(UpdateContact);

        closeDialog();
        await nameList();

        const updatedContact = contacts.find(c => c.id === id);
        if (updatedContact) {
            setActiveContact(updatedContact.email);
            contactDetails.innerHTML = showContactDetails(updatedContact);
        }
        showContactMessage("Contact successfully updated");
    } catch (error) {
        // Silent error handling
    }
}

/**
 * Deletes a contact from the Firebase database
 * Removes contact from all tasks and refreshes the contact list
 * @async
 * @param {string} root - The root path ('users' or 'contact')
 * @param {string} id - The contact ID to delete
 * @returns {Promise<void>}
 */
async function deleteContact(root, id) {
    try {
        await removeContactFromTasks(id);
        const contactRef = db.ref(`${root}/${id}`);
        await contactRef.remove();

        contactDetails.innerHTML = "";
        sideBarvisible();
        await nameList();
    } catch (error) {
        // Silent error handling
    }
}

/**
 * Removes a contact from all tasks they are assigned to
 * @async
 * @param {string} contactId - The ID of the contact to remove from tasks
 * @returns {Promise<void>}
 */
async function removeContactFromTasks(contactId) {
    const tasksRef = db.ref("tasks");
    const snapshot = await tasksRef.get();

    if (snapshot.exists()) {
        const tasks = snapshot.val();
        await updateAllTasksRemoveContact(tasks, contactId);
    }
}

/**
 * Iterates through all tasks and removes the contact from each
 * @async
 * @param {Object} tasks - Object containing all tasks
 * @param {string} contactId - The ID of the contact to remove
 * @returns {Promise<void>}
 */
async function updateAllTasksRemoveContact(tasks, contactId) {
    for (let taskId in tasks) {
        await removeContactFromSingleTask(tasks[taskId], taskId, contactId);
    }
}

/**
 * Removes a contact from a single task's assigned persons
 * Updates the task in Firebase if the contact was removed
 * @async
 * @param {Object} task - The task object
 * @param {string} taskId - The task ID
 * @param {string} contactId - The ID of the contact to remove
 * @returns {Promise<void>}
 */
async function removeContactFromSingleTask(task, taskId, contactId) {
    if (task.assignedPersons) {
        const originalLength = task.assignedPersons.length;
        task.assignedPersons = task.assignedPersons.filter(p => p.id !== contactId);

        if (task.assignedPersons.length !== originalLength) {
            const taskRef = db.ref(`tasks/${taskId}`);
            await taskRef.update({ assignedPersons: task.assignedPersons });
        }
    }
}

/**
 * Renders a letter section divider for the contact list
 * @param {string} letter - The letter to display
 * @returns {string} HTML string for the letter section
 */
function letterSection(letter) {
    return `<div class="sectionList">${letter}</div><hr>`
}


/**
 * Makes the mobile edit bar visible
 * @returns {void}
 */
function mobileEditBar() {
    const bar = document.getElementById('mobileEditeBar');
    if (bar) bar.classList.add('visible');
}

/**
 * Shows a success message with animation
 * Message automatically hides after 2 seconds
 * @param {string} text - The message text to display
 * @returns {void}
 */
function showContactMessage(text) {
    const message = document.getElementById('contact-message');
    if (!message) return;
    
    // Update text
    message.querySelector('p').textContent = text;
    
    // Show message with slide-in animation
    message.classList.add('show');
    
    // Hide message after 2 seconds with slide-out animation
    setTimeout(() => {
        message.classList.remove('show');
    }, 2000);
}

// Alle Funktionen sind automatisch global - kein window.x = x mehr nötig!