document.addEventListener('DOMContentLoaded', function () {
    // Existing code (animations, other event listeners, etc.)
    const ticketDisplay = document.getElementById('ticketDisplay');
    if (ticketDisplay) {
        setTimeout(function () {
            ticketDisplay.classList.add('show'); // Add the 'show' class to trigger animation
        }, 100); // Delay to make sure it's ready
    }

    // New or updated form submission handling logic
    const form = document.getElementById('customerForm');
    form.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent form submission

        const name = document.getElementById('name').value.trim();
        const userId = document.getElementById('userId').value.trim();

        if (!name || !userId) {
            alert('Name and ID are required.');
            return;
        }

        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'name': name,
                    'userId': userId
                })
            });

            const data = await response.json();

            if (data.success) {
                // Update the ticket display with the new turn number
                document.getElementById('numberDisplay').textContent = `Turn ${data.turno}`;
                document.getElementById('displayName').textContent = `Name: ${name}`;
                document.getElementById('displayId').textContent = `ID: ${userId}`;

                // Clear the form fields after successful submission
                form.reset();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while getting your number. Please try again.');
        }
    });
});
