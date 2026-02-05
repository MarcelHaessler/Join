// ===== Firebase tasks (Summary counts) =====

/**
 * Fetches all tasks from Firebase database
 * @async
 * @returns {Promise<Object|null>} Object containing all tasks or null
 */
async function fetchAllTasks() {
    try {
        const tasksRef = db.ref("tasks");
        const snapshot = await tasksRef.get();

        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
}

/**
 * Renders the total number of tasks on the board
 * @param {Object|null} tasks - Object containing all tasks
 * @returns {void}
 */
function renderBoardCount(tasks) {
    const el = document.getElementById('number-board');
    if (!el) return;

    const count = tasks ? Object.keys(tasks).length : 0;
    el.textContent = String(count);
}

/**
 * Filters tasks by To-Do status
 * @param {Object} tasks - Object containing all tasks
 * @returns {number} Count of To-Do tasks
 */
function countTodoTasks(tasks) {
    return Object.values(tasks)
        .filter(task => {
            const g = (task?.taskGroup ?? '').toString().trim().toLowerCase();
            return g === 'to-do' || g === 'todo' || g === 'to do';
        })
        .length;
}

/**
 * Renders the number of tasks in To-Do status
 * @param {Object|null} tasks - Object containing all tasks
 * @returns {void}
 */
function renderTodoCount(tasks) {
    const el = document.getElementById('number-todo');
    if (!el) return;

    const count = tasks ? countTodoTasks(tasks) : 0;
    el.textContent = String(count);
}

/**
 * Filters tasks by Done status
 * @param {Object} tasks - Object containing all tasks
 * @returns {number} Count of Done tasks
 */
function countDoneTasks(tasks) {
    return Object.values(tasks)
        .filter(task => {
            const g = (task?.taskGroup ?? '').toString().trim().toLowerCase();
            return g === 'Done' || g === 'done';
        })
        .length;
}

/**
 * Renders the number of tasks in Done status
 * @param {Object|null} tasks - Object containing all tasks
 * @returns {void}
 */
function renderDoneCount(tasks) {
    const el = document.getElementById('number-done');
    if (!el) return;

    const count = tasks ? countDoneTasks(tasks) : 0;
    el.textContent = String(count);
}

/**
 * Filters tasks by Progress status
 * @param {Object} tasks - Object containing all tasks
 * @returns {number} Count of Progress tasks
 */
function countProgressTasks(tasks) {
    return Object.values(tasks)
        .filter(task => {
            const g = (task?.taskGroup ?? '').toString().trim().toLowerCase();
            return g === 'inprogress' || g === 'in progress' || g === 'progress';
        })
        .length;
}

/**
 * Renders the number of tasks in Progress status
 * @param {Object|null} tasks - Object containing all tasks
 * @returns {void}
 */
function renderProgressCount(tasks) {
    const el = document.getElementById('number-progress');
    if (!el) return;

    const count = tasks ? countProgressTasks(tasks) : 0;
    el.textContent = String(count);
}

/**
 * Filters tasks by Awaiting Feedback status
 * @param {Object} tasks - Object containing all tasks
 * @returns {number} Count of Feedback tasks
 */
function countFeedbackTasks(tasks) {
    return Object.values(tasks)
        .filter(task => {
            const g = (task?.taskGroup ?? '').toString().trim().toLowerCase();
            return g === 'awaiting' || g === 'awaiting feedback' || g === 'feedback';
        })
        .length;
}

/**
 * Renders the number of tasks in Awaiting Feedback status
 * @param {Object|null} tasks - Object containing all tasks
 * @returns {void}
 */
function renderFeedbackCount(tasks) {
    const el = document.getElementById('number-feedback');
    if (!el) return;

    const count = tasks ? countFeedbackTasks(tasks) : 0;
    el.textContent = String(count);
}

/**
 * Filters tasks by Urgent priority
 * @param {Object} tasks - Object containing all tasks
 * @returns {number} Count of Urgent tasks
 */
function countUrgentTasks(tasks) {
    return Object.values(tasks)
        .filter(task => (task?.priority ?? '').toString().trim().toLowerCase() === 'urgent')
        .length;
}

/**
 * Renders the number of urgent priority tasks
 * @param {Object|null} tasks - Object containing all tasks
 * @returns {void}
 */
function renderUrgentCount(tasks) {
    const el = document.getElementById('number-urgent');
    if (!el) return;

    const count = tasks ? countUrgentTasks(tasks) : 0;
    el.textContent = String(count);
}

/**
 * Renders the earliest due date of urgent tasks
 * @param {Object|null} tasks - Object containing all tasks
 * @returns {void}
 */
function renderUrgentDueDate(tasks) {
    const el = document.getElementById('due-date');
    if (!el) return;

    if (!tasks) {
        el.textContent = '-';
        return;
    }

    const dates = getUrgentTaskDates(tasks);
    displayEarliestDate(el, dates);
}

/**
 * Gets sorted array of dates from urgent tasks
 * @param {Object} tasks - Object containing all tasks
 * @returns {Array<Date>} Sorted array of Date objects
 */
function getUrgentTaskDates(tasks) {
    return Object.values(tasks)
        .filter(task => (task?.priority ?? '').toString().trim().toLowerCase() === 'urgent' && task.date)
        .map(task => parseTaskDate(task.date))
        .filter(date => !isNaN(date.getTime()))
        .sort((a, b) => a - b);
}

/**
 * Parses a task date string or object into a Date
 * @param {string|Date} dateValue - The date value to parse
 * @returns {Date} Parsed Date object
 */
function parseTaskDate(dateValue) {
    if (typeof dateValue === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateValue.trim())) {
        const [dd, mm, yyyy] = dateValue.trim().split('/').map(Number);
        return new Date(yyyy, mm - 1, dd);
    }
    return new Date(dateValue);
}

/**
 * Displays the earliest date from array or dash if empty
 * @param {HTMLElement} el - The element to update
 * @param {Array<Date>} dates - Array of dates
 * @returns {void}
 */
function displayEarliestDate(el, dates) {
    if (dates.length === 0) {
        el.textContent = '-';
        return;
    }
    el.textContent = dates[0].toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Loads and renders all summary count statistics
 * @async
 * @returns {Promise<void>}
 */
async function loadSummaryCounts() {
    const isGreetingActive = checkGreetingActive();
    if (!isGreetingActive && typeof window.showLoader === 'function') {
        window.showLoader();
    }

    try {
        await updateAllCounts();
    } catch (error) {
    } finally {
        handleLoadingComplete(isGreetingActive);
    }
}

/**
 * Checks if the mobile greeting animation is active.
 * @returns {boolean} True if greeting is active.
 */
function checkGreetingActive() {
    return typeof window.initMobileGreeting === 'function' && window.initMobileGreeting();
}

/**
 * Updates all statistic counts on the page.
 * @async
 * @returns {Promise<void>}
 */
async function updateAllCounts() {
    const tasks = await fetchAllTasks();
    renderBoardCount(tasks);
    renderTodoCount(tasks);
    renderDoneCount(tasks);
    renderProgressCount(tasks);
    renderFeedbackCount(tasks);
    renderUrgentCount(tasks);
    renderUrgentDueDate(tasks);
}

/**
 * Handles the completion of loading (hides loader or finishes animation).
 * @param {boolean} isGreetingActive - Whether greeting was active.
 * @returns {void}
 */
function handleLoadingComplete(isGreetingActive) {
    if (isGreetingActive && typeof window.finishMobileGreeting === 'function') {
        window.finishMobileGreeting();
    } else if (typeof window.hideLoader === 'function') {
        window.hideLoader();
    }
}

/**
 * Initializes summary counts load on DOM ready
 * @returns {void}
 */
function initSummaryCountsLoader() {
    document.addEventListener('DOMContentLoaded', () => {
        loadSummaryCounts();
    });
}

initSummaryCountsLoader();