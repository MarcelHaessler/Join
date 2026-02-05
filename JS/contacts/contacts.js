const contactList = document.getElementById("contacList");
const contactDetails = document.getElementById("contactSelectet");
const contactSidebarCss = document.querySelector('.sideBar');
const contactDetailsCss = document.querySelector('.contacts');
const dialogAddPerson = document.getElementById("dialogAddPerson");
const dialogEdit = document.getElementById("dialogEdit");
const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\+?\d{1,4}[\s\-()]*(\d[\s\-()]*){6,14}$/;

/**
 * Initializes contact list load event listener
 * @returns {void}
 */
function initContactLoadListener() {
    window.addEventListener("load", () => {
        nameList();
    });
}

initContactLoadListener();

/**
 * Fetches contact list and displays them sorted by name with letter sections
 * Filters out contacts without valid names
 * @async
 * @returns {Promise<void>}
 */
async function nameList() {
    await window.fetchContacts();
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
 * Handles contact entry click events
 * Displays selected contact details
 * @param {Event} event - The click event
 * @returns {void}
 */
function handleContactClick(event) {
    const entry = event.target.closest(".contactEntry");
    if (!entry) return;
    const mail = entry.dataset.mail;
    const contact = contacts.find(c => c.email === mail);
    if (contact) {
        setActiveContact(mail);
        contactDetails.innerHTML = showContactDetails(contact);
        Detailsvisible();
    }
}

/**
 * Initializes contact list click listener
 * @returns {void}
 */
function initContactListClickListener() {
    contactList.addEventListener("click", handleContactClick);
}

initContactListClickListener();

/**
 * Sets the active state for a contact entry by email
 * Removes active class from all entries and adds it to the selected one
 * @param {string} email - The email of the contact to set as active
 * @returns {void}
 */
function setActiveContact(email) {
    const allEntries = document.querySelectorAll('.contactEntry');
    allEntries.forEach(entry => entry.classList.remove('active'));
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
    const validationMessages = dialogAddPerson.querySelectorAll('.validation-message');
    validationMessages.forEach(msg => msg.classList.remove('show'));
}

/**
 * Handles add dialog backdrop click events
 * Closes dialog when backdrop is clicked
 * @param {Event} event - The click event
 * @returns {void}
 */
function handleAddDialogBackdropClick(event) {
    if (event.target === dialogAddPerson) {
        closeDialog();
    }
}

/**
 * Handles edit dialog backdrop click events
 * Closes dialog when backdrop is clicked
 * @param {Event} event - The click event
 * @returns {void}
 */
function handleEditDialogBackdropClick(event) {
    if (event.target === dialogEdit) {
        closeDialog();
    }
}

/**
 * Initializes dialog backdrop click listeners
 * @returns {void}
 */
function initDialogBackdropListeners() {
    dialogAddPerson.addEventListener("click", handleAddDialogBackdropClick);
    dialogEdit.addEventListener("click", handleEditDialogBackdropClick);
}

initDialogBackdropListeners();

/**
 * Handles edit button click events
 * Opens edit dialog with contact data
 * @param {Event} event - The click event
 * @returns {void}
 */
function handleEditButtonClick(event) {
    const button = event.target.closest("#editContactButton");
    if (!button) return;
    const mail = button.dataset.mail;
    const contact = contacts.find(c => c.email === mail);
    if (contact) {
        dialogEdit.innerHTML = editContact(contact);
        dialogEdit.showModal();
        attachEditValidation();
    }
}

/**
 * Initializes edit button click listener
 * @returns {void}
 */
function initEditButtonListener() {
    document.addEventListener("click", handleEditButtonClick);
}

initEditButtonListener();

/**
 * Handles mobile edit bar toggle events
 * Shows/hides bar based on click target
 * @param {Event} e - The click event
 * @returns {void}
 */
function handleMobileEditBarToggle(e) {
    const bar = document.getElementById('mobileEditeBar');
    if (!bar) return;
    if (e.target.closest('.sideBarOption')) {
        bar.classList.add('visible');
    } else {
        bar.classList.remove('visible');
    }
}

/**
 * Initializes mobile edit bar click listener
 * @returns {void}
 */
function initMobileEditBarListener() {
    contactDetails.addEventListener('click', handleMobileEditBarToggle);
}

initMobileEditBarListener();

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

/**
 * Validates input on blur event
 * @param {HTMLInputElement} input - The input element
 * @returns {void}
 */
function handleInputBlurValidation(input) {
    const validator = validators[input.type];
    if (!validator) return;
    const isValid = validator(input.value);
    input.classList.toggle('invalid', !isValid);
    const messageId = validationMessageIds[input.id];
    if (messageId) {
        const message = document.getElementById(messageId);
        if (message) message.classList.toggle('show', !isValid);
    }
}

/**
 * Initializes input validation listeners for add dialog
 * @returns {void}
 */
function initAddDialogValidation() {
    dialogAddPerson.querySelectorAll('input').forEach(input => {
        input.addEventListener('blur', () => handleInputBlurValidation(input));
    });
}

initAddDialogValidation();

/**
 * Attaches validation event listeners to edit dialog input fields
 * Should be called when the edit dialog is opened
 * @returns {void}
 */
function attachEditValidation() {
    dialogEdit.querySelectorAll('input').forEach(input => {
        input.addEventListener('blur', () => handleInputBlurValidation(input));
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
    inputs.forEach(input => {
        const isValid = validateInput(input);
        if (!isValid) {
            allValid = false;
        }
    });
    if (!allValid) {return;}
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
 * Shows created contact details after successful upload
 * @param {string} emailValue - The email of the created contact
 * @returns {void}
 */
function showCreatedContact(emailValue) {
    const createdContact = contacts.find(c => c.email === emailValue);
    if (createdContact) {
        setActiveContact(createdContact.email);
        contactDetails.innerHTML = showContactDetails(createdContact);
        Detailsvisible();
    }
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
    const emailValue = email.value;
    let NewContact = createContactObject(name, email, phone);
    try {
        const newContactRef = db.ref("contact").push();
        await newContactRef.set(NewContact);
        closeDialog();
        await nameList();
        showCreatedContact(emailValue);
        showContactMessage("Contact successfully created");
    } catch (error) {}
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
 * Validates all update form inputs
 * @param {Array<HTMLInputElement>} inputs - Array of input elements
 * @returns {boolean} True if all inputs are valid
 */
function validateUpdateInputs(inputs) {
    let allValid = true;
    inputs.forEach(input => {
        const isValid = validateInput(input);
        if (!isValid) allValid = false;
    });
    return allValid;
}

/**
 * Shows updated contact details after successful update
 * @param {string} id - The contact ID
 * @returns {void}
 */
function showUpdatedContact(id) {
    const updatedContact = contacts.find(c => c.id === id);
    if (updatedContact) {
        setActiveContact(updatedContact.email);
        contactDetails.innerHTML = showContactDetails(updatedContact);
    }
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
    const inputs = [name, email, phone];
    if (!validateUpdateInputs(inputs)) return;
    let UpdateContact = createContactObject(name, email, phone);
    try {
        const contactRef = db.ref(`${root}/${id}`);
        await contactRef.update(UpdateContact);
        closeDialog();
        await nameList();
        showUpdatedContact(id);
        showContactMessage("Contact successfully updated");
    } catch (error) {}
}