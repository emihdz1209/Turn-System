class DisplayController {
    constructor(updateInterval = 1000) {
        this.updateInterval = updateInterval;
        this.intervalId = null;
        this.lastTurnNumber = null;
        this.init();
    }

    init() {
        this.updateDisplay(); // Initial update
        this.intervalId = setInterval(() => this.updateDisplay(), this.updateInterval);
        window.addEventListener('unload', () => this.cleanup());
    }

    async updateDisplay() {
        try {
            const response = await fetch('/api/queue-data');
            if (!response.ok) {
                throw new Error('HTTP error! status: ${response.status}');
            }
            const data = await response.json();
            
            // Update the display with current turn data
            const numberDisplay = document.getElementById('numberDisplay');
            const currentName = document.getElementById('currentName');
            const currentId = document.getElementById('currentId');
            
            if (data.currentTurn) {
                // Check if turn number changed to trigger animation
                const isNewTurn = this.lastTurnNumber !== data.currentTurn.turn;
                this.lastTurnNumber = data.currentTurn.turn;

                // Update display elements
                numberDisplay.textContent = data.currentTurn.turn;
                currentName.textContent = data.currentTurn.name;
                currentId.textContent = data.currentTurn.matricula;

                if (isNewTurn) {
                    // Add animation class
                    const ticketDisplay = document.getElementById('ticketDisplay');
                    ticketDisplay.classList.remove('show');
                    void ticketDisplay.offsetWidth; // Trigger reflow
                    ticketDisplay.classList.add('show');
                }
            } else {
                // Reset display when no current turn
                numberDisplay.textContent = '-';
                currentName.textContent = 'Waiting...';
                currentId.textContent = 'Waiting...';
                this.lastTurnNumber = null;
            }
        } catch (error) {
            console.error('Error updating display:', error);
        }
    }

    cleanup() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// Initialize the display controller when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new DisplayController();
});