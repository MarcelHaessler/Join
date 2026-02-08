/**
 * Reference to the add task overlay element.
 * @type {HTMLElement}
 */
const addTaskOverlay = document.getElementById('add-task-overlay');

/**
 * Reference to the close button for the add task overlay.
 * @type {HTMLElement}
 */
const closeBtn = document.getElementById('close-add-task-overlay');

/**
 * Handles overlay background click events
 * Closes overlay if background is clicked
 * @param {Event} e - The click event
 * @returns {void}
 */
function handleOverlayBackgroundClick(e) {
    if (e.target === addTaskOverlay) {
        addTaskOverlayClose();
    }
}

/**
 * Initializes add task overlay event listeners
 * @returns {void}
 */
function initAddTaskOverlayListeners() {
    closeBtn.addEventListener('click', addTaskOverlayClose);
    addTaskOverlay.addEventListener('click', handleOverlayBackgroundClick);
}

initAddTaskOverlayListeners();

/**
 * Reference to the To-Do tasks container.
 * @type {HTMLElement}
 */
const ToDo = document.getElementById('todo-tiles');

/**
 * Reference to the In Progress tasks container.
 * @type {HTMLElement}
 */
const InProgress = document.getElementById('progress-tiles');

/**
 * Reference to the Awaiting Feedback tasks container.
 * @type {HTMLElement}
 */
const Awaiting = document.getElementById('feedback-tiles');

/**
 * Reference to the Done tasks container.
 * @type {HTMLElement}
 */
const Done = document.getElementById('done-tiles');

/**
 * Stores the currently dragged task element ID.
 * @type {string|undefined}
 */
let currentDraggedElement;

/**
 * Tracks dragenter/dragleave event counts for each drop zone.
 * @type {Object.<string, number>}
 */
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
 * Handles transition end event for overlay closing
 * @param {Event} e - The transition event
 * @param {Function} handler - The handler function reference
 * @returns {void}
 */
function handleOverlayTransitionEnd(e, handler) {
    if (e.target.id === 'board-task-content-section') {
        addTaskOverlay.classList.add('d_none');
        addTaskOverlay.classList.remove('closing');
        addTaskOverlay.removeEventListener('transitionend', handler);
    }
}

/**
 * Closes the add task overlay with animation
 * @returns {void}
 */
function addTaskOverlayClose() {
    addTaskOverlay.classList.remove('active');
    addTaskOverlay.classList.add('closing');

    addTaskOverlay.addEventListener('transitionend', function handler(e) {
        handleOverlayTransitionEnd(e, handler);
    });
}

/**
 * Initializes tasks loaded event listener
 * Updates board when tasks are loaded
 * @returns {void}
 */
function initTasksLoadedListener() {
    addEventListener("tasksLoaded", () => {
        updateBoard();
    });
}

initTasksLoadedListener();

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

/**
 * Creates a clone of the task card element
 * @param {HTMLElement} element - The original task card element
 * @returns {HTMLElement} The cloned element
 */
function createDragClone(element) {
    let clone = element.cloneNode(true);
    clone.style.width = element.offsetWidth + "px";
    clone.style.height = element.offsetHeight + "px";
    clone.classList.add('drag-rotated');
    return clone;
}

/**
 * Creates a wrapper element for drag image
 * @param {HTMLElement} clone - The cloned element
 * @returns {HTMLElement} The wrapper element
 */
function createDragWrapper(clone) {
    let wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.top = '-9999px';
    wrapper.style.left = '-9999px';
    wrapper.appendChild(clone);
    return wrapper;
}

/**
 * Creates a rotated clone of the task card for the drag image.
 * @param {HTMLElement} element - The original task card element.
 * @returns {HTMLElement} The wrapper element containing the clone.
 */
function prepareDragImage(element) {
    let clone = createDragClone(element);
    return createDragWrapper(clone);
}


/**
 * Allows dropping by preventing the default handling of the element.
 * @param {DragEvent} ev - The drag event.
 * @returns {void}
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Moves the currently dragged task to a new status group.
 * @param {string} taskGroup - The target board group (e.g., 'ToDo', 'Done').
 * @returns {void}
 */
function moveTo(taskGroup) {
    const taskId = currentDraggedElement;
    const tasks = window.tasks || [];
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    task.taskGroup = taskGroup;
    updateTask(task);
    removeHighlight(taskGroup, true);
}

/**
 * Highlights a drop zone when dragging over it.
 * @param {string} id - The ID of the drop zone.
 * @returns {void}
 */
function highlight(id) {
    dragCounters[id]++;
    document.getElementById(id).classList.add('drag-area-highlight');
}

/**
 * Removes highlight from a drop zone.
 * @param {string} id - The ID of the drop zone.
 * @param {boolean} forced - If true, immediately removes the highlight (ignores counter).
 * @returns {void}
 */
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

/**
 * Closes all mobile menus except the specified one
 * @param {string} taskId - The task ID to keep open
 * @returns {void}
 */
function closeOtherMobileMenus(taskId) {
    document.querySelectorAll('.mobile-move-menu').forEach(m => {
        if (m.id !== `mobile-menu-${taskId}`) {
            m.classList.add('d_none');
        }
    });
}

/**
 * Toggles the mobile move menu for a specific task.
 * @param {Event} event - The click event.
 * @param {string} taskId - The ID of the task.
 * @returns {void}
 */
function toggleMobileMoveMenu(event, taskId) {
    event.stopPropagation();
    let menu = document.getElementById(`mobile-menu-${taskId}`);
    closeOtherMobileMenus(taskId);
    menu.classList.toggle('d_none');
}

/**
 * Moves a task to a different status via the mobile menu.
 * @param {Event} event - The click event.
 * @param {string} taskId - The ID of the task.
 * @param {string} targetStatus - The target status.
 * @returns {void}
 */
function moveToFromMobile(event, taskId, targetStatus) {
    event.stopPropagation();
    const tasks = window.tasks || [];
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.taskGroup = targetStatus;
        updateTask(task);
    }
}
