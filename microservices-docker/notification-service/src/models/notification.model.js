import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        recipientEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        templateName: {
            type: String,
            required: true,
            enum: ["welcome_email", "password_reset", "profile_update_alert", "booking_confirmation"],
        },
        status: {
            type: String,
            enum: ["pending", "sent", "failed"],
            default: "pending",
        },
        errorMessage: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export const NotificationLog = mongoose.model("NotificationLog", notificationSchema);