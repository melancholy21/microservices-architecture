import { UserProfile } from "../models/userProfile.model.js";
import { logger } from "../utils/logger.utils.js";
import { shipToAuditLog } from "../utils/auditShipper.utils.js";

// 1. INITIALIZE GLOBAL ACCOUNT SETTINGS (Triggered on Registration Onboarding)
export const initializeSettings = async (req, res) => {
    logger.debug(`Initializing global state registry for auth ID: ${req.body.authUserId}`);
    try {
        const { authUserId, role, preferences } = req.body;

        if (!authUserId) {
            return res.status(400).json({ message: "authUserId is required to map account configuration" });
        }

        const configuration = await UserProfile.create({
            authUserId,
            role: role || "client",
            preferences: preferences || { theme: "dark", language: "en" }
        });

        return res.status(201).json({ message: "Global account state initialized", configuration });
    } catch (error) {
        logger.error(`Account initialization failed: ${error.message}`);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// 2. FETCH SETTINGS FOR THE CURRENT SECURE SESSION
export const getMySettings = async (req, res) => {
    try {
        // Grabbed securely straight from the decoded JWT token session
        const authUserId = req.user.id;
        const settings = await UserProfile.findOne({ authUserId });

        if (!settings) {
            return res.status(404).json({ message: "Account configurations not found for this profile" });
        }

        return res.status(200).json(settings);
    } catch (error) {
        logger.error(`Failed to pull user profile settings: ${error.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// 3. ADMINISTRATIVE OVERRIDE: SUSPEND OR CHANGE ROLES (Admin Only Concept)
export const administrativeOverride = async (req, res) => {
    try {
        const { targetAuthUserId } = req.params;
        const { role, accountStatus } = req.body;

        const updatedAccount = await UserProfile.findOneAndUpdate(
            { authUserId: targetAuthUserId },
            { $set: { role, accountStatus } },
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedAccount) {
            return res.status(404).json({ message: "Target account directory entry not found" });
        }

        // Ship Administrative Compliance update to Audit Engine
        shipToAuditLog({
            userId: req.user.id, // The Admin executing the action
            action: "user_account_administrative_modification",
            status: "success",
            meta: { modifiedUser: targetAuthUserId, newStatus: accountStatus, newRole: role },
            ipAddress: req.ip
        });

        logger.info(`Administrative state updated for target identity: ${targetAuthUserId}`);
        return res.status(200).json({ message: "Account parameters modified successfully", updatedAccount });
    } catch (error) {
        logger.error(`Administrative modification collapsed: ${error.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};