class QueueUpdater {
    constructor(updateInterval = 3000) {
        this.updateInterval = updateInterval;
        this.intervalId = null;
        this.init();
    }

    init() {
        this.fetchQueueData();
        this.intervalId = setInterval(() => this.fetchQueueData(), this.updateInterval);
        window.addEventListener('unload', () => this.cleanup());
    }

    updateQueueDisplay(data) {
        const queueContainer = document.getElementById('queue-data');
        if (!queueContainer) return;
    
        queueContainer.innerHTML = ''; // Clear existing content
        
        if (!data || data.length === 0) {
            queueContainer.innerHTML = '<tr><td colspan="5">No turns in queue</td></tr>';
            return;
        }
        
        data.forEach(item => {
            const row = document.createElement('tr');
            const timestamp = new Date(item.timestamp);
            
            row.innerHTML = `
                <td>${item.turn}</td>
                <td>${item.name}</td>
                <td>${item.matricula}</td>
                <td>${timestamp.toLocaleTimeString()}</td>
                <td>
                    <button onclick="queueUpdater.moveToCurrentTurn('${item.id}')" class="move-button">
                        Move to Current
                    </button>
                </td>
            `;
            
            queueContainer.appendChild(row);
        });
    }

    async moveToCurrentTurn(turnId) {
        console.log('Attempting to move turn:', turnId); // Debug log
        try {
            const response = await fetch('/api/move-to-current', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ turnId: turnId })
            });
    
            console.log('Response status:', response.status); // Debug log
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData); // Debug log
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
    
            // Refresh the data immediately after moving
            await this.fetchQueueData();
        } catch (error) {
            console.error('Error moving turn:', error);
            alert('Failed to move turn. Please try again.');
        }
    }

    async fetchQueueData() {
        try {
            const response = await fetch('/api/queue-data');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.updateQueueDisplay(data.queue);
        } catch (error) {
            console.error('Error fetching queue data:', error);
        }
    }

    cleanup() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// Initialize the queue updater when the DOM is fully loaded
let queueUpdater;
document.addEventListener('DOMContentLoaded', () => {
    queueUpdater = new QueueUpdater();
});