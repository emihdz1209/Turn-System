class DisplayUpdater {
    constructor(updateInterval = 1000) {
        this.updateInterval = updateInterval;
        this.intervalId = null;
        this.lastTurnNumber = null;
        this.init();
    }

    init() {
        this.fetchCurrentTurn();
        this.intervalId = setInterval(() => this.fetchCurrentTurn(), this.updateInterval);
        window.addEventListener('unload', () => this.cleanup());
    }

    updateDisplay(currentTurn) {
        const container = document.getElementById('ticketDisplay');
        if (!container) return;

        if (currentTurn) {
            // Check if turn number changed to trigger animation
            const isNewTurn = this.lastTurnNumber !== currentTurn.turn; 
            this.lastTurnNumber = currentTurn.turn;

            container.innerHTML = `
                <div class="turn-number">Turn ${currentTurn.turn}</div>
                <div class="turn-details">
                    <p>${currentTurn.name}</p>
                    <p>Matricula: ${currentTurn.matricula}</p>
                </div>
            `;

            if (isNewTurn) {
                container.classList.remove('highlight');
                void container.offsetWidth; // Trigger reflow
                container.classList.add('highlight');
            }
        } else {
            container.innerHTML = '<p class="no-turn">Waiting for next turn...</p>';
            this.lastTurnNumber = null;
        }
    }

    async fetchCurrentTurn() {
        try {
            const response = await fetch('/api/current_turn');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.updateDisplay(data.currentTurn);
        } catch (error) {
            console.error('Error fetching current turn:', error);
        }
    }

    cleanup() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// Initialize the display updater when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new DisplayUpdater();
});