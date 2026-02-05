/**
 * Logic for editing task details (assignments and category) within the Edit Task Overlay.
 */

let editSelectedContacts = [];
let editedCategory = '';
let editedSubtaskListArray = [];

/**
 * Retrieves assigned persons from the task for editing.
 * @param {Object} task - The task object.
 * @returns {void}
 */
function getAssignedPersonsToEdit(task) {
    const assignedPersons = task.assignedPersons;
}

/**
 * Adds background colors to contact initials in the assignment dropdown.
 * @returns {void}
 */
function editAddInitialsBackgroundColors() {
    let contactInitials = document.querySelectorAll(".edit-contact-initials");
    contactInitials.forEach((initial, index) => {
        let contact = contacts[index];
        if (!contact) return;
        initial.style.backgroundColor = backgroundColorCodes[contact.colorIndex];
    });
}

/**
 * Fills the assignment dropdown with all available contacts.
 * @returns {void}
 */
function fillEditAssignmentDropdown() {
    let contactsDropdown = document.getElementById("edit-contacts-dropdown");
    if (!contactsDropdown) return;
    contactsDropdown.innerHTML = "";
    renderEditContacts(contactsDropdown);
}

/**
 * Renders individual contact items into the dropdown.
 * @param {HTMLElement} dropdown - The dropdown container.
 * @returns {void}
 */
function renderEditContacts(dropdown) {
    for (let index = 0; index < contacts.length; index++) {
        let contactName = contacts[index].name;
        let contactInitials = getEditContactInitials(contacts[index].name);
        dropdown.innerHTML += getEditContactTemplate(contactName, contactInitials, index);
    }
}

/**
 * Generates initials from a contact name.
 * @param {string} name - The contact's full name.
 * @returns {string} Two-letter initials.
 */
function getEditContactInitials(name) {
    return name.charAt(0).toUpperCase() + name.charAt(name.indexOf(" ") + 1).toUpperCase();
}

/**
 * Selects the appropriate template for a contact item (Self vs Other).
 * @param {string} name - Contact name.
 * @param {string} initials - Contact initials.
 * @param {number} index - Contact index.
 * @returns {string} HTML string.
 */
function getEditContactTemplate(name, initials, index) {
    return index === 0 ? editAddSelfTemplate(name, initials, index) : editAddTaskContactTemplate(name, initials, index);
}

/**
 * Toggles the visibility of the assignment dropdown.
 * @returns {void}
 */
function editRenderAssignmentDropdown() {
    let contactsDropdown = document.getElementById("edit-contacts-dropdown");
    contactsDropdown.classList.toggle("open");
    let arrowImage = document.getElementById("edit-assignment-arrow");
    arrowImage.classList.toggle("rotate");
    editAddInitialsBackgroundColors();
    editSearchContact();
}

/**
 * Handles clicks outside the assignment dropdown
 * @param {Event} e - The click event
 * @returns {void}
 */
function handleEditAssignmentClickOutside(e) {
    const assignmentInput = document.getElementById("edit-assign-input");
    const assignmentDropdown = document.getElementById("edit-contacts-dropdown");
    const assignmentArrow = document.querySelector("#edit-assign-input-box .dropdown-img-container");
    const assignmentArrowImg = document.getElementById("edit-assignment-arrow");
    if (!assignmentInput || !assignmentDropdown || !assignmentArrow || !assignmentArrowImg) return;
    if (!assignmentInput.contains(e.target) && !assignmentDropdown.contains(e.target) && !assignmentArrow.contains(e.target)) {
        assignmentDropdown.classList.remove("open");
        assignmentArrowImg.classList.remove("rotate");
    }
}

/**
 * Initializes click listener for assignment dropdown
 * @returns {void}
 */
function initEditAssignmentClickListener() {
    document.addEventListener("click", handleEditAssignmentClickOutside);
}

initEditAssignmentClickListener();

/**
 * Delays the contact search to prevent excessive filtering calls.
 * @returns {void}
 */
function editDelaySearchContact() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => editSearchContact(), 500);
}

/**
 * Filters contacts in the dropdown based on search input.
 * @returns {void}
 */
function editSearchContact() {
    let assignInput = document.getElementById('edit-assign-input');
    let input = assignInput.value.toUpperCase();
    let contactElements = document.getElementById("edit-contacts-dropdown");
    let singleContacts = Array.from(contactElements.getElementsByClassName("edit-dropdown-box"));
    singleContacts.forEach(e => {
        const contactName = e.querySelector('.edit-contact-fullname');
        const txtValue = contactName.innerText || contactName.textContent;
        e.style.display = txtValue.toUpperCase().includes(input) ? "" : "none";
    })
}

/**
 * Toggles selection of a contact for the task.
 * @param {number} index - The index of the contact in the global contacts array.
 * @returns {void}
 */
function editSelectContact(index) {
    let currentContact = document.getElementById(`edit-contact${index}`);
    currentContact.classList.toggle('edit-selected-contact');
    let contact = contacts[index]
    let deleteContact = editSelectedContacts.find(c => c === contact);
    if (deleteContact) {
        editSelectedContacts = editSelectedContacts.filter(c => c !== contact);
    } else { editSelectedContacts.push(contact) };
    editRenderSelectedContacts();
    addChosenInitialsBackgroundColors();
    editChangeCheckbox(index);
}

/**
 * Renders the selected contact initials (up to 3) in the overlay.
 * @returns {void}
 */
function editRenderSelectedContacts() {
    let selectedContactsContainer = document.getElementById('edit-chosen-contacts');
    selectedContactsContainer.innerHTML = '';
    toggleEditContainerVisibility(selectedContactsContainer);
    renderEditContactInitials(selectedContactsContainer);
    renderEditExtraContacts(selectedContactsContainer);
    editAddChosenInitialsBackgroundColors();
}

/**
 * Toggles visibility of the selected contacts container.
 * @param {HTMLElement} container - The container element.
 * @returns {void}
 */
function toggleEditContainerVisibility(container) {
    if (editSelectedContacts.length > 0) {
        container.classList.remove('d_none');
    } else {
        container.classList.add('d_none');
    }
}

/**
 * Renders the initials of the first 3 selected contacts.
 * @param {HTMLElement} container - The container element.
 * @returns {void}
 */
function renderEditContactInitials(container) {
    for (let index = 0; index < editSelectedContacts.length && index <= 2; index++) {
        let initials = getEditContactInitials(editSelectedContacts[index].name);
        container.innerHTML += editAddInitialTemplate(initials);
    }
}

/**
 * Renders the count of extra selected contacts if more than 3.
 * @param {HTMLElement} container - The container element.
 * @returns {void}
 */
function renderEditExtraContacts(container) {
    if (editSelectedContacts.length > 3) {
        let number = editSelectedContacts.length - 3;
        container.innerHTML += editAddNumberOfExtraPeople(number);
    }
}

/**
 * Adds background colors to the chosen contact initials.
 * @returns {void}
 */
function editAddChosenInitialsBackgroundColors() {
    let chosenContactInitials = document.querySelectorAll(".chosen-contact-initials");
    chosenContactInitials.forEach((initial, index) => {
        let contact = editSelectedContacts[index];
        if (!contact) return;
        initial.style.backgroundColor = backgroundColorCodes[contact.colorIndex];
    });
}

/**
 * Updates the checkbox state for a contact in the dropdown.
 * @param {number} index - The index of the contact.
 * @returns {void}
 */
function editChangeCheckbox(index) {
    let checkbox = document.getElementById(`edit-checkbox${index}`);
    if (!checkbox) return;
    const checkboxInactive = './assets/img/checkbox_inactive.svg';
    const checkboxActive = './assets/img/checkbox_active.svg';
    if (checkbox.src.includes('checkbox_inactive.svg')) {
        checkbox.src = checkboxActive;
        checkbox.classList.add('edit-checkbox-active');
    } else {
        checkbox.src = checkboxInactive;
        checkbox.classList.remove('edit-checkbox-active');
    }
}

/**
 * Activates contacts in the dropdown that are already assigned to the task.
 * @param {Object} task - The task object.
 * @returns {void}
 */
function activateAddedContacts(task) {
    editSelectedContacts = [];
    if (!task.assignedPersons || task.assignedPersons.length === 0) return;
    task.assignedPersons.forEach(p => {
        let contactIndex = contacts.findIndex(contact => contact.name === p.name);
        if (contactIndex !== -1) {
            activateContactWithoutToggle(contactIndex);
        }
    });
}

/**
 * Helper to select a contact without triggering a toggle (for initial load).
 * @param {number} index - contact index.
 * @returns {void}
 */
function activateContactWithoutToggle(index) {
    let currentContact = document.getElementById(`edit-contact${index}`);
    if (currentContact) {
        currentContact.classList.add('edit-selected-contact');
    }
    let contact = contacts[index];
    if (contact && !editSelectedContacts.includes(contact)) {
        editSelectedContacts.push(contact);
    }
    editRenderSelectedContacts();
    addChosenInitialsBackgroundColors();
    editChangeCheckbox(index);
}

/**
 * Sets the category dropdown to the task's existing category.
 * @param {Object} task - The task object.
 * @returns {void}
 */
function activateChosenCategory(task) {
    if (task.category === 'Technical Task') {
        editChoseTechnicalTask();
    } else if (task.category === 'User Story') {
        editChoseUserStory();
    }
}


/**
 * Toggles visibility of the category dropdown.
 * @returns {void}
 */
function editOpenCloseCategoryDropdown() {
    let categoryDropdown = document.getElementById("edit-category-dropdown");
    let arrowImage = document.getElementById("edit-category-arrow");
    arrowImage.classList.toggle("rotate");
    categoryDropdown.classList.toggle("open");
}

/**
 * Closes the category dropdown.
 * @returns {void}
 */
function editCloseCategoryDropdown() {
    let categoryDropdown = document.getElementById("edit-category-dropdown");
    let arrowImage = document.getElementById("edit-category-arrow");
    arrowImage.classList.remove("rotate");
    categoryDropdown.classList.remove("open");
}

/**
 * Handles clicks outside the category dropdown
 * @param {Event} e - The click event
 * @returns {void}
 */
function handleEditCategoryClickOutside(e) {
    const categoryInput = document.getElementById("edit-category-input");
    const categoryDropdown = document.getElementById("edit-category-dropdown");
    const assignmentArrowImg = document.getElementById("edit-category-arrow");
    if (!categoryInput || !categoryDropdown || !assignmentArrowImg) return;
    if (!categoryInput.contains(e.target) && !categoryDropdown.contains(e.target)) {
        categoryDropdown.classList.remove("open");
        assignmentArrowImg.classList.remove("rotate");
    }
}

/**
 * Initializes click listener for category dropdown
 * @returns {void}
 */
function initEditCategoryClickListener() {
    document.addEventListener("click", handleEditCategoryClickOutside);
}

initEditCategoryClickListener();


/**
 * Selects "Technical Task" as the category.
 * @returns {void}
 */
function editChoseTechnicalTask() {
    let categoryInput = document.getElementById("edit-category");
    categoryInput.value = "Technical Task";
    editedCategory = "Technical Task";
    editCloseCategoryDropdown();
}

/**
 * Selects "User Story" as the category.
 * @returns {void}
 */
function editChoseUserStory() {
    let categoryInput = document.getElementById("edit-category");
    categoryInput.value = "User Story";
    editedCategory = "User Story";
    editCloseCategoryDropdown();
}