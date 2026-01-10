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


// Task Card Template
function generateTodoHTML(element) {
    let initialsHTML = '';
    let taskColor;
    
    if (element.assignedPersons && element.assignedPersons.length > 0) {
        initialsHTML = element.assignedPersons.map(Persons => {
            return `
            <div class="contact-initials" style="background-color: var(--color${Persons.colorIndex});">
                <p>${Persons.initials}</p>
            </div>
            `;
        }).join('');
    }

    if (element.category == "User Story") {
        taskColor = 'var(--taskColor1)';
    } else {
        taskColor = 'var(--taskColor2)';
    }
    
    return `
    <div draggable="true" ondragstart="startDragging('${element.id}')" class="taskCard">
        <div>
            <label class="label-user-story" for="" style="background-color: ${taskColor};">${element.category}</label>
            <h4 class="task-title">${element.title}</h4>
            <p class="task-content">${element.description}</p>
            <div class="subtasks-container">
                <img src="./assets/img/filler.svg" alt="" class="filler">
                <p class="subtasks-counter">1/2</p>
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