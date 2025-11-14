function activateCheckbox() {
    const checkbox = document.getElementById("checkbox");
    if (checkbox.src.includes("checkbox_inactive.svg")){
        checkbox.src="./assets/img/checkbox_active.svg"
    }else{
        checkbox.src="./assets/img/checkbox_inactive.svg"
    }
}

function hoverBackButton() {
    const backButton = document.getElementById("back_button");
    backButton.src="./assets/img/back_button_active.svg"
}
function unhoverBackButton() {
    const backButton = document.getElementById("back_button");
    backButton.src="./assets/img/back_button_inactive.svg"
}

window.onload = () => {
    document.body.classList.add('loaded');
};