import { Reservation } from "../models/reservation.model.js";
import { logger } from "../utils/logger.utils.js";
import { shipToAuditLog } from "../utils/auditShipper.utils.js";
import { triggerEmailNotification } from "../utils/notificationShipper.utils.js";

// 1. CREATE A RESERVATION
export const createReservation = async (req, res) => {
    logger.debug(`Initiating reservation placement for auth ID: ${req.body.authUserId}`);
    try {
        const { eventTitle, reservationDate, numberOfGuests, recipientEmail } = req.body;

        const authUserId = req.user.id;

        if (!authUserId || !eventTitle || !reservationDate) {
            return res.status(400).json({ message: "Required reservation parameters are missing" });
        }

        const booking = await Reservation.create({
            authUserId,
            eventTitle,
            reservationDate,
            numberOfGuests,
            status: "confirmed" // Auto-confirming for standard flow
        });

        // Ship transaction milestone to Audit Engine
        shipToAuditLog({
            userId: authUserId,
            action: "reservation_created",
            status: "success",
            meta: { bookingId: booking._id, eventTitle, date: reservationDate },
            ipAddress: req.ip
        });

        triggerEmailNotification({
            recipientEmail: recipientEmail || "gelo@example.com",
            templateName: "booking_confirmation",
            templateData: {
                authUserId,
                bookingId: booking._id,
                eventTitle
            }
        });

        logger.info(`Reservation successfully locked with ID: ${booking._id}`);
        return res.status(201).json({ message: "Reservation placed successfully", booking });
    } catch (error) {
        // Handle unique index duplicate booking conflict
        if (error.code === 11000) {
            logger.warn(`Reservation conflict: Slot already booked for ${req.body.eventTitle}`);
            return res.status(400).json({ message: "This event slot is already booked for this specific time!" });
        }

        logger.error(`Reservation creation collapsed: ${error.message}`);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// 2. GET ALL RESERVATIONS FOR A SPECIFIC USER
export const getUserReservations = async (req, res) => {
    try {
        const { authUserId } = req.params;
        const bookings = await Reservation.find({ authUserId }).sort({ reservationDate: 1 });

        return res.status(200).json(bookings);
    } catch (error) {
        logger.error(`Failed to fetch reservations: ${error.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// 3. CANCEL A RESERVATION
export const cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const cancelledBooking = await Reservation.findByIdAndUpdate(
            id,
            { $set: { status: "cancelled" } },
            { returnDocument: 'after' }
        );

        if (!cancelledBooking) {
            return res.status(404).json({ message: "Reservation record not found" });
        }

        // Ship cancellation milestone to Audit Engine
        shipToAuditLog({
            userId: cancelledBooking.authUserId,
            action: "reservation_cancelled",
            status: "success",
            meta: { bookingId: id, eventTitle: cancelledBooking.eventTitle },
            ipAddress: req.ip
        });

        logger.info(`Reservation marked cancelled for ID: ${id}`);
        return res.status(200).json({ message: "Reservation cancelled successfully", cancelledBooking });
    } catch (error) {
        logger.error(`Reservation cancellation failure: ${error.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};