// ===== Firebase tasks (Summary counts) =====
const FIREBASE_BASE_URL = 'https://join-ad1a9-default-rtdb.europe-west1.firebasedatabase.app';

/**
 * Fetches all tasks from Firebase Realtime Database.
 * @returns {Promise<object|null>} Object keyed by taskId, or null if no tasks exist.
 */
async function fetchAllTasks() {
    try {
        const res = await fetch(`${FIREBASE_BASE_URL}/tasks.json`);
        if (!res.ok) {
            throw new Error(`Firebase request failed: ${res.status} ${res.statusText}`);
        }
        return await res.json(); // object or null
    } catch (err) {
        console.error('fetchAllTasks() failed:', err);
        return null;
    }
}

/**
 * Updates the "Tasks in Board" number (all tasks).
 * @param {object|null} tasks
 */
function renderBoardCount(tasks) {
    const el = document.getElementById('number-board');
    if (!el) return;

    const count = tasks ? Object.keys(tasks).length : 0;
    el.textContent = String(count);
}

/**
 * Loads and renders summary counts (start with total tasks).
 */
async function loadSummaryCounts() {
    const tasks = await fetchAllTasks();
    renderBoardCount(tasks);
    renderUrgentCount(tasks);
}
/**
 * Updates the number of urgent tasks.
 * A task is considered urgent if task.priority === 'urgent'
 * @param {object|null} tasks
 */
function renderUrgentCount(tasks) {
    const el = document.getElementById('number-urgent');
    if (!el) return;

    if (!tasks) {
        el.textContent = '0';
        return;
    }

    const urgentCount = Object.values(tasks)
        .filter(task => task.priority === 'urgent')
        .length;

    el.textContent = String(urgentCount);
}
