//Firebase-Update-Funktion
async function updateTask(task) {
    try {
        await updateTaskInFirebase(task);
        updateBoard();
    } catch (error) {
        updateTaskInLocalStorage(task);
        updateBoard();
    }
}

async function updateTaskInFirebase(task) {
    const taskRef = db.ref(`tasks/${task.id}`);
    const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];

    await taskRef.update({
        title: task.title || '',
        description: task.description || '',
        date: task.date || '',
        priority: task.priority || '',
        assignedPersons: task.assignedPersons || [],
        category: task.category || '',
        taskGroup: task.taskGroup,
        subtasks: subtasks.map(s => ({
            text: s.text || '',
            subtaskComplete: !!s.subtaskComplete
        }))
    });
}

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


function closeTaskCardOverlay() {
    const overlay = document.getElementById('task_card_overlay');

    overlay.classList.add('closing');

    setTimeout(() => {
        overlay.classList.remove('active', 'closing');
        overlay.innerHTML = '';
    }, 400);
}

function stopPropagation(event) {
    event.stopPropagation(event);
}

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

function editTask(taskId) {
    const tasks = window.tasks || [];
    const task = tasks.find(t => t.id == taskId);
    if (!task) return;
    
    storeTaskData(task);
    displayEditOverlay(task, taskId);
    initializeEditComponents(task);
}

function storeTaskData(task) {
    editedTitle = task.title;
    editedDescription = task.description;
    editedDueDate = task.date;
}

function displayEditOverlay(task, taskId) {
    let overlay = document.getElementById('task_card_overlay');
    overlay.innerHTML = generateEditTaskHTML(task, taskId);
}

function initializeEditComponents(task) {
    setTimeout(() => {
        setupEditPriority(task);
        setupEditAssignments(task);
        setupEditDateValidation();
        finalizeEditSetup(task);
    }, 10);
}

function setupEditPriority(task) {
    checkTaskPriority(task.priority);
    window.currentPriority = task.priority;
}

function setupEditAssignments(task) {
    fillEditAssignmentDropdown();
    editAddInitialsBackgroundColors();
}

function setupEditDateValidation() {
    const editDateInput = document.getElementById('edit-date');
    if (editDateInput) {
        const today = new Date().toISOString().split('T')[0];
        editDateInput.setAttribute('min', today);
        editDateInput.addEventListener('blur', editCheckDate);
    }
}

function finalizeEditSetup(task) {
    requestAnimationFrame(() => {
        activateAddedContacts(task);
        editRenderSelectedContacts();
        activateChosenCategory(task);
        showExistingSubtasks(task);
    });
}

//Function that saves all edited task data and updates the task in the board
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

function updateTaskWithEditedData(task) {
    task.title = editedTitle;
    task.description = editedDescription;
    task.date = editedDueDate;
    task.priority = editedPriority;
    task.assignedPersons = editSelectedContacts;
    task.category = editedCategory;
    task.subtasks = editedSubtaskListArray.map(obj => ({
        text: obj.text,
        subtaskComplete: !!obj.subtaskComplete
    }));
}

function editedTaskDetails() {
    editSaveTitle();
    editSaveDescription();
    editSaveDueDate();
}

//Function that changes to Open Task Card Overlay from Edit Task Overlay
function openTaskCardFromEdit(taskId) {
    const tasks = window.tasks || [];
    const task = tasks.find(t => t.id == taskId);
    let overlay = document.getElementById('task_card_overlay');
    overlay.innerHTML = generateOpenedTaskCardHTML(task);
}

function deleteTask(taskId) {
    const tasks = window.tasks || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        
        // Update window.tasks and localStorage
        window.tasks = tasks;
        // Update localStorage
        localStorage.setItem('join_tasks', JSON.stringify(tasks));
        
        // Try Firebase delete
        const taskRef = db.ref(`tasks/${taskId}`);
        taskRef.remove().catch(() => {});
    }
    updateBoard();
    closeTaskCardOverlay();
}