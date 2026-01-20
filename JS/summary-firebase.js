// ===== Firebase tasks (Summary counts) =====
import { db } from "./firebaseAuth.js";
import { ref, get, child } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

async function fetchAllTasks() {
    try {
        const tasksRef = ref(db, "tasks");
        const snapshot = await get(tasksRef);

        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log("No data available");
            return null;
        }
    } catch (err) {
        console.error('fetchAllTasks() failed:', err);
        return null;
    }
}

//updates counter

function renderBoardCount(tasks) {
    const el = document.getElementById('number-board');
    if (!el) return;

    const count = tasks ? Object.keys(tasks).length : 0;
    el.textContent = String(count);
}

function renderTodoCount(tasks) {
    const el = document.getElementById('number-todo');
    if (!el) return;

    if (!tasks) {
        el.textContent = '0';
        return;
    }

    const todoCount = Object.values(tasks)
        .filter(task => {
            const g = (task?.taskgroup ?? '').toString().trim().toLowerCase();
            return g === 'to-do' || g === 'todo' || g === 'to do';
        })
        .length;

    el.textContent = String(todoCount);
}

function renderDoneCount(tasks) {
    const el = document.getElementById('number-done');
    if (!el) return;

    if (!tasks) {
        el.textContent = '0';
        return;
    }

    const doneCount = Object.values(tasks)
        .filter(task => {
            const g = (task?.taskgroup ?? '').toString().trim().toLowerCase();
            return g === 'Done' || g === 'done';
        })
        .length
    
    el.textContent = String(doneCount);
}

// updates progress counter
function renderProgressCount(tasks) {
    const el = document.getElementById('number-progress');
    if (!el) return;

    if (!tasks) {
        el.textContent = '0';
        return;
    }

    const progressCount = Object.values(tasks)
        .filter(task => {
            const g = (task?.taskgroup ?? '').toString().trim().toLowerCase();
            return g === 'inprogress' || g === 'in progress' || g === 'progress';
        })
        .length

    el.textContent = String(progressCount);
    console.log(Object.values(tasks).map(t => t.taskgroup));
}

// updates feedback counter
function renderFeedbackCount(tasks) {
    const el = document.getElementById('number-feedback');
    if (!el) return;

    if (!tasks) {
        el.textContent = '0';
        return;
    }

    const feedbackCount = Object.values(tasks)
    .filter(task => {
        const g = (task?.taskgroup ?? '').toString().trim().toLowerCase();
        return g === 'awaiting' || g === 'awaiting feedback' || g === 'feedback';
    })
    .length

el.textContent = String(feedbackCount);
    
}

function renderUrgentCount(tasks) {
    const el = document.getElementById('number-urgent');
    if (!el) return;

    if (!tasks) {
        el.textContent = '0';
        return;
    }

    const urgentCount = Object.values(tasks)
        .filter(task => (task?.priority ?? '').toString().trim().toLowerCase() === 'urgent')
        .length;

    el.textContent = String(urgentCount);
}

//updates deadline date

function renderUrgentDueDate(tasks) {
    const el = document.getElementById('due-date');
    if (!el) return;

    if (!tasks) {
        el.textContent = '-';
        return;
    }

    const dates = Object.values(tasks)
        .filter(task => (task?.priority ?? '').toString().trim().toLowerCase() === 'urgent' && task.date)
        .map(task => {
            const v = task.date;

            // Expecting DD/MM/YYYY (e.g. 22/01/2026)
            if (typeof v === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(v.trim())) {
                const [dd, mm, yyyy] = v.trim().split('/').map(Number);
                return new Date(yyyy, mm - 1, dd);
            }

            // fallback
            return new Date(v);
        })
        .filter(date => !isNaN(date.getTime()))
        .sort((a, b) => a - b);

    if (dates.length === 0) {
        el.textContent = '-';
        return;
    }

    // US format: January 1, 2026
    el.textContent = dates[0].toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

async function loadSummaryCounts() {
    const tasks = await fetchAllTasks();
    renderBoardCount(tasks);
    renderTodoCount(tasks);
    renderDoneCount(tasks);
    renderProgressCount(tasks);
    renderFeedbackCount(tasks);
    renderUrgentCount(tasks);
    renderUrgentDueDate(tasks);
}

// Ensure counts are loaded when the page is ready
document.addEventListener('DOMContentLoaded', () => {
    loadSummaryCounts();
});