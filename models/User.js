"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    role: {
        type: String,
        enum: ["student", "faculty", "academics"],
        required: true,
    },
    // Student specific fields
    regNo: {
        type: String,
        unique: true,
        sparse: true, // Allow null/undefined for other roles
    },
    rollNo: {
        type: String,
    },
    fatherName: {
        type: String,
    },
    dob: {
        type: Date
    },
    mobile: {
        type: String
    }
}, { timestamps: true });
var User = mongoose_1.models.User || (0, mongoose_1.model)("User", UserSchema);
exports.default = User;
