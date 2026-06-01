import mongoose, { Schema } from "mongoose";

const userProfileSchema = new Schema(
    {
        authUserId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ["client", "staff", "admin"],
            default: "client",
        },
        accountStatus: {
            type: String,
            enum: ["active", "suspended", "unverified"],
            default: "active",
        },
        preferences: {
            theme: { type: String, enum: ["light", "dark"], default: "dark" },
            language: { type: String, default: "en" },
        },
    },
    {
        timestamps: true,
    }
);

export const UserProfile = mongoose.model("UserProfile", userProfileSchema);