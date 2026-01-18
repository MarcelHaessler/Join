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
    return`     <div class="chosen-contact-initials">
                    <p>${initials}</p>
                </div>`
}

function addNumberOfExtraPeople(number){
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
    <div draggable="true" ondragstart="startDragging('${element.id}')" class="taskCard">
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

function generateOptionHTML(element) {
    if (element.assignedPersons && element.assignedPersons.length > 0) {
        return element.assignedPersons
            .map(person => `
                <div class="contact-initials" style="background-color: var(--color${person.colorIndex});">
                    <p>${person.initials}</p>
                </div>
            `)
            .join('');
    }
    return '';
}

function generateSubtaskProgressHTML(subtasks) {
    if (!subtasks || subtasks.length === 0) {
        return '';
    }
    const completed = subtasks.filter(subtask => subtask.completed).length;
    const total = subtasks.length;
    const progressValue = (completed / total) * 100;

    return `
        <progress value="${progressValue}" max="100"></progress>
        <span class="subtasks-counter">${completed}/${total} Subtasks</span>
    `;
}