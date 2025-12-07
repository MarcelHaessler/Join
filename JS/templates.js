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