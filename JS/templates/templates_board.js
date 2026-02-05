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


