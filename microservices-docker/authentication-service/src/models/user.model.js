import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minLength: 1,
            maxLength: 15,
        },

        password: {
            type: String,
            required: true,
            minLength: 8,
            maxLength: 60,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

// Before saving the user, hash the password
userSchema.pre("save", async function () {
    // 1. Only hash if the password has been changed (or is new)
    if (!this.isModified("password")) return;

    // 2. Hash the password
    this.password = await bcrypt.hash(this.password, 10);
s
    // Mongoose waits for the code to finish naturally.
});
// compare the password with the hashed password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);