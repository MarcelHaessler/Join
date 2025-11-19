document.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', () => {
        if (input.id === 'date') {
            checkDate();
        }
        if (input.id === 'title') {
            checkTitle();
        }
    });
});

document.querySelector('textarea').addEventListener('blur', () => checkDescription());

function checkTitle() {
    const titleInput = document.getElementById("title");
    const titleResultDiv = document.getElementById("title-warning");


    if (titleInput.value.length === 0) {
        titleResultDiv.innerHTML = "This field is required.";
        titleResultDiv.style.color = "#e60025";
        titleInput.classList.add("invalid");}
    if (titleInput.value.length > 0) {
        titleResultDiv.innerHTML = "";
        titleInput.classList.remove("invalid");}
}

function checkDescription() {
    const descriptionInput = document.getElementById("description");
    const descriptionResultDiv = document.getElementById("description-warning");
    
    if (descriptionInput.value.length === 0) {
        descriptionResultDiv.innerHTML = "This field is required.";
        descriptionResultDiv.style.color = "#e60025";
        descriptionInput.classList.add("invalid");}
    if (descriptionInput.value.length > 0) {
        descriptionResultDiv.innerHTML = "";
        descriptionInput.classList.remove("invalid");}
}

const dateInput = document.getElementById('date');

/**Function that adds / between numbers to cut up the date */
dateInput.addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, ""); 

  if (value.length > 8) value = value.slice(0, 8); 

  let formatted = "";
  if (value.length > 0) formatted = value.slice(0, 2);
  if (value.length > 2) formatted += "/" + value.slice(2, 4);
  if (value.length > 4) formatted += "/" + value.slice(4, 8);

  e.target.value = formatted;
});

/**Function that checks if the input date is today or in the future */
const isCorrectDate = (date) =>{
    let today = new Date();
    today.setHours(0,0,0,0); // Set time to midnight for accurate comparison

    date = date.split("/");
    date = new Date(date[2], date[1] - 1, date[0]); 
    date.setHours(0,0,0,0); // Set time to midnight for accurate comparison

    if (today.getTime() === date.getTime()) {
        return true
    } else if (today.getTime() < date.getTime()) {
        return true
    }else if (today.getTime() > date.getTime()) {
        return false
    }
}

/**Function that checks the input date and gives a User response if date is incorrect
 * or missing.
 */
function checkDate() {
    const inputBorder = document.getElementById("date"); 
    resultDiv = document.getElementById("date-warning");
    dateReg = /(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/201[4-9]|20[2-9][0-9]/;

    if (!dateInput.value) {
        inputBorder.classList.add("invalid");
        return show("This field is required.");}
    if (!dateReg.test(dateInput.value)) {
        inputBorder.classList.add("invalid");
        return show("It's an invalid date");}
    if (!isCorrectDate(dateInput.value)){
        inputBorder.classList.add("invalid");
        return show("It's an invalid date");}
    if (isCorrectDate(dateInput.value)){
        inputBorder.classList.remove("invalid");
        return show("");}

    function show(msg) { resultDiv.innerHTML = msg; resultDiv.style.color = "#e60025"; }
}

//Button color changing functions on click
let currentPriotity = '';

let urgentBtn = document.getElementById('urgent-btn');
let mediumBtn = document.getElementById('medium-btn');
let lowBtn = document.getElementById('low-btn');

let urgentImg = document.getElementById('urgent-img');
let mediumImg = document.getElementById('medium-img');
let lowImg = document.getElementById('low-img');

urgentBtn.addEventListener('click', () => {
    urgentBtn.disabled = 'true';
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
    mediumBtn.disabled = 'true';
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
    lowBtn.disabled = 'true';
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
    urgentBtn.classList.remove('no-hover')
    urgentBtn.style.cursor = 'pointer';
    urgentBtn.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    urgentBtn.style.color = 'black';
    urgentImg.src = './assets/img/add_task/urgent.svg'
}

function mediumBtnToNormal() {
    mediumBtn.classList.remove('no-hover')
    mediumBtn.style.cursor = 'pointer';
    mediumBtn.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    mediumBtn.style.color = 'black';
    mediumImg.src = './assets/img/add_task/medium.svg'
}

function lowBtnToNormal() {
    lowBtn.classList.remove('no-hover')
    lowBtn.style.cursor = 'pointer';
    lowBtn.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    lowBtn.style.color = 'black';
    lowImg.src = './assets/img/add_task/low.svg'
}