/**
 * Logic for the Task Cards and Overlays on the Board.
 * Handles opening/closing overlays, updating tasks, and subtask interactions.
 */

/**
 * Updates a task in Firebase or LocalStorage (fallback).
 * @async
 * @param {Object} task - The task object to update.
 * @returns {Promise<void>}
 */
async function updateTask(task) {
    try {
        await updateTaskInFirebase(task);
        updateBoard();
    } catch (error) {
        updateTaskInLocalStorage(task);
        updateBoard();
    }
}

/**
 * Creates the update object for Firebase task update
 * @param {Object} task - The task object
 * @returns {Object} The update object for Firebase
 */
function createTaskUpdateObject(task) {
    const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
    return {
        title: task.title || '',
        description: task.description || '',
        date: task.date || '',
        priority: task.priority || '',
        assignedPersons: task.assignedPersons || [],
        category: task.category || '',
        taskGroup: task.taskGroup,
        subtasks: subtasks.map(s => ({ text: s.text || '', subtaskComplete: !!s.subtaskComplete }))
    };
}

/**
 * Updates a task in the Firebase Realtime Database.
 * @async
 * @param {Object} task - The task object with updated data.
 * @returns {Promise<void>}
 */
async function updateTaskInFirebase(task) {
    const taskRef = db.ref(`tasks/${task.id}`);
    const updateData = createTaskUpdateObject(task);
    await taskRef.update(updateData);
}

/**
 * Updates a task in the local storage (fallback if offline).
 * @param {Object} task - The task object with updated data.
 * @returns {void}
 */
function updateTaskInLocalStorage(task) {
    const tasksData = localStorage.getItem('join_tasks');
    if (tasksData) {
        let localTasks = JSON.parse(tasksData);
        const index = localTasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
            localTasks[index] = task;
            localStorage.setItem('join_tasks', JSON.stringify(localTasks));
            window.tasks = localTasks;
        }
    }
}

/**
 * Opens the task card overlay for a specific task.
 * @param {string} taskId - The ID of the task to display.
 * @returns {void}
 */
function openTaskCardOverlay(taskId) {
    const tasks = window.tasks || [];
    const task = tasks.find(t => t.id === taskId);
    let overlay = document.getElementById('task_card_overlay');
    overlay.classList.remove('d_none');
    setTimeout(() => {
        overlay.classList.remove('closing');
        overlay.classList.add('active');
    }, 10);
    overlay.innerHTML = generateOpenedTaskCardHTML(task);
}

/**
 * Closes the currently open task card overlay.
 * @returns {void}
 */
function closeTaskCardOverlay() {
    const overlay = document.getElementById('task_card_overlay');
    overlay.classList.add('closing');
    setTimeout(() => {
        overlay.classList.remove('active', 'closing');
        overlay.innerHTML = '';
    }, 400);
}

/**
 * Stops event propagation to prevent bubble-up clicks.
 * @param {Event} event - The DOM event.
 * @returns {void}
 */
function stopPropagation(event) {
    event.stopPropagation(event);
}

/**
 * Toggles the completion status of a subtask within a task card.
 * @param {number} subtaskIndex - Index of the subtask.
 * @param {number} taskIndex - Index of the task in the global array.
 * @returns {void}
 */
function checkboxSubtask(subtaskIndex, taskIndex) {
    const subtask = tasks[taskIndex].subtasks[subtaskIndex];
    subtask.subtaskComplete = !subtask.subtaskComplete;

    const checkbox = document.getElementById(`subtask-checkbox-${subtaskIndex}`);
    const imgPath = subtask.subtaskComplete
        ? './assets/img/checkbox_active.svg'
        : './assets/img/checkbox_inactive.svg';

    checkbox.src = imgPath;

    updateTask(tasks[taskIndex]);
    updateBoard();
}

/**
 * Toggles a subtask's completion status (Helper function).
 * @param {number} subtaskIndex - Index of the subtask.
 * @param {number} taskIndex - Index of the task.
 * @returns {void}
 */
function subtaskCompleted(subtaskIndex, taskIndex) {
    const subtask = tasks[taskIndex].subtasks[subtaskIndex];
    if (subtask.subtaskComplete === false) {
        subtask.subtaskComplete = true;
    } else {
        subtask.subtaskComplete = false;
    }
    updateTask(tasks[taskIndex]);
    updateBoard();
}

/**
 * Opens the edit overlay for a specific task.
 * @param {string} taskId - The ID of the task to edit.
 * @returns {void}
 */
function editTask(taskId) {
    const tasks = window.tasks || [];
    const task = tasks.find(t => t.id == taskId);
    if (!task) return;

    storeTaskData(task);
    displayEditOverlay(task, taskId);
    initializeEditComponents(task);
}

/**
 * Stores current task data into global edit variables.
 * @param {Object} task - The task object.
 * @returns {void}
 */
function storeTaskData(task) {
    editedTitle = task.title;
    editedDescription = task.description;
    editedDueDate = task.date;
}

/**
 * Displays the edit task HTML in the overlay.
 * @param {Object} task - The task object.
 * @param {string} taskId - The task ID.
 * @returns {void}
 */
function displayEditOverlay(task, taskId) {
    let overlay = document.getElementById('task_card_overlay');
    overlay.innerHTML = generateEditTaskHTML(task, taskId);
}

/**
 * Initializes all the interactive components for the edit mode.
 * @param {Object} task - The task object.
 * @returns {void}
 */
function initializeEditComponents(task) {
    setTimeout(() => {
        setupEditPriority(task);
        setupEditAssignments(task);
        setupEditDateValidation();
        finalizeEditSetup(task);
    }, 10);
}

/**
 * Sets up the priority buttons state for edit mode.
 * @param {Object} task - The task object.
 * @returns {void}
 */
function setupEditPriority(task) {
    checkTaskPriority(task.priority);
    window.currentPriority = task.priority;
}

/**
 * Sets up the assignment dropdown and initials for edit mode.
 * @param {Object} task - The task object.
 * @returns {void}
 */
function setupEditAssignments(task) {
    fillEditAssignmentDropdown();
    editAddInitialsBackgroundColors();
}

/**
 * Sets up date validation for the edit mode (e.g. min date = today).
 * @returns {void}
 */
function setupEditDateValidation() {
    const editDateInput = document.getElementById('edit-date');
    if (editDateInput) {
        const today = new Date().toISOString().split('T')[0];
        editDateInput.setAttribute('min', today);
        editDateInput.addEventListener('blur', editCheckDate);
    }
}

/**
 * Final configuration steps for edit mode components (Contacts, Category, Subtasks).
 * @param {Object} task - The task object.
 * @returns {void}
 */
function finalizeEditSetup(task) {
    requestAnimationFrame(() => {
        activateAddedContacts(task);
        editRenderSelectedContacts();
        activateChosenCategory(task);
        showExistingSubtasks(task);
    });
}

/**
 * Saves all changes made in the edit overlay and updates the task.
 * @param {string} taskId - The task ID.
 * @returns {void}
 */
function saveEditedTask(taskId) {
    if (editCheckDate() === true) return;

    editedTaskDetails();
    const tasks = window.tasks || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    updateTaskWithEditedData(tasks[taskIndex]);
    updateTask(tasks[taskIndex]);
    updateBoard();
    setTimeout(() => openTaskCardFromEdit(taskId), 300);
}

/**
 * Updates the local task object with values from edit variables.
 * Ensures initials are correctly calculated for all assigned persons.
 * @param {Object} task - The task object to update.
 * @returns {void}
 */

/**
 * Converts contacts to objects with initials
 * @param {Array} contacts - Array of contact objects
 * @returns {Array} Array of contacts with initials
 */
function mapContactsWithInitials(contacts) {
    return contacts.map(contact => {
        const parts = contact.name.trim().split(/\s+/);
        const first = parts[0][0];
        const last = parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] || "";
        return {
            ...contact,
            initials: (first + last).toUpperCase()
        };
    });
}

/**
 * Converts subtask objects to correct format
 * @param {Array} subtasks - Array of subtask objects
 * @returns {Array} Array of formatted subtasks
 */
function mapEditedSubtasks(subtasks) {
    return subtasks.map(obj => ({
        text: obj.text,
        subtaskComplete: !!obj.subtaskComplete
    }));
}

/**
 * Updates the local task object with values from edit variables.
 * Ensures initials are correctly calculated for all assigned persons.
 * @param {Object} task - The task object to update.
 * @returns {void}
 */
function updateTaskWithEditedData(task) {
    task.title = editedTitle;
    task.description = editedDescription;
    task.date = editedDueDate;
    task.priority = editedPriority;
    task.assignedPersons = mapContactsWithInitials(editSelectedContacts);
    task.category = editedCategory;
    task.subtasks = mapEditedSubtasks(editedSubtaskListArray);
}

/**
 * Captures input values (Title, Desc, Date) into edit variables.
 * @returns {void}
 */
function editedTaskDetails() {
    editSaveTitle();
    editSaveDescription();
    editSaveDueDate();
}

/**
 * Switches view from Edit Mode back to the Read-Only Task Card.
 * @param {string} taskId - The task ID.
 * @returns {void}
 */
function openTaskCardFromEdit(taskId) {
    const tasks = window.tasks || [];
    const task = tasks.find(t => t.id == taskId);
    let overlay = document.getElementById('task_card_overlay');
    overlay.innerHTML = generateOpenedTaskCardHTML(task);
}

/**
 * Deletes a task from the board and database.
 * @param {string} taskId - The task ID.
 * @returns {void}
 */
function deleteTask(taskId) {
    const tasks = window.tasks || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        window.tasks = tasks;
        localStorage.setItem('join_tasks', JSON.stringify(tasks));
        const taskRef = db.ref(`tasks/${taskId}`);
        taskRef.remove().catch(() => { });
    }
    updateBoard();
    closeTaskCardOverlay();
}