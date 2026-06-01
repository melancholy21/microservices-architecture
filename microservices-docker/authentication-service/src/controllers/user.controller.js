import { User } from "../models/user.model.js";
import { generateToken } from "../utils/jwt.utils.js";
import { logger } from "../utils/logger.utils.js";
import { shipToAuditLog } from "../utils/auditShipper.utils.js";
import { triggerEmailNotification } from "../utils/notificationShipper.utils.js";

const registerUser = async (req, res) => {
    logger.debug(`User registration request initiated for email: ${req.body.email}`);
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({
            $or: [
                { username: username.toLowerCase() },
                { email: email.toLowerCase() },
            ],
        });

        if (existingUser) {
            logger.warn(`Registration rejected: Username or Email conflict for ${email}`);
            return res.status(400).json({
                message: "Username or email already exists",
            });
        }

        const user = await User.create({
            username,
            password,
            email: email.toLowerCase(),
        });

        const token = generateToken(user._id);

        // Audit Dispatch: Account Created
        shipToAuditLog({
            userId: user._id,
            action: 'user_registration_success',
            status: 'success',
            meta: { username: user.username, email: user.email },
            ipAddress: req.ip
        });

        triggerEmailNotification({
            recipientEmail: user.email,
            templateName: "welcome_email",
            templateData: {
                username: user.username,
                authUserId: user._id
            }
        });

        logger.info(`Successfully created user profile with ID: ${user._id}`);
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: user._id, email: user.email, username: user.username },
        });
    } catch (error) {
        logger.error(`Registration process collapsed!`, { error: error.message, stack: error.stack });
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const loginUser = async (req, res) => {
    logger.debug(`Login trace started for email pointer: ${req.body.email}`);
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            // Audit Dispatch: Target account didn't exist
            shipToAuditLog({
                userId: 'unknown',
                action: 'user_login_failed',
                status: 'failure',
                meta: { attemptedEmail: email, reason: 'Account non-existent' },
                ipAddress: req.ip
            });

            logger.warn(`Authentication failed: Account match not found for ${email}`);
            return res.status(404).json({ message: "User not found!" });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            // Audit Dispatch: Invalid credential match
            shipToAuditLog({
                userId: user._id,
                action: 'user_login_failed',
                status: 'failure',
                meta: { reason: 'Incorrect credentials provided' },
                ipAddress: req.ip
            });

            logger.warn(`Authentication failed: Password mismatch for ${email}`);
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        const token = generateToken(user._id);

        // Audit Dispatch: Successful Login
        shipToAuditLog({
            userId: user._id,
            action: 'user_login_success',
            status: 'success',
            ipAddress: req.ip
        });

        logger.info(`User session established for ID: ${user._id}`);
        res.status(200).json({
            message: "Login successful!",
            token,
            user: { id: user._id, email: user.email, username: user.username },
        });
    } catch (error) {
        logger.error(`Login router crashed!`, { error: error.message, stack: error.stack });
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Audit Dispatch: User closed session
        shipToAuditLog({
            userId: user._id,
            action: 'user_logout_success',
            status: 'success',
            ipAddress: req.ip
        });

        logger.info(`User session destroyed for ID: ${user._id}`);
        res.status(200).json({ message: "Logout successful!" });
    } catch (error) {
        logger.error(`Logout breakdown: ${error.message}`);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export { registerUser, loginUser, logoutUser };