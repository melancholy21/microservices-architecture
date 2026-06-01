import jwt from 'jsonwebtoken';

/**
 * Generates a signed JSON Web Token for an authenticated user.
 * @param {string} userId - The MongoDB document ObjectID of the user.
 * @returns {string} Signed JWT token string.
 */
export const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // Token remains active for 24 hours
    );
};