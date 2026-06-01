import mongoose, { Schema } from "mongoose";

const reservationSchema = new Schema(
    {
        authUserId: {
            type: String,
            required: true,
            trim: true,
        },
        eventTitle: {
            type: String,
            required: true,
            trim: true,
        },
        reservationDate: {
            type: Date,
            required: true,
        },
        numberOfGuests: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

// Optional: A compound index to prevent duplicate bookings for the same event title on the exact same date/time
reservationSchema.index({ eventTitle: 1, reservationDate: 1 }, { unique: true });

export const Reservation = mongoose.model("Reservation", reservationSchema);