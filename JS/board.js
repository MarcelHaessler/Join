const addTaskOverlay = document.getElementById('add-task-overlay');
const closeBtn = document.getElementById('close-add-task-overlay');
closeBtn.addEventListener('click', addTaskOverlayClose);
const ToDo = document.getElementById('todo-tiles');
const InProgress = document.getElementById('progress-tiles');
const Awaiting = document.getElementById('feedback-tiles');
const Done = document.getElementById('done-tiles');
let currentDraggedElement;

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
    let searchTerm = document.getElementById('search-tasks-input').value.toLowerCase();
    let statuses = ['ToDo', 'InProgress', 'Awaiting', 'Done'];

    statuses.forEach(status => {
        let filteredTasks = tasks.filter(t =>
            t['taskgroup'] == status &&
            (t.title.toLowerCase().includes(searchTerm) || t.description.toLowerCase().includes(searchTerm))
        );

        let container = document.getElementById(status);
        container.innerHTML = '';

        if (filteredTasks.length === 0) {
            if (searchTerm) {
                container.innerHTML = `<p class="no-tasks-message">No results found</p>`;
            } else {
                container.innerHTML = `<p class="no-tasks-message">No tasks</p>`;
            }
            return;
        }

        filteredTasks.forEach(element => {
            container.innerHTML += generateTodoHTML(element);
        });
    });
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
    // Nimmt touchDragTaskId, wenn vorhanden, sonst currentDraggedElement
    const taskId = currentDraggedElement;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return; // Schutz
    task.taskgroup = taskgroup;
    updateTask(task);
    updateBoard();
    removeHighlight(taskgroup);
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
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
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.taskgroup = targetStatus;
        updateTask(task);
        updateBoard();
    }
    updateTask(task);    // <-- Firestore write
    updateBoard();       // <-- sofortige UI-Aktualisierung (ggf. nach Backend-Update)
}

import { db } from "./firebaseAuth.js";
import { ref, update, remove } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

//Firebase-Update-Funktion
async function updateTask(task) {
    try {
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
        updateBoard();
    } catch (error) {
        console.error("Error updating task:", error);
    }
}


function openTaskCardOverlay(taskId) {
    const task = tasks.find(t => t.id === taskId);

    let overlay = document.getElementById('task_card_overlay');

    overlay.classList.remove('d_none');

    setTimeout(() => {
        overlay.classList.remove('closing');
        overlay.classList.add('active');
    }, 10);

    overlay.innerHTML = generateOpenedTaskCardHTML(task);

    console.log(task);
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
    // 1. Update the Data first
    const subtask = tasks[taskIndex].subtasks[subtaskIndex];
    subtask.subtaskComplete = !subtask.subtaskComplete; // Simple toggle

    // 2. Update the UI based on the new Data
    const checkbox = document.getElementById(`subtask-checkbox-${subtaskIndex}`);
    const imgPath = subtask.subtaskComplete
        ? './assets/img/checkbox_active.svg'
        : './assets/img/checkbox_inactive.svg';

    checkbox.src = imgPath;

    // 3. Sync with backend/storage and refresh board
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
    const task = tasks.find(t => t.id == taskId);
    if (!task) return;
    editedTitle = task.title;
    editedDescription = task.description;
    editedDueDate = task.date;
    let overlay = document.getElementById('task_card_overlay');
    overlay.innerHTML = generateEditTaskHTML(task, taskId);
    setTimeout(() => {
        checkTaskPriority(task.priority);
        window.currentPriority = task.priority;
        fillEditAssignmentDropdown();
        editAddInitialsBackgroundColors();
        const editDateInput = document.getElementById('edit-date');
        if (editDateInput) {
            editDateInput.addEventListener('input', formatEditDateInput);
            editDateInput.addEventListener('blur', editCheckDate);
        }
        requestAnimationFrame(() => {
            activateAddedContacts(task);
            editRenderSelectedContacts();
            activateChosenCategory(task);
            showExistingSubtasks(task);
        });
    }, 10);
}

//Function that saves all edited task data and updates the task in the board
function saveEditedTask(taskId) {
    if (editCheckDate() === true) {
        return;
    }
    editedTaskDetails();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    tasks[taskIndex].title = editedTitle;
    tasks[taskIndex].description = editedDescription;
    tasks[taskIndex].date = editedDueDate;
    tasks[taskIndex].priority = editedPriority;
    tasks[taskIndex].assignedPersons = editSelectedContacts;
    tasks[taskIndex].category = editedCategory;
    // Übernehme sowohl text als auch subtaskComplete
    tasks[taskIndex].subtasks = editedSubtaskListArray.map(obj => ({
        text: obj.text,
        subtaskComplete: !!obj.subtaskComplete
    }));
    updateTask(tasks[taskIndex]);
    updateBoard();
    setTimeout(() => {
        openTaskCardFromEdit(taskId);
    }, 300);
}

function editedTaskDetails() {
    editSaveTitle();
    editSaveDescription();
    editSaveDueDate();
}

//Function that changes to Open Task Card Overlay from Edit Task Overlay
function openTaskCardFromEdit(taskId) {
    const task = tasks.find(t => t.id == taskId);
    let overlay = document.getElementById('task_card_overlay');
    overlay.innerHTML = generateOpenedTaskCardHTML(task);

}

function deleteTask(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        const taskRef = ref(db, `tasks/${taskId}`);
        remove(taskRef)
            .then(() => {
                console.log("Task deleted successfully.");
                updateBoard();
            })
            .catch((error) => {
                console.error("Error deleting task:", error);
            });
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
