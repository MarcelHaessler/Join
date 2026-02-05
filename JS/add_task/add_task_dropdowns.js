/**
 * Handles interactions for the right side of the Add Task form (Assignments, Category, Subtasks).
 */

/**
 * Timeout ID for debouncing the contact search input.
 * @type {number|undefined}
 */
let searchTimeout;

/**
 * Array of currently selected contacts for task assignment.
 * @type {Array}
 */
let selectedContacts = [];

/**
 * The currently selected task category.
 * @type {string}
 */
let currentCategory = "";

/**
 * Adds background colors to the initials of displayed contacts.
 * @returns {void}
 */
function addInitialsBackgroundColors() {
    let contactInitials = document.querySelectorAll(".contact-initials");
    contactInitials.forEach((initial, index) => {
        let contact = contacts[index];
        if (!contact) return;
        initial.style.backgroundColor = backgroundColorCodes[contact.colorIndex];
    });
}

/**
 * Fills the contacts dropdown with available contacts.
 * @returns {void}
 */
function fillAssignmentDropdown() {
    let contactsDropdown = document.getElementById("contacts-dropdown");
    if (!contactsDropdown) return;
    contactsDropdown.innerHTML = "";
    if (!window.contacts || !Array.isArray(window.contacts)) {
        showNoContactsMessage(contactsDropdown);
        return;
    }
    renderContactsInDropdown(contactsDropdown);
}

/**
 * Displays a message when no contacts are available.
 * @param {HTMLElement} dropdown - The dropdown element.
 * @returns {void}
 */
function showNoContactsMessage(dropdown) {
    dropdown.innerHTML = '<div style="padding: 10px;">No contacts available</div>';
}

/**
 * Renders individual contact content into the dropdown.
 * @param {HTMLElement} dropdown - The dropdown element.
 * @returns {void}
 */
function renderContactsInDropdown(dropdown) {
    for (let index = 0; index < contacts.length; index++) {
        let contactName = contacts[index].name;
        let contactInitials = getContactInitials(contacts[index].name);
        dropdown.innerHTML += getContactTemplate(contactName, contactInitials, index);
    }
}

/**
 * Generates initials from a full name (first letter of first name + first letter of last name).
 * @param {string} name - The contact's full name.
 * @returns {string} Two-letter initials.
 */
function getContactInitials(name) {
    if (!name || name.trim() === "") return "?";
    const parts = name.trim().split(/\s+/);
    const first = parts[0][0];
    const last = parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] || "";
    return (first + last).toUpperCase();
}

/**
 * Selects the appropriate contact template (Self or Other).
 * @param {string} name - The contact's name.
 * @param {string} initials - The contact's initials.
 * @param {number} index - The contact's index.
 * @returns {string} HTML string.
 */
function getContactTemplate(name, initials, index) {
    return index === 0 ? addSelfTemplate(name, initials, index) : addTaskContactTemplate(name, initials, index);
}

/**
 * Toggles the visibility of the assignment dropdown.
 * @returns {void}
 */
function renderAssignmentDropdown() {
    let contactsDropdown = document.getElementById("contacts-dropdown");
    contactsDropdown.classList.toggle("open");
    let arrowImage = document.getElementById("assignment-arrow");
    arrowImage.classList.toggle("rotate");
    addInitialsBackgroundColors();
    searchContact();
}

/**
 * Handles click events to close assignment dropdown when clicking outside
 * @param {Event} e - The click event
 * @returns {void}
 */
function handleAssignmentClickOutside(e) {
    const assignmentInput = document.getElementById("assign-input");
    const assignmentDropdown = document.getElementById("contacts-dropdown");
    const assignmentArrow = document.querySelector("#assign-input-box .dropdown-img-container");
    const assignmentArrowImg = document.getElementById("assignment-arrow");
    if (!assignmentInput.contains(e.target) && !assignmentDropdown.contains(e.target) && !assignmentArrow.contains(e.target)) {
        assignmentDropdown.classList.remove("open");
        assignmentArrowImg.classList.remove("rotate");
    }
}

/**
 * Initializes click listener for assignment dropdown
 * @returns {void}
 */
function initAssignmentClickListener() {
    document.addEventListener("click", handleAssignmentClickOutside);
}

initAssignmentClickListener();

/**
 * Delays the contact search execution.
 * @returns {void}
 */
function delaySearchContact() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => searchContact(), 500);
}

/**
 * Filters the contacts dropdown based on search input.
 * @returns {void}
 */
function searchContact() {
    let assignInput = document.getElementById('assign-input');
    let input = assignInput.value.toUpperCase();
    let contactElements = document.getElementById("contacts-dropdown");
    let singleContacts = Array.from(contactElements.getElementsByClassName("dropdown-box"));
    singleContacts.forEach(e => {
        const contactName = e.querySelector('.contact-fullname');
        const txtValue = contactName.innerText || contactName.textContent;
        e.style.display = txtValue.toUpperCase().includes(input) ? "" : "none";
    })
}

/**
 * Selects or unselects a contact for assignment.
 * @param {number} index - The contact's index.
 * @returns {void}
 */
function selectContact(index) {
    let currentContact = document.getElementById(`contact${index}`);
    currentContact.classList.toggle('selected-contact');
    let contact = contacts[index]
    let deleteContact = selectedContacts.find(c => c === contact);
    if (deleteContact) {
        selectedContacts = selectedContacts.filter(c => c !== contact);
    } else { selectedContacts.push(contact) };

    renderSelectedContacts();
    addChosenInitialsBackgroundColors();
    changeCheckbox(index);
}

/**
 * Renders the selected contacts' initials in the display area.
 * @returns {void}
 */
function renderSelectedContacts() {
    let selectedContactsContainer = document.getElementById('chosen-contacts');
    selectedContactsContainer.innerHTML = '';
    toggleContainerVisibility(selectedContactsContainer);
    renderContactInitials(selectedContactsContainer);
    renderExtraContactsCount(selectedContactsContainer);
    addChosenInitialsBackgroundColors();
}

/**
 * Toggles visibility of the selected contacts container.
 * @param {HTMLElement} container - The container element.
 * @returns {void}
 */
function toggleContainerVisibility(container) {
    if (selectedContacts.length > 0) {
        container.classList.remove('d_none');
    } else {
        container.classList.add('d_none');
    }
}

/**
 * Renders the first 3 selected contact initials.
 * @param {HTMLElement} container - The container element.
 * @returns {void}
 */
function renderContactInitials(container) {
    for (let index = 0; index < selectedContacts.length && index <= 2; index++) {
        let initials = getContactInitials(selectedContacts[index].name);
        container.innerHTML += addInitialTemplate(initials);
    }
}

/**
 * Renders the "plus X more" indicator if more than 3 contacts selected.
 * @param {HTMLElement} container - The container element.
 * @returns {void}
 */
function renderExtraContactsCount(container) {
    if (selectedContacts.length > 3) {
        let number = selectedContacts.length - 3;
        container.innerHTML += addNumberOfExtraPeople(number);
    }
}

/**
 * Adds background colors to the chosen initials.
 * @returns {void}
 */
function addChosenInitialsBackgroundColors() {
    let chosenContactInitials = document.querySelectorAll(".chosen-contact-initials");
    chosenContactInitials.forEach((initial, index) => {
        let contact = contacts[index];
        initial.style.backgroundColor = backgroundColorCodes[contact.colorIndex];
    });
}

/**
 * Toggles the checkbox state for a contact item.
 * @param {number} index - The contact index.
 * @returns {void}
 */
function changeCheckbox(index) {
    let checkbox = document.getElementById(`checkbox${index}`);
    const checkboxInactive = './assets/img/checkbox_inactive.svg';
    const checkboxActive = './assets/img/checkbox_active.svg'
    if (checkbox.src.includes('checkbox_inactive.svg')) {
        checkbox.src = checkboxActive
        checkbox.classList.add('checkbox-active');
    } else {
        checkbox.src = checkboxInactive
        checkbox.classList.remove('checkbox-active');
    }
}

/**
 * Toggles the visibility of the category dropdown.
 * @returns {void}
 */
function openCloseCategoryDropdown() {
    let categoryDropdown = document.getElementById("category-dropdown");
    let arrowImage = document.getElementById("category-arrow");
    arrowImage.classList.toggle("rotate");
    categoryDropdown.classList.toggle("open");
}

/**
 * Handles click events to close category dropdown when clicking outside
 * @param {Event} e - The click event
 * @returns {void}
 */
function handleCategoryClickOutside(e) {
    const categoryInput = document.getElementById("category-input");
    const categoryDropdown = document.getElementById("category-dropdown");
    const assignmentArrowImg = document.getElementById("category-arrow");
    if (!categoryInput.contains(e.target) && !categoryDropdown.contains(e.target)) {
        categoryDropdown.classList.remove("open");
        assignmentArrowImg.classList.remove("rotate");
    }
}

/**
 * Initializes click listener for category dropdown
 * @returns {void}
 */
function initCategoryClickListener() {
    document.addEventListener("click", handleCategoryClickOutside);
}

initCategoryClickListener();

/**
 * Validates that a category has been selected.
 * @returns {void}
 */
function checkCategory() {
    let categoryInputWarning = document.getElementById('category-warning');
    let categoryInput = document.getElementById("category");
    if (currentCategory === '') {
        categoryInputWarning.innerHTML = "This field is required.";
        categoryInputWarning.style.color = "#e60025";
        categoryInput.classList.add("invalid");
    }
    if (currentCategory !== '') {
        categoryInputWarning.innerHTML = "";
        categoryInput.classList.remove("invalid");
    }
}


/**
 * Selects "Technical Task" as the category.
 * @returns {void}
 */
function choseTechnicalTask() {
    let categoryInput = document.getElementById("category");
    categoryInput.value = "Technical Task";
    currentCategory = "Technical Task";
    openCloseCategoryDropdown();
    checkCategory();
}

/**
 * Selects "User Story" as the category.
 * @returns {void}
 */
function choseUserStory() {
    let categoryInput = document.getElementById("category");
    categoryInput.value = "User Story";
    currentCategory = "User Story";
    openCloseCategoryDropdown();
}
