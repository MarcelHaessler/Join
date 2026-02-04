/**
 * User initials for display
 * @type {string}
 */
let userInitials = '';

/**
 * Current username
 * @type {string}
 */
let username = '';

/**
 * Current task group/board column
 * @type {string}
 */
let taskGroup = "ToDo"

window.addEventListener("userReady", async (auth) => {
    username = auth.detail.name
    if (window.fetchContacts) {
        await fetchContacts();
    }
    if (window.contacts && Array.isArray(window.contacts)) {
        putSelfOnFirstPlace(username);
    }
    userInitials = username.charAt(0).toUpperCase() + username.charAt(username.indexOf(" ") + 1).toUpperCase();
    addInitialToHeader();
    if (window.fillAssignmentDropdown) {
        fillAssignmentDropdown();
    }
});

window.addEventListener("guestUser", async (auth) => {
    try {
        username = auth && auth.detail && auth.detail.name ? auth.detail.name : 'Guest';
        if (window.fetchContacts) await fetchContacts();
        if (window.contacts && Array.isArray(window.contacts)) {
            putSelfOnFirstPlace(username);
        }
        userInitials = username.charAt(0).toUpperCase() + (username.indexOf(" ") > -1 ? username.charAt(username.indexOf(" ") + 1).toUpperCase() : "");
        addInitialToHeader();
        if (window.fillAssignmentDropdown) fillAssignmentDropdown();
    } catch (err) {
        // Silent error handling
    }
});

function addInitialToHeader() {
    let initialSpace = document.getElementById('user-initials');
    initialSpace.innerHTML = userInitials;
}

/**
 * Moves the current user to the first position in contacts array
 * @param {string} username - The username to move to first position
 * @returns {void}
 */
function putSelfOnFirstPlace(username) {
    if (!window.contacts || !Array.isArray(window.contacts)) return;
    let array = contacts.findIndex(e => e.name == username);
    if (array !== -1) contacts.unshift(...contacts.splice(array, 1));
}

/**
 * Checks if all required task fields are filled before submission
 * @returns {void}
 */
function checkFullfilledRequirements() {
    let taskData = collectTaskData();

    if (hasEmptyRequiredFields(taskData)) {
        showValidationWarnings();
        return;
    }
    processTaskCreation(taskData);
}

/**
 * Collects all task data from form fields
 * @returns {Object} Object containing all task field values
 */
function collectTaskData() {
    return {
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim(),
        dueDate: document.getElementById('date').value,
        priority: currentPriotity,
        category: currentCategory,
        assignments: selectedContacts,
        subtasks: subtaskListArray || []
    };
}

function hasEmptyRequiredFields(taskData) {
    return taskData.title === '' || taskData.description === '' || taskData.dueDate === '' || currentCategory === '';
}

function showValidationWarnings() {
    checkTitle();
    checkDescription();
    checkDate();
    checkCategory();
}

function processTaskCreation(taskData) {
    uploadTask(taskData.title, taskData.description, taskData.dueDate, taskData.priority, taskData.category, taskGroup, taskData.assignments, taskData.subtasks);
    clearTask();
    userResponseMessage();
    setTimeout(goToBoard, 500);
}

function createTaskObject(taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory, taskGroup, taskAssignments, taskSubtasks) {
    return {
        title: taskTitle,
        description: taskDescription,
        date: taskDueDate,
        priority: taskPriority,
        category: taskCategory,
        assignedPersons: taskAssignments,
        subtasks: taskSubtasks.map(subtask => ({
            text: subtask,
            subtaskComplete: false
        })),
        createdAt: new Date().toISOString(),
        taskGroup: taskGroup,
        createdBy: username
    }
}

function clearTask() {
    clearInputFields();
    resetPriority();
    resetContacts();
    resetSubtasks();
    clearWarnings();
}

function clearInputFields() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
    document.getElementById('category').value = '';
    currentCategory = '';
}

function resetPriority() {
    currentPriotity = 'medium';
    defaultPriority();
}

function resetContacts() {
    selectedContacts = [];
    renderSelectedContacts();
    resetAssignmentSelection();
}

function resetSubtasks() {
    subtaskListArray = [];
    subtaskIndex = 0;
    document.getElementById('subtask-list').innerHTML = '';
    document.getElementById('subtasks').value = '';
}

function resetAssignmentSelection() {
    document.querySelectorAll('.dropdown-box').forEach(box => {
        box.classList.remove('selected-contact');
    });

    document.querySelectorAll('[id^="checkbox"]').forEach(cb => {
        cb.src = './assets/img/checkbox_inactive.svg';
        cb.classList.remove('checkbox-active');
    });
}

function clearWarnings() {
    document.querySelectorAll('.invalid').forEach(el => {
        el.classList.remove('invalid');
    });

    document.querySelectorAll('[id$="-warning"]').forEach(warn => {
        warn.innerHTML = '';
    });
}

function userResponseMessage() {
    let messageContainer = document.getElementById('task-message');
    messageContainer.classList.add('active');
}

function goToBoard() {
    window.location.href = "board.html";
}