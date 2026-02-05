/**
 * Handles the priority selection buttons in the Add Task form.
 * Manages the state and visual feedback for priority levels (Low, Medium, Urgent).
 */

/**
 * The currently selected priority level.
 * @type {string}
 */
let currentPriority = '';

/**
 * Sets the default priority to Medium (e.g. on page load or reset).
 * @returns {void}
 */
function defaultPriority() {
    let mediumBtn = document.getElementById('medium-btn');
    let mediumImg = document.getElementById('medium-img');
    if (!mediumBtn || !mediumImg) return;
    mediumBtn.disabled = true;
    mediumBtn.classList.add('no-hover')
    mediumBtn.style.cursor = 'default';
    mediumBtn.style.backgroundColor = 'rgba(255, 168, 0, 1)';
    mediumBtn.style.color = 'white';
    mediumImg.src = './assets/img/add_task/medium-active.svg'
    urgentBtnToNormal();
    lowBtnToNormal();
    currentPriority = 'medium';
}

/**
 * Handles click event for urgent priority button
 * @returns {void}
 */
function handleUrgentClick() {
    const urgentBtn = document.getElementById('urgent-btn');
    const urgentImg = document.getElementById('urgent-img');
    urgentBtn.disabled = true;
    urgentBtn.classList.add('no-hover');
    urgentBtn.style.cursor = 'default';
    urgentBtn.style.backgroundColor = 'rgba(255, 61, 0, 1)';
    urgentBtn.style.color = 'white';
    urgentImg.src = './assets/img/add_task/urgent-active.svg';
    mediumBtnToNormal();
    lowBtnToNormal();
    currentPriority = 'urgent';
}

/**
 * Handles click event for medium priority button
 * @returns {void}
 */
function handleMediumClick() {
    const mediumBtn = document.getElementById('medium-btn');
    const mediumImg = document.getElementById('medium-img');
    mediumBtn.disabled = true;
    mediumBtn.classList.add('no-hover');
    mediumBtn.style.cursor = 'default';
    mediumBtn.style.backgroundColor = 'rgba(255, 168, 0, 1)';
    mediumBtn.style.color = 'white';
    mediumImg.src = './assets/img/add_task/medium-active.svg';
    urgentBtnToNormal();
    lowBtnToNormal();
    currentPriority = 'medium';
}

/**
 * Handles click event for low priority button
 * @returns {void}
 */
function handleLowClick() {
    const lowBtn = document.getElementById('low-btn');
    const lowImg = document.getElementById('low-img');
    lowBtn.disabled = true;
    lowBtn.classList.add('no-hover');
    lowBtn.style.cursor = 'default';
    lowBtn.style.backgroundColor = 'rgba(122, 226, 41, 1)';
    lowBtn.style.color = 'white';
    lowImg.src = './assets/img/add_task/low-active.svg';
    mediumBtnToNormal();
    urgentBtnToNormal();
    currentPriority = 'low';
}

/**
 * Initializes event listeners for priority buttons
 * @returns {void}
 */
function initPriorityButtonListeners() {
    const urgentBtn = document.getElementById('urgent-btn');
    const mediumBtn = document.getElementById('medium-btn');
    const lowBtn = document.getElementById('low-btn');

    if (urgentBtn) urgentBtn.addEventListener('click', handleUrgentClick);
    if (mediumBtn) mediumBtn.addEventListener('click', handleMediumClick);
    if (lowBtn) lowBtn.addEventListener('click', handleLowClick);
}

initPriorityButtonListeners();


/**
 * Resets the Urgent button to its normal state.
 * @returns {void}
 */
function urgentBtnToNormal() {
    let urgentBtn = document.getElementById('urgent-btn');
    let urgentImg = document.getElementById('urgent-img');
    if (!urgentBtn || !urgentImg) return;
    urgentBtn.disabled = false;
    urgentBtn.classList.remove('no-hover')
    urgentBtn.style.cursor = 'pointer';
    urgentBtn.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    urgentBtn.style.color = 'black';
    urgentImg.src = './assets/img/add_task/urgent.svg'
}

/**
 * Resets the Medium button to its normal state.
 * @returns {void}
 */
function mediumBtnToNormal() {
    let mediumBtn = document.getElementById('medium-btn');
    let mediumImg = document.getElementById('medium-img');
    if (!mediumBtn || !mediumImg) return;
    mediumBtn.disabled = false;
    mediumBtn.classList.remove('no-hover')
    mediumBtn.style.cursor = 'pointer';
    mediumBtn.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    mediumBtn.style.color = 'black';
    mediumImg.src = './assets/img/add_task/medium.svg'
}

/**
 * Resets the Low button to its normal state.
 * @returns {void}
 */
function lowBtnToNormal() {
    let lowBtn = document.getElementById('low-btn');
    let lowImg = document.getElementById('low-img');
    if (!lowBtn || !lowImg) return;
    lowBtn.disabled = false;
    lowBtn.classList.remove('no-hover')
    lowBtn.style.cursor = 'pointer';
    lowBtn.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    lowBtn.style.color = 'black';
    lowImg.src = './assets/img/add_task/low.svg'
}