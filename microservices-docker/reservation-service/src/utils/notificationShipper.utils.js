import axios from 'axios';

/**
 * Fires a background network request to the Notification Service to dispatch an email.
 */
export const triggerEmailNotification = async ({ recipientEmail, templateName, templateData }) => {
    try {
        const emailPayload = {
            recipientEmail,
            templateName,
            templateData
        };

        // Post directly to your Notification Service's endpoint on port 3008
        await axios.post(process.env.NOTIF_SERVICE_URL, emailPayload);
    } catch (err) {
        // Log locally if the notification engine is unreachable, but don't crash the Auth system
        console.error('Failed to trigger background notification:', err.message);
    }
};