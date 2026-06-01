import mongoose, { Schema } from "mongoose";

const clientSchema = new Schema(
    {
        authUserId: {
            type: String,
            required: true,
            unique: true, // Ties this profile explicitly to one auth account
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        companyName: {
            type: String,
            trim: true,
            default: "",
        },
        phoneNumber: {
            type: String,
            trim: true,
            default: "",
        },
        status: {
            type: String,
            enum: ["active", "suspended", "pending"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

export const ClientProfile = mongoose.model("ClientProfile", clientSchema);