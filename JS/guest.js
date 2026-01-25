document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('Guest')) {
        sessionStorage.setItem('guestMode', 'true'); 
    }

    if (sessionStorage.getItem('guestMode') === 'true') {
        console.log('Guest mode persists');
        document.body.classList.add('mode-guest');
    }
});