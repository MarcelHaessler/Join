// Template for adding logged-in user to assignment dropdown
function addSelfTemplate(name, initials, index) {
    return `<div id='contact${index}' class="dropdown-box" onclick='selectContact(${index})'>
                <div class="contact-initials">
                    <p>${initials}</p>
                </div>
                <div class="contact-name-checkbox">
                    <p class="contact-fullname">${name} (You)</p>
                    <img id="checkbox${index}" class="checkbox" src="./assets/img/checkbox_inactive.svg" alt="checkbox">
                </div>
            </div>`
}


// Template for adding other contacts to assignment dropdown
function addTaskContactTemplate(name, initials, index) {
    return `<div id='contact${index}' class="dropdown-box" onclick='selectContact(${index})'>
                <div class="contact-initials">
                    <p>${initials}</p>
                </div>
                <div class="contact-name-checkbox">
                    <p class="contact-fullname">${name}</p>
                    <img id="checkbox${index}" class="checkbox" src="./assets/img/checkbox_inactive.svg" alt="checkbox">
                </div>
            </div>`
}

// Template for contact initials in assigned contacts section
function addInitialTemplate(initials) {
    return `     <div class="chosen-contact-initials">
                    <p>${initials}</p>
                </div>`
}

// Template for number of extra assigned people
function addNumberOfExtraPeople(number) {
    return `<p>+${number}</p>`
}

function editAddNumberOfExtraPeople(number) {
    return `<p>+${number}</p>`
}

// Template for new Subtasks
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
                                </div>`
}


// Template for edited Subtasks
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
        `
}


// Small Task Card Template
function generateTodoHTML(element) {
    let initialsHTML = ''; let progressHTML = ``;
    let taskColor; let completedSubtasks;
    let totalSubtasks; let progressValue;

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


// Opened Task Card Template
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


// Function to add assigned persons to opened task card
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


// Function to add subtasks to opened task card
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


// Edit Task Card Template
function generateEditTaskHTML(element, taskId) {
    let title = element.title;
    let description = element.description;
    let date = element.date;
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
                            <input id="edit-date" type="text" placeholder="dd/mm/yyyy" maxlength="10" value="${date}" oninput="formatEditDateInput(event)">
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


// Template for adding logged-in user to assignment dropdown in edit task overlay
function editAddSelfTemplate(name, initials, index) {
    return `<div id='edit-contact${index}' class="edit-dropdown-box" onclick='editSelectContact(${index})'>
                <div class="edit-contact-initials">
                    <p>${initials}</p>
                </div>
                <div class="edit-contact-name-checkbox">
                    <p class="edit-contact-fullname">${name} (You)</p>
                    <img id="edit-checkbox${index}" class="checkbox" src="./assets/img/checkbox_inactive.svg" alt="checkbox">
                </div>
            </div>`
}


// Template for adding other contacts to assignment dropdown in edit task overlay
function editAddTaskContactTemplate(name, initials, index) {
    return `<div id='edit-contact${index}' class="edit-dropdown-box" onclick='editSelectContact(${index})'>
                <div class="edit-contact-initials">
                    <p>${initials}</p>
                </div>
                <div class="edit-contact-name-checkbox">
                    <p class="edit-contact-fullname">${name}</p>
                    <img id="edit-checkbox${index}" class="checkbox" src="./assets/img/checkbox_inactive.svg" alt="checkbox">
                </div>
            </div>`
}


// Template for contact initials in assigned contacts section in edit task overlay
function editAddInitialTemplate(initials) {
    return `     <div class="chosen-contact-initials">
                    <p>${initials}</p>
                </div>`
}

// Template for number of extra assigned people in edit task overlay
function editAddNumberOfExtraPeople(number) {
    return `<p>+${number}</p>`
}

// Template für neue Subtasks
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


// Template für bearbeitete Subtasks
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


// Function to generate assigned contacts initials on small task cards
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


// Function to generate subtask progress on small task cards
function generateSubtaskProgressHTML(subtasks) {
    if (!subtasks || subtasks.length === 0) {
        return '';
    }
    const completed = subtasks.filter(subtask => subtask.subtaskComplete).length;
    console.log('completed: ' + completed);
    const total = subtasks.length;
    const progressValue = (completed / total) * 100;

    return `
        <progress value="${progressValue}" max="100"></progress>
        <span class="subtasks-counter">${completed}/${total} Subtasks</span>
    `;
}

function generateMoveMenu(taskId) {
    return `
        <div onclick="moveToFromMobile(event, '${taskId}', 'ToDo')">To Do</div>
        <div onclick="moveToFromMobile(event, '${taskId}', 'InProgress')">In Progress</div>
        <div onclick="moveToFromMobile(event, '${taskId}', 'Awaiting')">Await Feedback</div>
        <div onclick="moveToFromMobile(event, '${taskId}', 'Done')">Done</div>
    `;
}
