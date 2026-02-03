import { db } from "./firebaseAuth.js";
import { ref, update, remove } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

const addTaskOverlay = document.getElementById('add-task-overlay');
const closeBtn = document.getElementById('close-add-task-overlay');
closeBtn.addEventListener('click', addTaskOverlayClose);

// Close overlay when clicking outside content section
addTaskOverlay.addEventListener('click', function(e) {
    if (e.target === addTaskOverlay) {
        addTaskOverlayClose();
    }
});

const ToDo = document.getElementById('todo-tiles');
const InProgress = document.getElementById('progress-tiles');
const Awaiting = document.getElementById('feedback-tiles');
const Done = document.getElementById('done-tiles');
let currentDraggedElement;
let dragCounters = {
    ToDo: 0,
    InProgress: 0,
    Awaiting: 0,
    Done: 0
};

function addTaskOverlayOpen(boardGroup) {
    addTaskOverlay.classList.remove('d_none', 'closing');
    setTimeout(() => {
        addTaskOverlay.classList.add('active');
    }, 10);
    taskgroup = boardGroup;
}

function addTaskOverlayClose() {
    addTaskOverlay.classList.remove('active');
    addTaskOverlay.classList.add('closing');

    addTaskOverlay.addEventListener('transitionend', function handler(e) {
        if (e.target.id === 'board-task-content-section') {
            addTaskOverlay.classList.add('d_none');
            addTaskOverlay.classList.remove('closing');
            addTaskOverlay.removeEventListener('transitionend', handler);
        }
    });
}

window.addEventListener("tasksLoaded", () => {
    updateBoard();
});

function updateBoard() {
    const tasks = window.tasks || [];
    
    let searchTerm = document.getElementById('search-tasks-input').value.toLowerCase();
    let statuses = ['ToDo', 'InProgress', 'Awaiting', 'Done'];

    statuses.forEach(status => {
        updateBoardStatus(status, tasks, searchTerm);
    });
}

function updateBoardStatus(status, tasks, searchTerm) {
    let filteredTasks = filterTasksByStatus(status, tasks, searchTerm);
    
    let container = document.getElementById(status);
    if (!container) {
        return;
    }
    renderTasksInContainer(container, filteredTasks, searchTerm);
}

function filterTasksByStatus(status, tasks, searchTerm) {
    return tasks.filter(t =>
        t['taskgroup'] == status &&
        (t.title.toLowerCase().includes(searchTerm) || t.description.toLowerCase().includes(searchTerm))
    );
}

function renderTasksInContainer(container, filteredTasks, searchTerm) {
    container.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        container.innerHTML = getNoTasksMessage(searchTerm);
        return;
    }
    
    filteredTasks.forEach(element => {
        container.innerHTML += generateTodoHTML(element);
    });
}

function getNoTasksMessage(searchTerm) {
    return searchTerm ? `<p class="no-tasks-message">No results found</p>` : `<p class="no-tasks-message">No tasks</p>`;
}

function startDragging(id, event) {
    currentDraggedElement = id;
    let wrapper = prepareDragImage(event.target);
    document.body.appendChild(wrapper);

    let rect = event.target.getBoundingClientRect();
    event.dataTransfer.setDragImage(wrapper, event.clientX - rect.left, event.clientY - rect.top);

    setTimeout(() => wrapper.remove(), 10);
}

function prepareDragImage(element) {
    let clone = element.cloneNode(true);
    clone.style.width = element.offsetWidth + "px";
    clone.style.height = element.offsetHeight + "px";
    clone.classList.add('drag-rotated');

    let wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.top = '-9999px';
    wrapper.style.left = '-9999px';
    wrapper.appendChild(clone);
    return wrapper;
}



function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(taskgroup) {
    const taskId = currentDraggedElement;
    const tasks = window.tasks || [];
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    task.taskgroup = taskgroup;
    updateTask(task);
    // updateBoard() wird bereits in updateTask() aufgerufen
    removeHighlight(taskgroup, true);
}

function highlight(id) {
    dragCounters[id]++;
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id, forced = false) {
    if (forced) {
        dragCounters[id] = 0;
    } else {
        dragCounters[id]--;
    }

    if (dragCounters[id] <= 0) {
        dragCounters[id] = 0;
        document.getElementById(id).classList.remove('drag-area-highlight');
    }
}

function toggleMobileMoveMenu(event, taskId) {
    event.stopPropagation();
    let menu = document.getElementById(`mobile-menu-${taskId}`);

    // Close other open menus
    document.querySelectorAll('.mobile-move-menu').forEach(m => {
        if (m.id !== `mobile-menu-${taskId}`) {
            m.classList.add('d_none');
        }
    });

    menu.classList.toggle('d_none');
}

function moveToFromMobile(event, taskId, targetStatus) {
    event.stopPropagation();
    const tasks = window.tasks || [];
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.taskgroup = targetStatus;
        updateTask(task);
        // updateBoard() wird bereits in updateTask() aufgerufen
    }
}

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
    const taskRef = ref(db, `tasks/${task.id}`);
    const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];

    await update(taskRef, {
        title: task.title || '',
        description: task.description || '',
        date: task.date || '',
        priority: task.priority || '',
        assignedPersons: task.assignedPersons || [],
        category: task.category || '',
        taskgroup: task.taskgroup,
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
        const taskRef = ref(db, `tasks/${taskId}`);
        remove(taskRef).catch(() => {});
    }
    updateBoard();
    closeTaskCardOverlay();
}

window.updateTask = updateTask;
window.addTaskOverlayOpen = addTaskOverlayOpen;
window.startDragging = startDragging;
window.allowDrop = allowDrop;
window.moveTo = moveTo;
window.updateBoard = updateBoard;
window.openTaskCardOverlay = openTaskCardOverlay;
window.closeTaskCardOverlay = closeTaskCardOverlay;
window.stopPropagation = stopPropagation;
window.checkboxSubtask = checkboxSubtask;
window.subtaskCompleted = subtaskCompleted;
window.editTask = editTask;
window.editedTaskDetails = editedTaskDetails;
window.saveEditedTask = saveEditedTask;
window.openTaskCardFromEdit = openTaskCardFromEdit;
window.deleteTask = deleteTask;
window.highlight = highlight;
window.removeHighlight = removeHighlight;
window.toggleMobileMoveMenu = toggleMobileMoveMenu;
window.moveToFromMobile = moveToFromMobile;
