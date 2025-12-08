//Button color changing functions on click
let currentPriotity = '';

let urgentBtn = document.getElementById('urgent-btn');
let mediumBtn = document.getElementById('medium-btn');
let lowBtn = document.getElementById('low-btn');

let urgentImg = document.getElementById('urgent-img');
let mediumImg = document.getElementById('medium-img');
let lowImg = document.getElementById('low-img');

urgentBtn.addEventListener('click', () => {
    urgentBtn.disabled = true;
    urgentBtn.classList.add('no-hover')
    urgentBtn.style.cursor = 'default';
    urgentBtn.style.backgroundColor = 'rgba(255, 61, 0, 1)';
    urgentBtn.style.color = 'white';
    urgentImg.src = './assets/img/add_task/urgent-active.svg'
    mediumBtnToNormal();
    lowBtnToNormal();
    currentPriotity = 'urgent';
    console.log(currentPriotity);
});

mediumBtn.addEventListener('click', () => {
    mediumBtn.disabled = true;
    mediumBtn.classList.add('no-hover')
    mediumBtn.style.cursor = 'default';
    mediumBtn.style.backgroundColor = 'rgba(255, 168, 0, 1)';
    mediumBtn.style.color = 'white';
    mediumImg.src = './assets/img/add_task/medium-active.svg'
    urgentBtnToNormal();
    lowBtnToNormal();
    currentPriotity = 'medium';
    console.log(currentPriotity);
});

lowBtn.addEventListener('click', () => {
    lowBtn.disabled = true;
    lowBtn.classList.add('no-hover')
    lowBtn.style.cursor = 'default';
    lowBtn.style.backgroundColor = 'rgba(122, 226, 41, 1)';
    lowBtn.style.color = 'white';
    lowImg.src = './assets/img/add_task/low-active.svg'
    mediumBtnToNormal();
    urgentBtnToNormal();
    currentPriotity = 'low';
    console.log(currentPriotity);
});

function urgentBtnToNormal() {
    urgentBtn.disabled = false;
    urgentBtn.classList.remove('no-hover')
    urgentBtn.style.cursor = 'pointer';
    urgentBtn.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    urgentBtn.style.color = 'black';
    urgentImg.src = './assets/img/add_task/urgent.svg'
}

function mediumBtnToNormal() {
    mediumBtn.disabled = false;
    mediumBtn.classList.remove('no-hover')
    mediumBtn.style.cursor = 'pointer';
    mediumBtn.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    mediumBtn.style.color = 'black';
    mediumImg.src = './assets/img/add_task/medium.svg'
}

function lowBtnToNormal() {
    lowBtn.disabled = false;
    lowBtn.classList.remove('no-hover')
    lowBtn.style.cursor = 'pointer';
    lowBtn.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    lowBtn.style.color = 'black';
    lowImg.src = './assets/img/add_task/low.svg'
}