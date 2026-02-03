document.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', () => {
        if (input.id === 'date') {
            checkDate();
        }
        if (input.id === 'title') {
            checkTitle();
        }
    });

    // Add change event for date inputs to update styling
    if (input.type === 'date') {
        input.addEventListener('change', () => {
            if (input.value) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    }
});

document.querySelector('textarea').addEventListener('blur', () => checkDescription());

function checkTitle() {
    const titleInput = document.getElementById("title");
    const titleResultDiv = document.getElementById("title-warning");

    if (titleInput.value.trim().length === 0) {
        titleResultDiv.innerHTML = "This field is required.";
        titleResultDiv.style.color = "#e60025";
        titleInput.classList.add("invalid");
    }
    if (titleInput.value.trim().length > 0) {
        titleResultDiv.innerHTML = "";
        titleInput.classList.remove("invalid");
    }
}

function checkDescription() {
    const descriptionInput = document.getElementById("description");
    const descriptionResultDiv = document.getElementById("description-warning");

    if (descriptionInput.value.trim().length === 0) {
        descriptionResultDiv.innerHTML = "This field is required.";
        descriptionResultDiv.style.color = "#e60025";
        descriptionInput.classList.add("invalid");
    }
    if (descriptionInput.value.trim().length > 0) {
        descriptionResultDiv.innerHTML = "";
        descriptionInput.classList.remove("invalid");
    }
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

    // Toggle has-value class for styling
    if (dateInput.value) {
        inputBorder.classList.add("has-value");
    } else {
        inputBorder.classList.remove("has-value");
    }

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

function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });
}

// Initialize min date for existing inputs
document.addEventListener('DOMContentLoaded', setMinDate);
// Also export it for dynamic use (e.g. in overlays)
window.setMinDate = setMinDate;
