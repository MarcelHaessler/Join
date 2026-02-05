/**
 * Templates for the Kanban Board, Task Cards, and Edit Overlays
 */

/**
 * Generates HTML for a small task card on the board.
 * @param {Object} element - The task object
 * @returns {string} HTML string for the task card
 */
function generateTodoHTML(element) {
    let initialsHTML = '';
    let progressHTML = ``;
    let taskColor;

    initialsHTML = generateOptionHTML(element);

    taskColor = element.category === "User Story"
        ? 'var(--taskColor1)'
        : 'var(--taskColor2)';

    progressHTML = generateSubtaskProgressHTML(element.subtasks);

    return `
    <div draggable="true" ondragstart="startDragging('${element.id}', event)" onclick="openTaskCardOverlay('${element.id}')" class="taskCard">
        <div>
            <div class="task-header-mobile">
                <label class="label-user-story" for="" style="background-color: ${taskColor};">${element.category}</label>
                <div class="mobile-move-btn" onclick="toggleMobileMoveMenu(event, '${element.id}')">
                   <img src="./assets/img/arrow_drop_down.svg" alt="Move">
                </div>
                <div id="mobile-menu-${element.id}" class="mobile-move-menu d_none">
                    ${generateMoveMenu(element.id)}
                </div>
            </div>
            <h4 class="task-title">${element.title}</h4>
            <p class="task-content">${element.description}</p>
            <div class="subtasks-container">
                ${progressHTML}
            </div>
            <div class="tile-footer">
                <div class="assigned-contacts">
                    ${initialsHTML}               
                </div>
                <div class="priority">
                    <img src="./assets/img/add_task/${element.priority}.svg" alt="${element.priority}">
                </div>
            </div>
        </div>
    </div>`;
}

/**
 * Generates HTML for the detailed opened task card overlay.
 * @param {Object} element - The task object
 * @returns {string} HTML string for the opened task card
 */
function generateOpenedTaskCardHTML(element) {
    let taskColor;

    if (element.category == "User Story") {
        taskColor = 'var(--taskColor1)';
    } else {
        taskColor = 'var(--taskColor2)';
    }
    return `    <section onclick="stopPropagation(event)" id="task-card">
                    <div id="task-card-head">
                        <div style="background-color: ${taskColor};" id="task-category-box">
                            <p id="task-category-text">${element.category}</p>
                        </div>
                        <div id="close-task-card-button" onclick="closeTaskCardOverlay()" >
                            <img src="./assets/img/add_task/close.svg" alt="close-task-card">
                        </div>
                    </div>
                    <h3 id="task-title">${element.title}</h3>
                    <p id="task-description">${element.description}</p>
                    <div id="task-due-date-container">
                        <p>Due date:</p>
                        <p id="due-date">${element.date}</p>
                    </div>
                    <div id="task-priority-container">
                        <p>Priority:</p>
                        <div id="task-priority">
                            <p id="priority-level">${element.priority}</p>
                            <img src="./assets/img/add_task/${element.priority}.svg" alt="${element.priority}">
                        </div>
                    </div>
                    <div id="task-assignment-container">
                        <p>Assigned to:</p>
                        <div id="assigned-contacts">
                            ${addAssignedPersons(element)}
                        </div>
                    </div>
                    <div id="task-subtasks">
                        <p>Subtasks:</p>
                        <div>
                            ${addSubtasks(element, tasks.indexOf(element))}
                        </div>
                    </div>
                    <div id="task-card-bottom">
                        <div onclick="deleteTask('${element.id}')" id="delete-task">
                            <img id="task-button-icon-delete" src="./assets/img/add_task/delete.svg" alt="delete-task">
                            <p>Delete</p>
                        </div>
                        <img src="./assets/img/add_task/Vector 3.svg" alt="divider">
                        <div onclick="editTask('${element.id}')" id="edit-task">
                            <img id="task-button-icon-edit" src="./assets/img/add_task/edit.svg" alt="edit-task">
                            <p>Edit</p>
                        </div>
                    </div>
                </section>`;
}

/**
 * Adds assigned persons to the opened task card.
 * @param {Object} element - The task object
 * @returns {string} HTML string for assigned persons
 */
function addAssignedPersons(element) {
    let assignedContainer = '';
    let names = element.assignedPersons;

    if (!names || names.length === 0) {
        return ``;
    } else {
        for (let index = 0; index < names.length; index++) {
            const person = names[index];
            assignedContainer += `
        <div class="assigned-person">
            <div class="contact-initials" style="background-color: ${backgroundColorCodes[person.colorIndex]};"">
                <p>${person.initials}</p>
            </div>
            <p class="assigned-person-name">${person.name}</p>
        </div>
        `;
        }
        return assignedContainer;
    }
}

/**
 * Adds subtasks to the opened task card.
 * @param {Object} element - The task object
 * @param {number} taskIndex - The index of the task in the global array
 * @returns {string} HTML string for subtasks
 */
function addSubtasks(element, taskIndex) {
    let subtasksContainer = '';
    let subtasks = element.subtasks;

    if (!subtasks || subtasks.length === 0) {
        return `<p>No subtasks available.</p>`;
    } else {

        for (let index = 0; index < subtasks.length; index++) {
            const subtask = subtasks[index].text;
            const active = "./assets/img/checkbox_inactive.svg";
            const inactive = "./assets/img/checkbox_active.svg";

            if (subtasks[index].subtaskComplete) {
                subtasksContainer += `
            <div id="subtask-${index}" class="subtask">
                <img onclick="checkboxSubtask(${index}, ${taskIndex})" class="subtask-checkbox" id="subtask-checkbox-${index}" src="${inactive}" alt="checkbox-active">
                <p>${subtask}</p>
            </div>
            `;
            } else {
                subtasksContainer += `
            <div id="subtask-${index}" class="subtask">
                <img onclick="checkboxSubtask(${index}, ${taskIndex})" class="subtask-checkbox" id="subtask-checkbox-${index}" src="${active}" alt="checkbox-inactive">
                <p>${subtask}</p>
            </div>
            `;
            }
        }
        return subtasksContainer;
    }
}

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

/**
 * Generates assigned contacts initials for small task cards.
 * @param {Object} element - The task object
 * @returns {string} HTML string
 */
function generateOptionHTML(element) {
    if (element.assignedPersons && element.assignedPersons.length > 0) {
        let contactsToDisplay = element.assignedPersons.slice(0, 3);
        let extraCount = element.assignedPersons.length - 3;

        let html = contactsToDisplay.map(person => `
            <div class="contact-initials" style="background-color: ${backgroundColorCodes[person.colorIndex]};">
                <p>${person.initials}</p>
            </div>
        `).join('');

        if (extraCount > 0) {
            html += `
                <div class="contact-initials" style="background-color: #2A3647;">
                    <p>+${extraCount}</p>
                </div>
            `;
        }
        return html;
    }
    return '';
}

/**
 * Generates subtask progress bar for small task cards.
 * @param {Array} subtasks - The array of subtasks
 * @returns {string} HTML string for progress bar
 */
function generateSubtaskProgressHTML(subtasks) {
    if (!subtasks || subtasks.length === 0) {
        return '';
    }
    const completed = subtasks.filter(subtask => subtask.subtaskComplete).length;
    const total = subtasks.length;
    const progressValue = (completed / total) * 100;

    return `
        <progress value="${progressValue}" max="100"></progress>
        <span class="subtasks-counter">${completed}/${total} Subtasks</span>
    `;
}

/**
 * Generates the move menu for mobile devices.
 * @param {string} taskId - The ID of the task
 * @returns {string} HTML string for the move menu
 */
function generateMoveMenu(taskId) {
    return `
        <div onclick="moveToFromMobile(event, '${taskId}', 'ToDo')">To Do</div>
        <div onclick="moveToFromMobile(event, '${taskId}', 'InProgress')">In Progress</div>
        <div onclick="moveToFromMobile(event, '${taskId}', 'Awaiting')">Await Feedback</div>
        <div onclick="moveToFromMobile(event, '${taskId}', 'Done')">Done</div>
    `;
}

/**
 * Helper function to convert date from dd/mm/yyyy to yyyy-MM-dd.
 * @param {string} dateString - The date string to convert
 * @returns {string} ISO formatted date string
 */
function convertDateToISO(dateString) {
    if (!dateString) return '';

    // Check if already in ISO format (yyyy-MM-dd)
    if (dateString.match(/^\\d{4}-\\d{2}-\\d{2}$/)) {
        return dateString;
    }

    // Convert from dd/mm/yyyy to yyyy-MM-dd
    const parts = dateString.split('/');
    if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    return dateString;
}
