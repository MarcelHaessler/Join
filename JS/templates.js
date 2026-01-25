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

function addInitialTemplate(initials) {
    return `     <div class="chosen-contact-initials">
                    <p>${initials}</p>
                </div>`
}

function addNumberOfExtraPeople(number) {
    return `<p>+${number}</p>`
}

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
            <label class="label-user-story" for="" style="background-color: ${taskColor};">${element.category}</label>
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
                    <h2 id="task-title">${element.title}</h2>
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
                        <div id="delete-task">
                            <img src="./assets/img/add_task/delete.svg" alt="delete-task">
                            <p>Delete</p>
                        </div>
                        <img src="./assets/img/add_task/Vector 3.svg" alt="divider">
                        <div id="edit-task">
                            <img src="./assets/img/add_task/edit.svg" alt="edit-task">
                            <p>Edit</p>
                        </div>
                    </div>
                </section>`;
}

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
            <div class="contact-initials" style="background-color: var(--color${person.colorIndex});">
                <p>${person.initials}</p>
            </div>
            <p class="assigned-person-name">${person.name}</p>
        </div>
        `;
        }
        return assignedContainer;
    }
}

function addSubtasks(element, taskIndex) {
    let subtasksContainer = '';
    let subtasks = element.subtasks;

    if (!subtasks || subtasks.length === 0) {
        return `<p>No subtasks available.</p>`;
    } else {

        for (let index = 0; index < subtasks.length; index++) {
            const subtask = subtasks[index].text;
            subtasksContainer += `
            <div onclick="checkboxSubtask(${index}, ${taskIndex})" id="subtask-${index}" class="subtask">
                <img id="subtask-checkbox-${index}" src="./assets/img/checkbox_inactive.svg" alt="checkbox-inactive">
                <p>${subtask}</p>
            </div>
            `;
        }
    }
    return subtasksContainer;
}

function generateOptionHTML(element) {
    if (element.assignedPersons && element.assignedPersons.length > 0) {
        let contactsToDisplay = element.assignedPersons.slice(0, 3);
        let extraCount = element.assignedPersons.length - 3;

        let html = contactsToDisplay.map(person => `
            <div class="contact-initials" style="background-color: var(--color${person.colorIndex});">
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
