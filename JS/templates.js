function addTaskContactTemplate(name, initials) {
    return `<div class="dropdown-box" onclick=''>
                <div class="contact-initials">
                    <p>${initials}</p>
                </div>
                <div class="contact-name-checkbox">
                    <p class="contact-fullname">${name}</p>
                    <img class="checkbox" src="./assets/img/checkbox_inactive.svg" alt="checkbox">
                </div>
            </div>`
}
