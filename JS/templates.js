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

function addTaskTemplate() {
    return `    <div id="content-section">
        <div id="main-container">
            <div id="top-section">
                <h2>Add Task</h2>
                
                <div id="form-container">
                    <div id="form-left">
                        <div class="input-container" id="title-container">                    
                            <label for="title">Title <p class="red-star">*</p></label>
                            <input id="title" type="text" placeholder="Enter a Title">
                            <p class="warning-message" id="title-warning"></p>
                        </div>
                        <div class="input-container" id="description-container">
                            <label for="description">Description<p class="red-star">*</p></label>
                            <textarea name="description" id="description" placeholder="Enter a Description"></textarea>
                            <p class="warning-message" id="description-warning"></p>
                        </div>
                        <div class="input-container" id="date-container">
                            <label for="date">Due date<p class="red-star">*</p></label>
                            <input id="date" type="text" placeholder="dd/mm/yyyy" maxlength="10">
                            <p class="warning-message" id="date-warning"></p>
                        </div>
                    </div>

                    <div id="separator"></div>

                    <div id="form-right">
                        <div id="priority-container">
                            <label for="form-buttons">Priority</label>
                            <div class="input-container" id="form-buttons">
                                <button id="urgent-btn" class="priority-buttons">
                                    <p>Urgent</p>
                                    <img id="urgent-img" src="./assets/img/add_task/urgent.svg" alt="Urgent">
                                </button>
                                <button id="medium-btn" class="priority-buttons">
                                    <p>Medium</p>
                                    <img id="medium-img" src="./assets/img/add_task/medium.svg" alt="Medium">
                                </button>
                                <button id="low-btn" class="priority-buttons">
                                    <p>Low</p>
                                    <img id="low-img" src="./assets/img/add_task/low.svg" alt="Low">
                                </button>
                            </div>
                        </div>
                        <div class="input-container" id="assignment-container">
                            <label for="assign-input">Assigned to</label>
                            <div id="assign-input-box">
                                <input id="assign-input" oninput="delaySearchContact()" onclick="renderAssignmentDropdown(), addInitialsBackgroundColors()" type="text" placeholder="Select contacts to assign">
                                <div onclick="renderAssignmentDropdown(), addInitialsBackgroundColors()" class="dropdown-img-container">
                                    <img class="dropdown-img" id="assignment-arrow" src="./assets/img/add_task/arrow_drop_down.svg" alt="Open Contact List">
                                </div>
                            </div>
                            <div id="contacts-dropdown"></div>
                            <div id="chosen-contacts" class="d_none"></div>
                        </div>
                        <div class="input-container" id="category-container">
                            <label for="category">Category <p class="red-star">*</p></label>
                            <div id="category-input">
                                <input onclick="openCloseCategoryDropdown()" type="text" id="category" placeholder="Select task category" readonly>
                                <div onclick="openCloseCategoryDropdown()" class="dropdown-img-container">
                                    <img class="dropdown-img" id="category-arrow" src="./assets/img/add_task/arrow_drop_down.svg" alt="Open Category List">
                                </div>
                            </div>
                            <div id="category-dropdown">
                                <div onclick="choseTechnicalTask()" class="dropdown-box">
                                    Technical Task
                                </div>
                                <div onclick="choseUserStory()" class="dropdown-box">
                                    User Story
                                </div>
                            </div>
                            <p class="warning-message" id="category-warning"></p>
                        </div>

                        <label for="subtasks">Subtasks</label>
                        <div id="subtask-input-wrapper">    
                            <input onkeyup="showHideSubtaskButtons()" type="text" name="subtasks" id="subtasks" placeholder="Add new subtask">
                            <div class="d_none" id="subtask-button-container">
                                <div onclick="clearInputField()" class="subtask-button">
                                    <img id="clear-button" src="./assets/img/add_task/close.svg" alt="Clear">
                                </div>
                                <img src="./assets/img/add_task/Vector 3.svg" alt="Divider">
                                <div onclick="addSubtaskToList()" class="subtask-button">
                                    <img id="accept-button" src="./assets/img/add_task/check.svg" alt="Accept">
                                </div>
                            </div>
                        </div>
                        <div id="subtask-list-container">
                            <ul id="subtask-list"></ul>
                        </div>  
                    </div>
                </div>
            </div>
            <div id="bottom-section">
                <div id="required-info"><p class="red-star">*</p><p>This field is required</p></div>
                <div id="bottom-button-container">
                    <button id="clear-task-button" onclick="clearTask()">
                        Clear
                        <img src="./assets/img/add_task/close.svg" alt="Clear">
                    </button>
                    <button id="create-task-button" onclick="checkFullfilledRequirements()">
                        Create Task
                        <img src="./assets/img/add_task/check.svg" alt="Accept">
                    </button>
                </div>
            </div>
        </div>
    </div>
`
}