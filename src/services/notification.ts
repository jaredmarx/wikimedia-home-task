// Function to request notification permission from the user
export const requestNotificationPermission = async () => {
    // Check if the notification permission is not already granted
    if (Notification.permission !== 'granted') {
        // Request permission from the user
        await Notification.requestPermission();
    }
};

// Function to display a notification to the user
export const notifyUser = (title: string, options?: NotificationOptions) => {
    // Check if the notification permission is granted
    if (Notification.permission === 'granted') {
        // Create and display a new notification with the provided title and options
        new Notification(title, options);
    }
};

// Function to play a notification sound
export const playSound = () => {
    // Create a new Audio object with the path to the notification sound file
    const audio = new Audio('/notification-sound.wav'); // Ensure the file exists in the public directory
    // Attempt to play the audio and catch any errors that occur
    audio.play().catch(error => console.error("Failed to play sound:", error));
};
