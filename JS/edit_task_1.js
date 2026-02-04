/** JS functions for editing task board assignments, category, and subtasks */

let editSelectedContacts = [];
let editedCategory = '';
let editedSubtaskListArray = [];

//Function to call all selected users for assignment in edit task
function getAssignedPersonsToEdit(task) {
    const assignedPersons = task.assignedPersons;
}

//Function that adds background colors to contact initials in edit task overlay
function editAddInitialsBackgroundColors() {
    let contactInitials = document.querySelectorAll(".edit-contact-initials");
    contactInitials.forEach((initial, index) => {
        let contact = contacts[index];
        if (!contact) return;
        initial.style.backgroundColor = backgroundColorCodes[contact.colorIndex];
    });
}

//Function to fill assignment dropdown with all contacts
function fillEditAssignmentDropdown() {
    let contactsDropdown = document.getElementById("edit-contacts-dropdown");
    contactsDropdown.innerHTML = "";
    renderEditContacts(contactsDropdown);
}

function renderEditContacts(dropdown) {
    for (let index = 0; index < contacts.length; index++) {
        let contactName = contacts[index].name;
        let contactInitials = getEditContactInitials(contacts[index].name);
        dropdown.innerHTML += getEditContactTemplate(contactName, contactInitials, index);
    }
}

function getEditContactInitials(name) {
    return name.charAt(0).toUpperCase() + name.charAt(name.indexOf(" ") + 1).toUpperCase();
}

function getEditContactTemplate(name, initials, index) {
    return index === 0 ? editAddSelfTemplate(name, initials, index) : editAddTaskContactTemplate(name, initials, index);
}

/**Function to render/open the assignment dropdown*/
function editRenderAssignmentDropdown() {
    let contactsDropdown = document.getElementById("edit-contacts-dropdown");
    contactsDropdown.classList.toggle("open");
    let arrowImage = document.getElementById("edit-assignment-arrow");
    arrowImage.classList.toggle("rotate");
    editAddInitialsBackgroundColors();
    editSearchContact();
}

/**Function that rotates the arrow on opening/closing the dropdown of assignment dropdown*/
document.addEventListener("click", function (e) {
    const assignmentInput = document.getElementById("edit-assign-input");
    const assignmentDropdown = document.getElementById("edit-contacts-dropdown");
    const assignmentArrow = document.querySelector("#edit-assign-input-box .dropdown-img-container");
    const assignmentArrowImg = document.getElementById("edit-assignment-arrow");
    if (!assignmentInput || !assignmentDropdown || !assignmentArrow || !assignmentArrowImg) return;
    if (!assignmentInput.contains(e.target) &&
        !assignmentDropdown.contains(e.target) &&
        !assignmentArrow.contains(e.target)) {
        assignmentDropdown.classList.remove("open");
        assignmentArrowImg.classList.remove("rotate");
    }
});

/**Function that adds a delay on searchContact function*/
function editDelaySearchContact() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => editSearchContact(), 500);
}

/**Function to search between the contacts and show them in assignment dropdown*/
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

/**Function to select contacts that will be added to the Task. */
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

/**Function to show the selected contacts. Only 3 contact initials will be rendered, from the 4th contact +(number of remaining contacts). */
function editRenderSelectedContacts() {
    let selectedContactsContainer = document.getElementById('edit-chosen-contacts');
    selectedContactsContainer.innerHTML = '';
    toggleEditContainerVisibility(selectedContactsContainer);
    renderEditContactInitials(selectedContactsContainer);
    renderEditExtraContacts(selectedContactsContainer);
    editAddChosenInitialsBackgroundColors();
}

function toggleEditContainerVisibility(container) {
    if (editSelectedContacts.length > 0) {
        container.classList.remove('d_none');
    } else { 
        container.classList.add('d_none'); 
    }
}

function renderEditContactInitials(container) {
    for (let index = 0; index < editSelectedContacts.length && index <= 2; index++) {
        let initials = getEditContactInitials(editSelectedContacts[index].name);
        container.innerHTML += editAddInitialTemplate(initials);
    }
}

function renderEditExtraContacts(container) {
    if (editSelectedContacts.length > 3) {
        let number = editSelectedContacts.length - 3;
        container.innerHTML += editAddNumberOfExtraPeople(number);
    }
}

/**Function that adds background color to chosen contacts, same as before. */
function editAddChosenInitialsBackgroundColors() {
    let chosenContactInitials = document.querySelectorAll(".chosen-contact-initials");
    chosenContactInitials.forEach((initial, index) => {
        let contact = editSelectedContacts[index];
        if (!contact) return;
        initial.style.backgroundColor = backgroundColorCodes[contact.colorIndex];
    });
}

/**Function that gives a checkbox user response by chosing a contact. */
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

//Function that activates dropdown box of already assigned contacts in edit task overlay
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

//Function that activates contact without toggling when loading assigned contacts in edit task overlay
function activateContactWithoutToggle(index) {
    let currentContact = document.getElementById(`edit-contact${index}`);
    currentContact.classList.add('edit-selected-contact');
    let contact = contacts[index];
    if (!editSelectedContacts.includes(contact)) {
        editSelectedContacts.push(contact);
    }
    editRenderSelectedContacts();
    addChosenInitialsBackgroundColors();
    editChangeCheckbox(index);
}

//Function that shows/activates already chosen category in edit task overlay
function activateChosenCategory(task) {
    if (task.category === 'Technical Task') {
        editChoseTechnicalTask();
    } else if (task.category === 'User Story') {
        editChoseUserStory();
    }
}


/**Function to open/close category dropdown */
function editOpenCloseCategoryDropdown() {
    let categoryDropdown = document.getElementById("edit-category-dropdown");
    let arrowImage = document.getElementById("edit-category-arrow");
    arrowImage.classList.toggle("rotate");
    categoryDropdown.classList.toggle("open");
}

//Function to close Category dropdown
function editCloseCategoryDropdown() {
    let categoryDropdown = document.getElementById("edit-category-dropdown");
    let arrowImage = document.getElementById("edit-category-arrow");
    arrowImage.classList.remove("rotate");
    categoryDropdown.classList.remove("open");
}

/**Function that rotates on opening/closing the category dropdown */
document.addEventListener("click", function (e) {
    const categoryInput = document.getElementById("edit-category-input");
    const categoryDropdown = document.getElementById("edit-category-dropdown");
    const assignmentArrowImg = document.getElementById("edit-category-arrow");
    if (!categoryInput || !categoryDropdown || !assignmentArrowImg) return;
    if (!categoryInput.contains(e.target) && !categoryDropdown.contains(e.target)) {
        categoryDropdown.classList.remove("open");
        assignmentArrowImg.classList.remove("rotate");
    }
});


/**Function to select chosen category that gives a user response and stores chosen category in editedCategory array.*/
function editChoseTechnicalTask() {
    let categoryInput = document.getElementById("edit-category");
    categoryInput.value = "Technical Task";
    editedCategory = "Technical Task";
    editCloseCategoryDropdown();
}

/**Function to select chosen category that gives a user response and stores chosen category in editedCategory array.*/
function editChoseUserStory() {
    let categoryInput = document.getElementById("edit-category");
    categoryInput.value = "User Story";
    editedCategory = "User Story";
    editCloseCategoryDropdown();
}

//Function that shows existing subtasks in subtask list
function showExistingSubtasks(task) {
    let subtaskList = document.getElementById("edit-subtask-list");
    subtaskList.innerHTML = '';
    resetSubtaskData();
    if (!task.subtasks || task.subtasks.length === 0) { return; }
    renderExistingSubtasks(task.subtasks, subtaskList);
}

function resetSubtaskData() {
    editedSubtaskListArray = [];
    subtaskIndex = 0;
}

function renderExistingSubtasks(subtasks, subtaskList) {
    subtasks.forEach((subtask, index) => {
        subtaskList.innerHTML += editAddSubtaskTemplate({ value: subtask.text }, index);
        editedSubtaskListArray.push({
            text: subtask.text,
            subtaskComplete: !!subtask.subtaskComplete
        });
        subtaskIndex++;
    });
}

/**Function to show input buttons from the first tryped character in the input field. */
function editShowHideSubtaskButtons() {
    let subtasks = document.getElementById("edit-subtasks");
    subtasks.value.length === 0
        ? document.getElementById("edit-subtask-button-container").classList.add("d_none")
        : document.getElementById("edit-subtask-button-container").classList.remove("d_none");
}

/**Function to empty the input field. */
function editClearInputField() {
    let subtasks = document.getElementById("edit-subtasks");
    subtasks.value = '';
    document.getElementById("edit-subtask-button-container").classList.add("d_none");
}

/**Function that adds the value of input to the list of subtasks. */
function editAddSubtaskToList() {
    let subtasks = document.getElementById("edit-subtasks");
    let subtaskList = document.getElementById("edit-subtask-list");
    subtaskList.innerHTML += editAddSubtaskTemplate({ value: subtasks.value }, subtaskIndex);
    editedSubtaskListArray.push({
        text: subtasks.value.trim(),
        subtaskComplete: false
    });
    subtaskIndex++;
    editClearInputField();
}

/**Function to delete chosen subtask from list */
function editDeleteSubtaskListElement(id, textToDelete = null) {
    let subtaskElement = document.getElementById(id);
    if (!subtaskElement) return;
    
    let text = textToDelete;
    
    // Wenn kein Text übergeben wurde, versuche ihn zu finden
    if (!text) {
        let li = subtaskElement.querySelector('.edit-subtask-element');
        let input = subtaskElement.querySelector('#edit-subtask-input');
        
        if (li) {
            text = li.textContent.trim();
        } else if (input) {
            text = input.value.trim();
        }
    }
    
    // Entferne visuell
    subtaskElement.remove();
    
    // Entferne aus Array
    if (text) {
        editedSubtaskListArray = editedSubtaskListArray.filter(obj => obj.text.trim() !== text.trim());
    }
}

/**Functions to edit an added subtask by changing an li element into an imput field and on saving changing back to li. */
function editSubtaskEditing(taskId) {
    const box = document.getElementById(taskId);
    const li = box.querySelector("li.edit-subtask-element");
    const oldText = li.textContent.trim();
    replaceEditWithInput(box, oldText);
    addEditSubtaskButtons(box, taskId, oldText);
}

function replaceEditWithInput(box, text) {
    const input = editCreateEditInput(text);
    box.innerHTML = "";
    box.appendChild(input);
}

function addEditSubtaskButtons(box, taskId, oldText) {
    const input = box.querySelector("input");
    const buttonContainer = editCreateEditButtons(input, box, taskId, oldText);
    box.appendChild(buttonContainer);
}

/**Function that creates an input field with what the user can directly edit the added subtask. */
function editCreateEditInput(text) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = text;
    input.id = "edit-subtask-input";
    return input;
}

/**Function that creates new buttons and a divider in the new input field. */
function editCreateEditButtons(input, box, taskId, oldText) {
    const container = document.createElement("div");
    container.className = "edit-subtask-list-button-container";
    const deleteBtn = editCreateButton('./assets/img/add_task/delete.svg', () => editDeleteSubtaskListElement(taskId, oldText));
    const divider = editCreateDivider();
    const saveBtn = createEditSaveButton(input, box, taskId, oldText);
    container.append(deleteBtn, divider, saveBtn);
    return container;
}

function createEditSaveButton(input, box, taskId, oldText) {
    return editCreateButton('./assets/img/add_task/check.svg', () => {
        saveEditedSubtask(input, box, taskId, oldText);
    });
}

function saveEditedSubtask(input, box, taskId, oldText) {
    const newText = input.value.trim();
    if (!newText) return;
    box.innerHTML = editEditedSubtaskTemplate(taskId, newText);
    updateSubtaskInArray(oldText, newText);
}

function updateSubtaskInArray(oldText, newText) {
    const index = editedSubtaskListArray.findIndex(obj => obj.text === oldText);
    if (index !== -1) {
        const prevComplete = !!editedSubtaskListArray[index].subtaskComplete;
        editedSubtaskListArray[index] = { text: newText, subtaskComplete: prevComplete };
    } else {
        editedSubtaskListArray.push({ text: newText, subtaskComplete: false });
    }
}

/**Function that creates editing buttons to the new input field. */
function editCreateButton(imgSrc, onClick) {
    const btn = document.createElement("div");
    btn.className = "edit-subtask-button";
    btn.innerHTML = `<img src="${imgSrc}" alt="button">`;
    btn.addEventListener("click", onClick);
    return btn;
}

/**Function that creates a divider between the two buttons. */
function editCreateDivider() {
    const div = document.createElement("div");
    div.innerHTML = '<img src="./assets/img/add_task/Vector 3.svg" alt="Divider">';
    return div;
}

/**Function to handle the Enter key press in the subtask input field. */
function editHandleSubtaskEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();

        const input = document.getElementById("edit-subtasks");
        if (!input) return;
        if (input.value.trim() !== "") {
            editAddSubtaskToList();
            document.getElementById("edit-subtasks").value = "";
        }
    }
}