// Function to change the Arrow image on hover over the Arrow container

function arrowButtonHover() {
    let button = document.getElementById('back_button');
    button.src = './assets/img/back_button_active.svg';
}

function arrowButtonUnhover() {
    let button = document.getElementById('back_button');
    button.src = './assets/img/back_button_inactive.svg';
}
