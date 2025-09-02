const formButtons = document.querySelectorAll(".call-me-detail");

formButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const isMobile = window.innerWidth <= 768;
        const targetElement = document.getElementById('contactFormContainer');

        if (targetElement) {
            if (isMobile) {
                window.scrollTo({
                    top: targetElement.offsetTop - 150,
                    behavior: 'smooth'
                });
            } else {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});