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

/**Function that checks if the input date is today or in the future */
const isCorrectDate = (dateString) => {
    if (!dateString) return false;
    
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let selectedDate = new Date(dateString);
    selectedDate.setHours(0, 0, 0, 0);
    
    return selectedDate.getTime() >= today.getTime();
}

/**Function that checks the input date and gives a User response if date is incorrect
 * or missing.
 */
function checkDate() {
    const inputBorder = document.getElementById("date");
    const resultDiv = document.getElementById("date-warning");
    
    function show(msg) {
        resultDiv.innerHTML = msg;
        resultDiv.style.color = "#e60025";
    }
    
    if (!dateInput.value) {
        inputBorder.classList.add("invalid");
        return show("This field is required.");
    }
    if (!isCorrectDate(dateInput.value)) {
        inputBorder.classList.add("invalid");
        return show("Date must be today or in the future");
    }
    inputBorder.classList.remove("invalid");
    return show("");
}
