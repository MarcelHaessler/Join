/**
 * Form validation and CRUD operations for contacts.
 * Depends on: contacts_list.js
 */

/**
 * Regular expression for validating email addresses.
 * @type {RegExp}
 */
const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Regular expression for validating phone numbers.
 * @type {RegExp}
 */
const phoneRegex = /^\+?\d{1,4}[\s\-()]*(\d[\s\-()]*){6,14}$/;

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
    const dialogAddPerson = document.getElementById("dialogAddPerson");
    if (!dialogAddPerson) return;
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
    const dialogEdit = document.getElementById("dialogEdit");
    if (!dialogEdit) return;
    dialogEdit.querySelectorAll('input').forEach(input => {
        input.addEventListener('blur', () => handleInputBlurValidation(input));
    });
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
 * Checks if the add contact form is valid before uploading
 * Validates all inputs and displays error messages if needed
 * @returns {void}
 */
function isFormValid() {
    const dialogAddPerson = document.getElementById("dialogAddPerson");
    if (!dialogAddPerson) return;
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
 * Shows created contact details after successful upload
 * @param {string} emailValue - The email of the created contact
 * @returns {void}
 */
function showCreatedContact(emailValue) {
    const createdContact = contacts.find(c => c.email === emailValue);
    if (createdContact) {
        setActiveContact(createdContact.email);
        const contactDetails = document.getElementById("contactSelectet");
        if (contactDetails) {
            contactDetails.innerHTML = showContactDetails(createdContact);
        }
        Detailsvisible();
    }
}

/**
 * Uploads a new contact to the Firebase database
 * Shows success message and refreshes the contact list
 * @async
 * @returns {Promise<void>}
 */

/**
 * Creates a new contact object from form fields
 * @returns {Object} The new contact object
 */
function getNewContactFromForm() {
    const name = document.getElementById("contactAddName");
    const email = document.getElementById("contactAddMail");
    const phone = document.getElementById("contactAddPhone");
    return createContactObject(name, email, phone);
}

/**
 * Uploads a contact object to Firebase
 * @async
 * @param {Object} contact - The contact object
 * @returns {Promise<void>}
 */
async function uploadContactToFirebase(contact) {
    const newContactRef = db.ref("contact").push();
    await newContactRef.set(contact);
}

/**
 * Handles the upload process for a new contact
 * @async
 * @returns {Promise<void>}
 */
async function uploadContact() {
    const emailValue = document.getElementById("contactAddMail").value;
    const NewContact = getNewContactFromForm();
    try {
        await uploadContactToFirebase(NewContact);
        closeDialog();
        await nameList();
        showCreatedContact(emailValue);
        showContactMessage("Contact successfully created");
    } catch (error) {}
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
        const contactDetails = document.getElementById("contactSelectet");
        if (contactDetails) {
            contactDetails.innerHTML = showContactDetails(updatedContact);
        }
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

/**
 * Creates an updated contact object from edit form fields
 * @returns {Object} The updated contact object
 */
function getUpdatedContactFromForm() {
    const name = document.getElementById("contactUpdateName");
    const email = document.getElementById("contactUpdateMail");
    const phone = document.getElementById("contactUpdatePhone");
    return createContactObject(name, email, phone);
}

/**
 * Updates a contact object in Firebase
 * @async
 * @param {string} root - The root path
 * @param {string} id - The contact ID
 * @param {Object} contact - The contact object
 * @returns {Promise<void>}
 */
async function updateContactInFirebase(root, id, contact) {
    const contactRef = db.ref(`${root}/${id}`);
    await contactRef.update(contact);
}

/**
 * Handles the update process for an existing contact
 * @async
 * @param {string} root - The root path
 * @param {string} id - The contact ID
 * @returns {Promise<void>}
 */
async function updateContact(root, id) {
    const name = document.getElementById("contactUpdateName");
    const email = document.getElementById("contactUpdateMail");
    const phone = document.getElementById("contactUpdatePhone");
    const inputs = [name, email, phone];
    if (!validateUpdateInputs(inputs)) return;
    const UpdateContact = getUpdatedContactFromForm();
    try {
        await updateContactInFirebase(root, id, UpdateContact);
        closeDialog();
        await nameList();
        showUpdatedContact(id);
        showContactMessage("Contact successfully updated");
    } catch (error) {}
}
