/**
 * Handles interactions for the right side of the Add Task form (Assignments, Category, Subtasks).
 */

let searchTimeout;
let selectedContacts = [];
let currentCategory = "";
let subtaskIndex = 0;
let subtaskListArray = [];

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
 * Generates initials from a full name.
 * @param {string} name - The contact's full name.
 * @returns {string} Two-letter initials.
 */
function getContactInitials(name) {
    return name.charAt(0).toUpperCase() + name.charAt(name.indexOf(" ") + 1).toUpperCase();
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
 * Global click listener to close assignment dropdown when clicking outside.
 */
document.addEventListener("click", function (e) {
    const assignmentInput = document.getElementById("assign-input");
    const assignmentDropdown = document.getElementById("contacts-dropdown");
    const assignmentArrow = document.querySelector("#assign-input-box .dropdown-img-container");
    const assignmentArrowImg = document.getElementById("assignment-arrow");

    if (!assignmentInput.contains(e.target) &&
        !assignmentDropdown.contains(e.target) &&
        !assignmentArrow.contains(e.target)) {
        assignmentDropdown.classList.remove("open");
        assignmentArrowImg.classList.remove("rotate");
    }
});

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
 * Global click listener to close category dropdown when clicking outside.
 */
document.addEventListener("click", function (e) {
    const categoryInput = document.getElementById("category-input");
    const categoryDropdown = document.getElementById("category-dropdown");
    const assignmentArrowImg = document.getElementById("category-arrow");

    if (!categoryInput.contains(e.target) && !categoryDropdown.contains(e.target)) {
        categoryDropdown.classList.remove("open");
        assignmentArrowImg.classList.remove("rotate");
    }
});

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

/**
 * Shows or hides the subtask control buttons based on input.
 * @returns {void}
 */
function showHideSubtaskButtons() {
    let subtasks = document.getElementById("subtasks");

    subtasks.value.length === 0

        ? document.getElementById("subtask-button-container").classList.add("d_none")
        : document.getElementById("subtask-button-container").classList.remove("d_none");
}

/**
 * Clears the subtask input field.
 * @returns {void}
 */
function clearInputField() {
    let subtasks = document.getElementById("subtasks");
    subtasks.value = '';
    document.getElementById("subtask-button-container").classList.add("d_none");
}

/**
 * Adds a subtask to the list and resets the input.
 * @returns {void}
 */
function addSubtaskToList() {
    let subtasks = document.getElementById("subtasks");
    let subtaskList = document.getElementById("subtask-list");

    // Check if input is empty after trim
    if (subtasks.value.trim() === '') {
        clearInputField();
        return;
    }

    subtaskList.innerHTML += addSubtaskTemplate(subtasks, subtaskIndex);
    subtaskListArray = Array.from(document.getElementsByClassName("subtask-element")).map(li => li.textContent.trim());
    subtaskIndex++;
    clearInputField();
}

/**
 * Deletes a subtask from the list.
 * @param {string} id - The ID of the subtask element.
 * @returns {void}
 */
function deleteSubtaskListElement(id) {
    let subtaskElement = document.getElementById(id);
    subtaskElement.remove();
    subtaskListArray = Array.from(document.getElementsByClassName("subtask-element")).map(li => li.textContent.trim());
}

/**
 * Switches a subtask list item to edit mode (input field).
 * @param {string} taskId - The ID of the subtask element.
 * @returns {void}
 */
function editSubtask(taskId) {
    const box = document.getElementById(taskId);
    const li = box.querySelector("li.subtask-element");
    const oldText = li.textContent.trim();

    replaceWithEditInput(box, oldText);
    addEditButtons(box, taskId);
}

/**
 * Replaces text content with an input field for editing.
 * @param {HTMLElement} box - The container element.
 * @param {string} text - The current text.
 * @returns {void}
 */
function replaceWithEditInput(box, text) {
    const input = createEditInput(text);
    box.innerHTML = "";
    box.appendChild(input);
}

/**
 * Adds Save and Delete buttons to the edit input.
 * @param {HTMLElement} box - The container element.
 * @param {string} taskId - The subtask ID.
 * @returns {void}
 */
function addEditButtons(box, taskId) {
    const input = box.querySelector("input");
    const buttonContainer = createEditButtons(input, box, taskId);
    box.appendChild(buttonContainer);
}

/**
 * Creates the input element for editing.
 * @param {string} text - The initial value.
 * @returns {HTMLInputElement} The created input.
 */
function createEditInput(text) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = text;
    input.id = "edit_subtask_input";
    return input;
}

/**
 * Creates the button container for edit actions.
 * @param {HTMLInputElement} input - The input element.
 * @param {HTMLElement} box - The container element.
 * @param {string} taskId - The subtask ID.
 * @returns {HTMLElement} The container div.
 */
function createEditButtons(input, box, taskId) {
    const container = document.createElement("div");
    container.className = "subtask-list-button-container";

    const deleteBtn = createButton('./assets/img/add_task/delete.svg', () => {
        deleteSubtaskListElement(taskId);
        subtaskListArray = Array.from(document.getElementsByClassName("subtask-element")).map(li => li.textContent.trim());
    });
    const divider = createDivider();
    const saveBtn = createButton('./assets/img/add_task/check.svg', () => {
        box.innerHTML = editedSubtaskTemplate(taskId, input.value.trim());
        subtaskListArray = Array.from(document.getElementsByClassName("subtask-element")).map(li => li.textContent.trim());
    });

    container.append(deleteBtn, divider, saveBtn);
    return container;
}

/**
 * Helper to create a functional button.
 * @param {string} imgSrc - Path to the icon image.
 * @param {Function} onClick - Click handler.
 * @returns {HTMLElement} The button element.
 */
function createButton(imgSrc, onClick) {
    const btn = document.createElement("div");
    btn.className = "subtask-button";
    btn.innerHTML = `<img src="${imgSrc}" alt="button">`;
    btn.addEventListener("click", onClick);
    return btn;
}

/**
 * Creates a visual divider.
 * @returns {HTMLElement} The divider element.
 */
function createDivider() {
    const div = document.createElement("div");
    div.innerHTML = '<img src="./assets/img/add_task/Vector 3.svg" alt="Divider">';
    return div;
}

/**
 * Handles Enter key to submit subtask.
 * @param {KeyboardEvent} event - The keyboard event.
 * @returns {void}
 */
function handleSubtaskEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();

        const input = document.getElementById("subtasks");

        if (input.value.trim() !== "") {
            addSubtaskToList();
            document.getElementById("subtasks").value = "";
        }
    }
}