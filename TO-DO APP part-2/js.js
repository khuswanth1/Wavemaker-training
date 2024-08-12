// Function to display a notification for an upcoming due date
// Request notification permission from the user
if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

// Function to show notification
function showNotification(task) {
    if (Notification.permission === 'granted') {
        new Notification('Task Deadline Approaching', {
            body: `The deadline for task "${task.text}" is approaching!`,
            icon: 'path/to/icon.png' // Optional: Add an icon
        });
    }
}

// Function to check deadlines and schedule notifications
function checkDeadlines(tasks) {
    const now = new Date();

    tasks.forEach(task => {
        const deadline = new Date(task.duration); // Assuming `duration` is the deadline
        const timeRemaining = deadline - now;

        // Set the notification to trigger when deadline is within 1 hour
        const notificationThreshold = 60 * 60 * 1000; // 1 hour in milliseconds

        if (timeRemaining <= notificationThreshold && timeRemaining > 0) {
            // Calculate how long to wait before sending the notification
            const waitTime = timeRemaining > 0 ? timeRemaining : 0;
            setTimeout(() => showNotification(task), waitTime);
        }
    });
}

// Function to periodically check deadlines
function periodicDeadlineCheck() {
    const tasks = JSON.parse(localStorage.getItem('New Todo')) || [];
    checkDeadlines(tasks);
}

setInterval(periodicDeadlineCheck, 60000);