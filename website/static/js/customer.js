document.addEventListener('DOMContentLoaded', function () {
    const ticketDisplay = document.getElementById('ticketDisplay');
    
    if (ticketDisplay) {
        setTimeout(function () {
            ticketDisplay.classList.add('show'); // Add the 'show' class to trigger animation
        }, 100); // Delay to make sure it's ready
    }
});
