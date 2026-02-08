
/**
 * Generates HTML for the edit task overlay.
 * @param {Object} element - The task object
 * @param {string} taskId - The unique ID of the task
 * @returns {string} HTML string for the edit form
 */
function generateEditTaskHTML(element, taskId) {
    let title = element.title;
    let description = element.description;
    let date = convertDateToISO(element.date);
    let priority = element.priority;
    let names = element.assignedPersons;
    let subtasks = element.subtasks;
    let category = element.category;


    return `    <section onclick="stopPropagation(event)" id="edit-task-card">
                    <div id="edit-task-card-head">
                        <div id="close-edit-task-card-button" onclick="closeTaskCardOverlay()" >
                            <img src="./assets/img/add_task/close.svg" alt="close-edit-task-card">
                        </div>
                    </div>
                    <div id="edit-task-form">
                        <div class="edit-input-container" id="edit-title-container">
                            <label for="title">Title</label>
                            <input id="edit-title" type="text" placeholder="Enter a Title" value="${title}">
                            <p class="warning-message" id="edit-title-warning"></p>
                        </div>
                        <div class="edit-input-container" id="edit-description-container">
                            <label for="description">Description</label>
                            <textarea name="description" id="edit-description" placeholder="Enter a Description">${description}</textarea>
                            <p class="warning-message" id="edit-description-warning"></p>
                        </div>
                        <div class="edit-input-container" id="edit-date-container">
                            <label for="date">Due date</label>
                            <input id="edit-date" type="date" value="${date}" min="">
                            <p class="warning-message" id="edit-date-warning"></p>
                        </div>
                    
                        <div id="priority-container">
                            <label>Priority</label>
                            <div class="edit-input-container" id="form-buttons">
                                <button onclick="urgentPriority()" id="edit-urgent-btn" class="priority-buttons">
                                    <p>Urgent</p>
                                    <img id="edit-urgent-img" src="./assets/img/add_task/urgent.svg" alt="Urgent">
                                </button>
                                <button onclick="mediumPriority()" id="edit-medium-btn" class="priority-buttons">
                                    <p>Medium</p>
                                    <img id="edit-medium-img" src="./assets/img/add_task/medium.svg" alt="Medium">
                                </button>
                                <button onclick="lowPriority()" id="edit-low-btn" class="priority-buttons">
                                    <p>Low</p>
                                    <img id="edit-low-img" src="./assets/img/add_task/low.svg" alt="Low">
                                </button>
                            </div>
                        </div>
                        <div class="edit-input-container" id="assignment-container">
                            <label for="assign-input">Assigned to</label>
                            <div id="edit-assign-input-box">
                                <input id="edit-assign-input" oninput="editDelaySearchContact()"
                                    onclick="editRenderAssignmentDropdown()" type="text"
                                    placeholder="Select contacts to assign">
                                <div onclick="editRenderAssignmentDropdown()" class="dropdown-img-container">
                                    <img class="dropdown-img" id="edit-assignment-arrow"
                                        src="./assets/img/add_task/arrow_drop_down.svg" alt="Open Contact List">
                                </div>
                            </div>
                            <div id="edit-contacts-dropdown"></div>
                            <div id="edit-chosen-contacts" class="d_none"></div>
                        </div>
                        <div class="edit-input-container" id="edit-category-container">
                            <label for="category">Category</label>
                            <div id="edit-category-input">
                                <input onclick="editOpenCloseCategoryDropdown()" type="text" id="edit-category"
                                    placeholder="Select task category" readonly>
                                <div onclick="editOpenCloseCategoryDropdown()" class="dropdown-img-container">
                                    <img class="dropdown-img" id="edit-category-arrow"
                                        src="./assets/img/add_task/arrow_drop_down.svg" alt="Open Category List">
                                </div>
                            </div>
                            <div id="edit-category-dropdown">
                                <div onclick="editChoseTechnicalTask()" class="dropdown-box">
                                    Technical Task
                                </div>
                                <div onclick="editChoseUserStory()" class="dropdown-box">
                                    User Story
                                </div>
                            </div>
                        </div>


                        <div id="edit-subtask-container" class="edit-input-container">
                            <label for="subtasks">Subtasks</label>
                            <div id="edit-subtask-input-wrapper">
                                <input onkeyup="editShowHideSubtaskButtons()" onkeydown="editHandleSubtaskEnter(event)" type="text" name="subtasks" id="edit-subtasks"
                                    placeholder="Add new subtask">
                                <div class="d_none" id="edit-subtask-button-container">
                                    <div onclick="editClearInputField()" class="edit-subtask-button">
                                        <img id="edit-clear-button" src="./assets/img/add_task/close.svg" alt="Clear">
                                    </div>
                                    <img src="./assets/img/add_task/Vector 3.svg" alt="Divider">
                                    <div onclick="editAddSubtaskToList()" class="edit-subtask-button">
                                        <img id="accept-button" src="./assets/img/add_task/check.svg" alt="Accept">
                                    </div>
                                </div>
                            </div>
                            <div id="edit-subtask-list-container">
                                <ul id="edit-subtask-list"></ul>
                            </div>
                        </div>
                        <div id="save-edit-task-button-container">
                            <button onclick="saveEditedTask('${taskId}')" id="edit-save-edit-task-button">Ok
                            <img id="save-edit-task-button-img" src="./assets/img/add_task/check.svg" alt="Save Edited Task"></button>
                        </div>
                    </div>
                </section>`;
}

/**
 * Template for adding logged-in user to assignment dropdown in edit task overlay.
 * @param {string} name - The user's name
 * @param {string} initials - The user's initials
 * @param {number} index - The index of the contact
 * @returns {string} HTML string
 */
function editAddSelfTemplate(name, initials, index) {
    return `<div id='edit-contact${index}' class="edit-dropdown-box" onclick='editSelectContact(${index})'>
                <div class="edit-contact-initials">
                    <p>${initials}</p>
                </div>
                <div class="edit-contact-name-checkbox">
                    <p class="edit-contact-fullname">${name} (You)</p>
                    <img id="edit-checkbox${index}" class="checkbox" src="./assets/img/checkbox_inactive.svg" alt="checkbox">
                </div>
            </div>`;
}

/**
 * Template for adding other contacts to assignment dropdown in edit task overlay.
 * @param {string} name - The contact's name
 * @param {string} initials - The contact's initials
 * @param {number} index - The index of the contact
 * @returns {string} HTML string
 */
function editAddTaskContactTemplate(name, initials, index) {
    return `<div id='edit-contact${index}' class="edit-dropdown-box" onclick='editSelectContact(${index})'>
                <div class="edit-contact-initials">
                    <p>${initials}</p>
                </div>
                <div class="edit-contact-name-checkbox">
                    <p class="edit-contact-fullname">${name}</p>
                    <img id="edit-checkbox${index}" class="checkbox" src="./assets/img/checkbox_inactive.svg" alt="checkbox">
                </div>
            </div>`;
}

/**
 * Template for contact initials in assigned contacts section in edit task overlay.
 * @param {string} initials - The contact's initials
 * @returns {string} HTML string
 */
function editAddInitialTemplate(initials) {
    return `     <div class="chosen-contact-initials">
                    <p>${initials}</p>
                </div>`;
}

/**
 * Template for number of extra assigned people in edit task overlay.
 * @param {number} number - The number of extra people
 * @returns {string} HTML string
 */
function editAddNumberOfExtraPeople(number) {
    return `<p>+${number}</p>`;
}

/**
 * Template for new Subtasks in edit overlay.
 * @param {HTMLInputElement} subtasks - The subtask input element
 * @param {number} subtaskIndex - The index of the subtask
 * @returns {string} HTML string
 */
function editAddSubtaskTemplate(subtasks, subtaskIndex) {
    return `<div id="task${subtaskIndex}" class="edit-subtask-element-box">  
                <li id="li-task${subtaskIndex}" class="edit-subtask-element" onclick="editSubtaskEditing('task${subtaskIndex}')">
                    ${subtasks.value}
                </li>

                <div class="edit-subtask-list-button-container">
                    <div class="edit-subtask-button" onclick="editSubtaskEditing('task${subtaskIndex}')">
                        <img class="edit-subtask-list-button" src="./assets/img/add_task/edit.svg" alt="Edit">
                    </div>

                    <img src="./assets/img/add_task/Vector 3.svg" alt="Divider">

                    <div class="edit-subtask-button" onclick="editDeleteSubtaskListElement('task${subtaskIndex}')">
                        <img class="edit-subtask-list-button" src="./assets/img/add_task/delete.svg" alt="Delete">
                    </div>
                </div>
            </div>`;
}

/**
 * Template for edited Subtasks in edit overlay.
 * @param {string} taskId - The valid ID of the subtask
 * @param {string} newText - The new text
 * @returns {string} HTML string
 */
function editEditedSubtaskTemplate(taskId, newText) {
    return `<li id="li-${taskId}" class="edit-subtask-element" onclick="editSubtaskEditing('${taskId}')">
                ${newText}
            </li>
            <div class="edit-subtask-list-button-container">
                <div class="edit-subtask-button" onclick="editSubtaskEditing('${taskId}')">
                    <img class="edit-subtask-list-button" src="./assets/img/add_task/edit.svg" alt="Edit">
                </div>
                <img src="./assets/img/add_task/Vector 3.svg" alt="Divider">
                <div class="edit-subtask-button" onclick="editDeleteSubtaskListElement('${taskId}')">
                    <img class="edit-subtask-list-button" src="./assets/img/add_task/delete.svg" alt="Delete">
                </div>
            </div>`;
}