/**
 * Handles validation and interaction for the left side of the Add Task form (Title, Description, Date).
 */

/**
 * Sets the minimum date for all date inputs to today's date.
 */
function setMinDateToToday() {
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(dateInput => {
        dateInput.setAttribute('min', today);
    });
}

setMinDateToToday();

/**
 * Handles blur event for input fields
 * Triggers validation based on input ID
 * @param {HTMLInputElement} input - The input element
 * @returns {void}
 */
function handleInputBlur(input) {
    if (input.id === 'date') {
        checkDate();
    }
    if (input.id === 'title') {
        checkTitle();
    }
}

/**
 * Handles change event for date inputs
 * Adds/removes styling class based on value presence
 * @param {HTMLInputElement} input - The date input element
 * @returns {void}
 */
function handleDateChange(input) {
    if (input.value) {
        input.classList.add('has-value');
    } else {
        input.classList.remove('has-value');
    }
}

/**
 * Initializes validation for textarea element
 * Adds blur event listener for description validation
 * @returns {void}
 */
function initTextareaValidation() {
    const textarea = document.querySelector('textarea');
    if (textarea) {
        textarea.addEventListener('blur', () => checkDescription());
    }
}

/**
 * Initializes all event listeners for form left side
 * Sets up input validation and date field styling
 * @returns {void}
 */
function initFormLeftEventListeners() {
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('blur', () => handleInputBlur(input));
        
        if (input.type === 'date') {
            input.addEventListener('change', () => handleDateChange(input));
        }
    });
    
    initTextareaValidation();
}

initFormLeftEventListeners();

/**
 * Validates the task title input.
 * Shows error if empty.
 */
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

/**
 * Validates the task description input.
 * Shows error if empty.
 */
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

/**
 * Checks if the input date is today or in the future.
 * @param {string} dateString - The date string from input.
 * @returns {boolean} True if valid.
 */
const isCorrectDate = (dateString) => {
    if (!dateString) return false;

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let selectedDate = new Date(dateString);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate.getTime() >= today.getTime();
}

/**
 * Validates the due date input.
 * Checks for empty value and past dates.
 */
function checkDate() {
    const inputBorder = document.getElementById("date");
    const resultDiv = document.getElementById("date-warning");
    updateDateInputStyling(inputBorder);
    if (!dateInput.value) {
        showDateError(inputBorder, resultDiv, "This field is required.");
        return;
    }
    if (!isCorrectDate(dateInput.value)) {
        showDateError(inputBorder, resultDiv, "Date must be today or in the future");
        return;
    }
    clearDateError(inputBorder, resultDiv);
}

/**
 * Updates the visual styling of the date input based on value presence.
 * @param {HTMLElement} inputBorder - The date input element.
 */
function updateDateInputStyling(inputBorder) {
    if (dateInput.value) {
        inputBorder.classList.add("has-value");
    } else {
        inputBorder.classList.remove("has-value");
    }
}

/**
 * Displays a date validation error.
 * @param {HTMLElement} inputBorder - The date input element.
 * @param {HTMLElement} resultDiv - The error message container.
 * @param {string} msg - The error message to display.
 */
function showDateError(inputBorder, resultDiv, msg) {
    inputBorder.classList.add("invalid");
    resultDiv.innerHTML = msg;
    resultDiv.style.color = "#e60025";
}

/**
 * Clears any date validation errors.
 * @param {HTMLElement} inputBorder - The date input element.
 * @param {HTMLElement} resultDiv - The error message container.
 */
function clearDateError(inputBorder, resultDiv) {
    inputBorder.classList.remove("invalid");
    resultDiv.innerHTML = "";
}

/**
 * Checks if date string is already in ISO format
 * @param {string} dateString - The date string to check
 * @returns {boolean} True if already in ISO format
 */
function isISOFormat(dateString) {
    return dateString.match(/^\d{4}-\d{2}-\d{2}$/) !== null;
}

/**
 * Converts dd/mm/yyyy format to yyyy-MM-dd
 * @param {string} dateString - The date string to convert
 * @returns {string} ISO formatted date string
 */
function convertSlashDateToISO(dateString) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateString;
}

/**
 * Helper function to convert date from dd/mm/yyyy to yyyy-MM-dd.
 * @param {string} dateString - The date string to convert
 * @returns {string} ISO formatted date string
 */
function convertDateToISO(dateString) {
    if (!dateString) return '';
    if (isISOFormat(dateString)) return dateString;
    return convertSlashDateToISO(dateString);
}