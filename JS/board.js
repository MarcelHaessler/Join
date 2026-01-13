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
    let statuses = ['ToDo', 'InProgress', 'Awaiting', 'Done'];
    statuses.forEach(status => {
        let filteredTasks = tasks.filter(t => t['taskgroup'] == status);
        
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

async function updateTask(task) {
    await fetch(`${BASE_URL}/tasks/${task.id}.json`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({taskgroup: task.taskgroup})
    });
    updateBoard();
}
