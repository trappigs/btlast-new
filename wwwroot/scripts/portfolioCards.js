// Modal Functions
function openContactModal(button) {
    const projectName = button.getAttribute('data-project');
    const modal = document.getElementById('contactModal');
    const modalTitle = document.getElementById('modalTitle');
    
    modalTitle.textContent = `${projectName} - İletişim Formu`;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('contactForm').reset();
}

// Close modal on overlay click
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('contactModal');
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeContactModal();
        }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeContactModal();
        }
    });
    
    // Form submission
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Here you can send data to your backend
        console.log('Form Data:', data);
        
        // Show success message
        alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
        
        // Close modal
        closeContactModal();
    });
});