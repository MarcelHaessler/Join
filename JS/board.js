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
        if (e.target.id === 'content-section') {
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
            container.innerHTML = `<p class="no-tasks-message">No tasks</p>`;
            return;
        }

        filteredTasks.forEach(element => {
            container.innerHTML += generateTodoHTML(element);
        });
    });
}

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(taskgroup) {
    const task = tasks.find(t => t.id === currentDraggedElement);
    task.taskgroup = taskgroup;
    updateTask(task);
    updateBoard()
}

import { db } from "./firebaseAuth.js";
import { ref, update } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

async function updateTask(task) {
    try {
        const taskRef = ref(db, `tasks/${task.id}`);
        await update(taskRef, { taskgroup: task.taskgroup });
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
    }, 400); // exakt zur transform-duration
}

function stopPropagation(event) {
  event.stopPropagation(event);
}

function checkboxSubtask(subtaskIndex, taskIndex) {
    const checkbox = document.getElementById(`subtask-checkbox-${subtaskIndex}`);

    if (checkbox.src.includes('checkbox_inactive.svg')) {
        checkbox.src = './assets/img/checkbox_active.svg';
    } else {
        checkbox.src = './assets/img/checkbox_inactive.svg';
    }
    subtaskCompleted(subtaskIndex, taskIndex);
}

function subtaskCompleted(subtaskIndex, taskIndex) {
    const subtask = tasks[taskIndex].subtasks[subtaskIndex];
    if (subtask.subtaskComplete === false) {
        subtask.subtaskComplete = true;
    } else {
        subtask.subtaskComplete = false;
    }
    updateTask(tasks[taskIndex]);
}
   


window.updateTask = updateTask;
window.addTaskOverlayOpen = addTaskOverlayOpen;
window.startDragging = startDragging;
window.allowDrop = allowDrop;
window.moveTo = moveTo;
window.updateBoard = updateBoard;
