/**
 * Templates for the Add Task page
 */

/**
 * Template for adding the logged-in user to the assignment dropdown.
 * @param {string} name - The user's name
 * @param {string} initials - The user's initials
 * @param {number} index - The index of the contact
 * @returns {string} HTML string for the user entry
 */
function addSelfTemplate(name, initials, index) {
    return `<div id='contact${index}' class="dropdown-box" onclick='selectContact(${index})'>
                <div class="contact-initials">
                    <p>${initials}</p>
                </div>
                <div class="contact-name-checkbox">
                    <p class="contact-fullname">${name} (You)</p>
                    <img id="checkbox${index}" class="checkbox" src="./assets/img/checkbox_inactive.svg" alt="checkbox">
                </div>
            </div>`;
}

/**
 * Template for adding other contacts to the assignment dropdown.
 * @param {string} name - The contact's name
 * @param {string} initials - The contact's initials
 * @param {number} index - The index of the contact
 * @returns {string} HTML string for the contact entry
 */
function addTaskContactTemplate(name, initials, index) {
    return `<div id='contact${index}' class="dropdown-box" onclick='selectContact(${index})'>
                <div class="contact-initials">
                    <p>${initials}</p>
                </div>
                <div class="contact-name-checkbox">
                    <p class="contact-fullname">${name}</p>
                    <img id="checkbox${index}" class="checkbox" src="./assets/img/checkbox_inactive.svg" alt="checkbox">
                </div>
            </div>`;
}

/**
 * Template for contact initials in the assigned contacts section.
 * @param {string} initials - The contact's initials
 * @returns {string} HTML string for the initials circle
 */
function addInitialTemplate(initials) {
    return `     <div class="chosen-contact-initials">
                    <p>${initials}</p>
                </div>`;
}

/**
 * Template for displaying the count of extra assigned people.
 * @param {number} number - The number of extra people
 * @returns {string} HTML string for the count
 */
function addNumberOfExtraPeople(number) {
    return `<p>+${number}</p>`;
}

/**
 * Template for a new subtask item in the list.
 * @param {HTMLInputElement} subtasks - The input element containing the subtask text
 * @param {number} subtaskIndex - The index of the subtask
 * @returns {string} HTML string for the subtask item
 */
function addSubtaskTemplate(subtasks, subtaskIndex) {
    return `<div id="task${subtaskIndex}" class="subtask-element-box">  
                <li class="subtask-element" onclick="editSubtask('task${subtaskIndex}')">
                    ${subtasks.value}
                </li>

                <div class="subtask-list-button-container">
                    <div class="subtask-button" onclick="editSubtask('task${subtaskIndex}')">
                        <img class="subtask-list-button" src="./assets/img/add_task/edit.svg" alt="Edit">
                    </div>

                    <img src="./assets/img/add_task/Vector 3.svg" alt="Divider">

                    <div class="subtask-button" onclick="deleteSubtaskListElement('task${subtaskIndex}')">
                        <img class="subtask-list-button" id="delete-button" src="./assets/img/add_task/delete.svg" alt="Delete">
                    </div>
                </div>
            </div>`;
}

/**
 * Template for an edited subtask item.
 * @param {string} taskId - The ID of the subtask element
 * @param {string} newText - The new text for the subtask
 * @returns {string} HTML string for the edited subtask
 */
function editedSubtaskTemplate(taskId, newText) {
    return `
            <li class="subtask-element" onclick="editSubtask('${taskId}')">${newText}</li>
            <div class="subtask-list-button-container">
                <div class="subtask-button" onclick="editSubtask('${taskId}')">
                    <img class="subtask-list-button" src="./assets/img/add_task/edit.svg" alt="Edit">
                </div>
                <img src="./assets/img/add_task/Vector 3.svg" alt="Divider">
                <div class="subtask-button" onclick="deleteSubtaskListElement('${taskId}')">
                    <img class="subtask-list-button" id="delete-button" src="./assets/img/add_task/delete.svg" alt="Delete">
                </div>
            </div>
        `;
}
