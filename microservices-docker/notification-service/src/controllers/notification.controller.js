import { NotificationLog } from "../models/notification.model.js";
import { logger } from "../utils/logger.utils.js";
import { shipToAuditLog } from "../utils/auditShipper.utils.js";

export const sendEmailNotification = async (req, res) => {
    logger.debug(`Notification dispatch request received for: ${req.body.recipientEmail}`);
    try {
        const { recipientEmail, templateName, templateData } = req.body;

        if (!recipientEmail || !templateName) {
            return res.status(400).json({ message: "Recipient email and template name are required" });
        }

        // 1. Initialize a pending record in notification_db
        const notification = await NotificationLog.create({
            recipientEmail,
            templateName,
            status: "pending"
        });

        // 2. Mock Email Template processing framework
        let emailBody = "";
        if (templateName === "welcome_email") {
            emailBody = `Subject: Welcome to GeloDev App! \nBody: Hi ${templateData?.username || 'User'}, your account setup is complete.`;
        } else if (templateName === "profile_update_alert") {
            emailBody = `Subject: Security Alert: Profile Updated \nBody: Your account details were modified successfully.`;
        } else if (templateName === "booking_confirmation") { // 👈 ADD THIS NEW BLOCK
            emailBody = `Subject: 🎉 Booking Confirmed: ${templateData?.eventTitle || 'Your Event'} \nBody: Great news! Your reservation has been locked into our system. \nTracking ID: ${templateData?.bookingId || 'N/A'}`;
        }

        // 3. Simulate transmitting over an external email gateway
        logger.info(`\n [EMAIL SERVER OUTBOUND DATA TRANSFER]:\n---------------------------------------\n${emailBody}\n---------------------------------------`);

        // Update record state to 'sent'
        notification.status = "sent";
        await notification.save();

        // Ship asynchronous compliance milestone to the Audit Engine
        shipToAuditLog({
            userId: templateData?.authUserId || "anonymous",
            action: `notification_${templateName}_delivered`,
            status: "success",
            meta: { recipient: recipientEmail, notificationId: notification._id },
            ipAddress: req.ip
        });

        return res.status(200).json({
            message: "Notification compiled and sent successfully",
            notificationId: notification._id,
            status: notification.status
        });

    } catch (error) {
        logger.error(`Notification engine dispatch collapsed: ${error.message}`);

        // If we have an existing log record, update it to failed state for debugging histories
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};