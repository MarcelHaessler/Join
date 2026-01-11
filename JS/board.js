const addTaskOverlay = document.getElementById('add-task-overlay');
const closeBtn = document.getElementById('close-add-task-overlay');

function addTaskOverlayOpen(boardGroup) {
    addTaskOverlay.classList.remove('d_none', 'closing');
    // kleine Verzögerung, damit CSS Transition greift
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

// Schließen über X
closeBtn.addEventListener('click', addTaskOverlayClose);