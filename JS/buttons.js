/**
 * Handles hover effects for arrow buttons.
 */

/**
 * Changes the button image to the active (hover) state.
 * @returns {void}
 */
function arrowButtonHover() {
    let button = document.getElementById('back_button');
    if (button) button.src = './assets/img/back_button_active.svg';
}

/**
 * Changes the button image back to the inactive (normal) state.
 * @returns {void}
 */
function arrowButtonUnhover() {
    let button = document.getElementById('back_button');
    if (button) button.src = './assets/img/back_button_inactive.svg';
}
