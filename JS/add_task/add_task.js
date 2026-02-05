/**
 * Main logic for adding new tasks.
 * Coordinates data collection, validation, and submission of the task.
 */

/**
 * Current task group/board column
 * @type {string}
 */
let taskGroup = "ToDo"

/**
 * Event listener for when the user is authenticated and ready.
 * Loads contacts and user info.
 */
window.addEventListener("userReady", async (auth) => {
    const currentUserName = auth.detail.name;
    if (window.fetchContacts) {
        await fetchContacts();
    }
    if (window.contacts && Array.isArray(window.contacts)) {
        putSelfOnFirstPlace(currentUserName);
    }
    if (window.fillAssignmentDropdown) {
        fillAssignmentDropdown();
    }
});

/**
 * Event listener for guest user mode.
 */
window.addEventListener("guestUser", async (auth) => {
    try {
        const currentUserName = auth && auth.detail && auth.detail.name ? auth.detail.name : 'Guest';
        if (window.fetchContacts) await fetchContacts();
        if (window.contacts && Array.isArray(window.contacts)) {
            putSelfOnFirstPlace(currentUserName);
        }
        if (window.fillAssignmentDropdown) fillAssignmentDropdown();
    } catch (err) {
        // Silent error handling
    }
});

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
        priority: currentPriority, // Fixed typo
        category: currentCategory,
        assignments: selectedContacts,
        subtasks: subtaskListArray || []
    };
}

/**
 * Checks for missing required fields.
 * @param {Object} taskData - The collected task data.
 * @returns {boolean} True if any required field is missing.
 */
function hasEmptyRequiredFields(taskData) {
    return taskData.title === '' || taskData.description === '' || taskData.dueDate === '' || currentCategory === '';
}

/**
 * Triggers validation warnings for all inputs.
 * @returns {void}
 */
function showValidationWarnings() {
    checkTitle();
    checkDescription();
    checkDate();
    checkCategory();
}

/**
 * Processes the creation of a new task (upload, clear, notify, redirect).
 * @param {Object} taskData - The task data.
 * @returns {void}
 */
function processTaskCreation(taskData) {
    uploadTask(taskData.title, taskData.description, taskData.dueDate, taskData.priority, taskData.category, taskGroup, taskData.assignments, taskData.subtasks);
    clearTask();
    userResponseMessage();
    setTimeout(goToBoard, 500);
}

/**
 * Converts subtask strings to subtask objects
 * @param {Array} taskSubtasks - Array of subtask strings
 * @returns {Array} Array of subtask objects
 */
function createSubtaskObjects(taskSubtasks) {
    return taskSubtasks.map(subtask => ({
        text: subtask,
        subtaskComplete: false
    }));
}

/**
 * Creates the task object structure for Firebase.
 * @param {string} taskTitle - Title.
 * @param {string} taskDescription - Description.
 * @param {string} taskDueDate - Due date.
 * @param {string} taskPriority - Priority.
 * @param {string} taskCategory - Category.
 * @param {string} taskGroup - Initial column (e.g. ToDo).
 * @param {Array} taskAssignments - Assigned contacts.
 * @param {Array} taskSubtasks - Subtasks list.
 * @returns {Object} The task object.
 */
function createTaskObject(taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory, taskGroup, taskAssignments, taskSubtasks) {
    return {
        title: taskTitle,
        description: taskDescription,
        date: taskDueDate,
        priority: taskPriority,
        category: taskCategory,
        assignedPersons: taskAssignments,
        subtasks: createSubtaskObjects(taskSubtasks),
        taskGroup: taskGroup,
    }
}

/**
 * Resets the entire task form to default state.
 * @returns {void}
 */
function clearTask() {
    clearInputFields();
    resetPriority();
    resetContacts();
    resetSubtasks();
    clearWarnings();
}

/**
 * Clears global input fields.
 * @returns {void}
 */
function clearInputFields() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
    document.getElementById('category').value = '';
    currentCategory = '';
}

/**
 * Resets priority to Medium.
 * @returns {void}
 */
function resetPriority() {
    currentPriority = 'medium'; // Fixed typo
    defaultPriority();
}

/**
 * Resets contact selection.
 * @returns {void}
 */
function resetContacts() {
    selectedContacts = [];
    renderSelectedContacts();
    resetAssignmentSelection();
}

/**
 * Resets subtask list.
 * @returns {void}
 */
function resetSubtasks() {
    subtaskListArray = [];
    subtaskIndex = 0;
    document.getElementById('subtask-list').innerHTML = '';
    document.getElementById('subtasks').value = '';
}

/**
 * Resets visual state of the contact dropdown items.
 * @returns {void}
 */
function resetAssignmentSelection() {
    document.querySelectorAll('.dropdown-box').forEach(box => {
        box.classList.remove('selected-contact');
    });

    document.querySelectorAll('[id^="checkbox"]').forEach(cb => {
        cb.src = './assets/img/checkbox_inactive.svg';
        cb.classList.remove('checkbox-active');
    });
}

/**
 * Clears all validation warnings.
 * @returns {void}
 */
function clearWarnings() {
    document.querySelectorAll('.invalid').forEach(el => {
        el.classList.remove('invalid');
    });

    document.querySelectorAll('[id$="-warning"]').forEach(warn => {
        warn.innerHTML = '';
    });
}

/**
 * Shows the "Task added" success message.
 * @returns {void}
 */
function userResponseMessage() {
    let messageContainer = document.getElementById('task-message');
    if (messageContainer) {
        messageContainer.classList.add('active');
    }
}

/**
 * Redirects the user to the board page.
 * @returns {void}
 */
function goToBoard() {
    window.location.href = "board.html";
}