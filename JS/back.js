const helpBackLink = document.getElementById('help-back-link');
        const helpBackImg = document.getElementById('help-back-img');

        if (helpBackLink && helpBackImg) {
            helpBackLink.addEventListener('mouseenter', () => {
                helpBackImg.src = './assets/img/back_button_active.svg';
            });
            helpBackLink.addEventListener('mouseleave', () => {
                helpBackImg.src = './assets/img/back_button_inactive.svg';
            });
        }