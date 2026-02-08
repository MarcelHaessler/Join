/**
 * Contact list rendering, navigation, and UI display logic.
 */

/**
 * Reference to the contact list container element.
 * @type {HTMLElement}
 */
const contactList = document.getElementById("contacList");

/**
 * Reference to the contact details display element.
 * @type {HTMLElement}
 */
const contactDetails = document.getElementById("contactSelectet");

/**
 * Reference to the sidebar CSS element.
 * @type {HTMLElement}
 */
const contactSidebarCss = document.querySelector('.sideBar');

/**
 * Reference to the contacts main section CSS element.
 * @type {HTMLElement}
 */
const contactDetailsCss = document.querySelector('.contacts');

/**
 * Reference to the add person dialog element.
 * @type {HTMLElement}
 */
const dialogAddPerson = document.getElementById("dialogAddPerson");

/**
 * Reference to the edit contact dialog element.
 * @type {HTMLElement}
 */
const dialogEdit = document.getElementById("dialogEdit");

/**
 * Reference to the mobile menu trigger element.
 * @type {HTMLElement}
 */
const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');

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

/**
 * Filters and sorts contacts by name
 * @param {Array} contacts - Array of contact objects
 * @returns {Array} Sorted and filtered contacts
 */
function getSortedValidContacts(contacts) {
    return contacts
        .filter(contact => contact.name && contact.name.trim() !== "")
        .sort((a, b) => a.name.localeCompare(b.name, "de"));
}

/**
 * Renders the contact list with letter sections
 * @param {Array} contacts - Array of sorted contacts
 * @returns {void}
 */
function renderContactListWithLetters(contacts) {
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

/**
 * Fetches contact list and displays them sorted by name with letter sections
 * Filters out contacts without valid names
 * @async
 * @returns {Promise<void>}
 */
async function nameList() {
    await window.fetchContacts();
    const validContacts = getSortedValidContacts(contacts);
    renderContactListWithLetters(validContacts);
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
