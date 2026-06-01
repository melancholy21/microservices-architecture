import { ClientProfile } from "../models/client.model.js";
import { logger } from "../utils/logger.utils.js";
import { shipToAuditLog } from "../utils/auditShipper.utils.js";

// 1. CREATE OR INITIALIZE PROFILE
export const createProfile = async (req, res) => {
    logger.debug(`Initiating profile creation for auth ID: ${req.body.authUserId}`);
    try {
        const { authUserId, firstName, lastName, companyName, phoneNumber } = req.body;

        if (!authUserId || !firstName || !lastName) {
            return res.status(400).json({ message: "Required profile fields are missing" });
        }

        const profileExists = await ClientProfile.findOne({ authUserId });
        if (profileExists) {
            return res.status(400).json({ message: "Profile already exists for this user" });
        }

        const profile = await ClientProfile.create({
            authUserId,
            firstName,
            lastName,
            companyName,
            phoneNumber,
        });

        // Ship milestone to Audit Engine
        shipToAuditLog({
            userId: authUserId,
            action: "client_profile_created",
            status: "success",
            meta: { name: `${firstName} ${lastName}`, company: companyName },
            ipAddress: req.ip
        });

        logger.info(`Profile successfully generated with ID: ${profile._id}`);
        return res.status(201).json({ message: "Profile created successfully", profile });
    } catch (error) {
        logger.error(`Profile creation collapsed: ${error.message}`);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// 2. GET PROFILE BY AUTH ID
export const getProfile = async (req, res) => {
    try {
        const { authUserId } = req.params;
        const profile = await ClientProfile.findOne({ authUserId });

        if (!profile) {
            return res.status(404).json({ message: "Profile data entry not found" });
        }

        return res.status(200).json(profile);
    } catch (error) {
        logger.error(`Failed to fetch profile: ${error.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// 3. UPDATE PROFILE DETAILS
export const updateProfile = async (req, res) => {
    try {
        const { authUserId } = req.params;

        const updatedProfile = await ClientProfile.findOneAndUpdate(
            { authUserId },
            { $set: req.body },
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Ship modification milestone to Audit Engine
        shipToAuditLog({
            userId: authUserId,
            action: "client_profile_updated",
            status: "success",
            meta: { updatedFields: Object.keys(req.body) },
            ipAddress: req.ip
        });

        return res.status(200).json({ message: "Profile updated successfully", updatedProfile });
    } catch (error) {
        logger.error(`Profile update failure: ${error.message}`);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};