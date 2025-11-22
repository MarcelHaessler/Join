function addTaskContactTemplate(name, initials) {
    return `<div class="contact-box">
                <div class="contact-initials">
                    <p>${initials}</p>
                </div>
                <div class="contact-name">
                    <p class="contact-fullname">${name}</p>
                </div>
                <div class="contact-checkbox">
                    <img src="./assets/img/checkbox_inactive.svg" alt="checkbox">
                </div>
            </div>`
}
