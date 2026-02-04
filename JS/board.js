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

/**
 * Opens the add task overlay with animation
 * @param {string} boardGroup - The board group (ToDo, InProgress, Awaiting, Done)
 * @returns {void}
 */
function addTaskOverlayOpen(boardGroup) {
    addTaskOverlay.classList.remove('d_none', 'closing');
    setTimeout(() => {
        addTaskOverlay.classList.add('active');
    }, 10);
    taskGroup = boardGroup;
}

/**
 * Closes the add task overlay with animation
 * @returns {void}
 */
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

addEventListener("tasksLoaded", () => {
    updateBoard();
});

/**
 * Updates the board display by filtering and rendering tasks
 * Applies search filtering if search term is present
 * @returns {void}
 */
function updateBoard() {
    const tasks = window.tasks || [];
    
    let searchTerm = document.getElementById('search-tasks-input').value.toLowerCase();
    let statuses = ['ToDo', 'InProgress', 'Awaiting', 'Done'];

    statuses.forEach(status => {
        updateBoardStatus(status, tasks, searchTerm);
    });
}

/**
 * Updates tasks for a specific board status
 * @param {string} status - The status column (ToDo, InProgress, Awaiting, Done)
 * @param {Array} tasks - Array of all tasks
 * @param {string} searchTerm - The search filter term
 * @returns {void}
 */
function updateBoardStatus(status, tasks, searchTerm) {
    let filteredTasks = filterTasksByStatus(status, tasks, searchTerm);
    
    let container = document.getElementById(status);
    if (!container) {
        return;
    }
    renderTasksInContainer(container, filteredTasks, searchTerm);
}

/**
 * Filters tasks by status and search term
 * @param {string} status - The status to filter by
 * @param {Array} tasks - Array of all tasks
 * @param {string} searchTerm - The search filter term
 * @returns {Array} Filtered array of tasks
 */
function filterTasksByStatus(status, tasks, searchTerm) {
    return tasks.filter(t =>
        t['taskGroup'] == status &&
        (t.title.toLowerCase().includes(searchTerm) || t.description.toLowerCase().includes(searchTerm))
    );
}

/**
 * Renders tasks in a container or shows 'no tasks' message
 * @param {HTMLElement} container - The container element
 * @param {Array} filteredTasks - Array of filtered tasks
 * @param {string} searchTerm - The search filter term
 * @returns {void}
 */
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

/**
 * Returns appropriate 'no tasks' message based on search state
 * @param {string} searchTerm - The search filter term
 * @returns {string} HTML string for no tasks message
 */
function getNoTasksMessage(searchTerm) {
    return searchTerm ? `<p class="no-tasks-message">No results found</p>` : `<p class="no-tasks-message">No tasks</p>`;
}

/**
 * Initiates drag operation for a task card
 * @param {string} id - The task ID
 * @param {DragEvent} event - The drag event
 * @returns {void}
 */
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

function moveTo(taskGroup) {
    const taskId = currentDraggedElement;
    const tasks = window.tasks || [];
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    task.taskGroup = taskGroup;
    updateTask(task);
    // updateBoard() wird bereits in updateTask() aufgerufen
    removeHighlight(taskGroup, true);
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
        task.taskGroup = targetStatus;
        updateTask(task);
        // updateBoard() wird bereits in updateTask() aufgerufen
    }
}


