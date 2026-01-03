
import { jest } from "@jest/globals";

// Define mock functions for User instance
const mockSave = jest.fn();

// Mocks
jest.unstable_mockModule("bcrypt", () => ({
    default: {
        hash: jest.fn(),
        compare: jest.fn()
    }
}));

// Mock User model as a class with static methods
const mockFindOne = jest.fn();
const mockFindById = jest.fn();

jest.unstable_mockModule("../models/user.models.js", () => ({
    default: jest.fn().mockImplementation((data) => ({
        ...data,
        save: mockSave
    }))
}));

// Attach static methods to the mocked class
const UserModule = await import("../models/user.models.js");
UserModule.default.findOne = mockFindOne;
UserModule.default.findById = mockFindById;


jest.unstable_mockModule("../config/firebase.js", () => ({
    default: {
        auth: jest.fn(() => ({
            createUser: jest.fn(),
            verifyIdToken: jest.fn(),
            getUser: jest.fn(),
            createCustomToken: jest.fn()
        }))
    }
}));

jest.unstable_mockModule("../service/generateOTP.js", () => ({
    generateOTP: jest.fn(),
    expiredOTP: jest.fn()
}));

jest.unstable_mockModule("../config/mailer.js", () => ({
    default: {
        sendMail: jest.fn()
    }
}));

// Imports
const { register, login, verify2FA, forgotPassword, resetPassword, getMe, logout } = await import("../controllers/auth.controllers.js");
const User = (await import("../models/user.models.js")).default;
const bcrypt = (await import("bcrypt")).default;
const admin = (await import("../config/firebase.js")).default;
const { generateOTP, expiredOTP } = await import("../service/generateOTP.js");
const transporter = (await import("../config/mailer.js")).default;

describe("Auth Controllers", () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            clearCookie: jest.fn()
        };
    });

    describe("register", () => {
        it("should return 400 for invalid email", async () => {
            req.body = { email: "invalid-email", password: "password123" };
            await register(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid email format" });
        });

        it("should return 400 for short password", async () => {
            req.body = { email: "test@example.com", password: "123" };
            await register(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Password must be at least 6 characters long" });
        });

        it("should return 400 if email already exists", async () => {
            req.body = { email: "test@example.com", password: "password123" };
            User.findOne.mockResolvedValue({ email: "test@example.com" });

            await register(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Email already exists" });
        });

        it("should register successfully", async () => {
            req.body = {
                userName: "testuser",
                email: "test@example.com",
                password: "password123",
                fullName: "Test User",
                role: "user"
            };
            User.findOne.mockResolvedValue(null);

            const firebaseCreateUserMock = jest.fn().mockResolvedValue({ uid: "firebase_uid" });
            admin.auth.mockReturnValue({ createUser: firebaseCreateUserMock });

            bcrypt.hash.mockResolvedValue("hashed_password");

            mockSave.mockResolvedValue({}); // Success save

            await register(req, res);

            expect(admin.auth).toHaveBeenCalled();
            expect(firebaseCreateUserMock).toHaveBeenCalledWith({ email: "test@example.com", password: "password123" });
            expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
            expect(mockSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "User registered successfully" });
        });

        it("should handle registration errors", async () => {
            req.body = { email: "test@example.com", password: "password123" };
            User.findOne.mockRejectedValue(new Error("DB Error"));

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining("Failed to register") }));
        });
    });

    describe("login", () => {
        it("should return 400 if idToken is missing", async () => {
            req.body = {};
            await login(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "ID token is required" });
        });

        it("should return 401 if idToken is invalid", async () => {
            req.body = { idToken: "invalid" };
            const verifyIdTokenMock = jest.fn().mockResolvedValue({ uid: null });
            admin.auth.mockReturnValue({ verifyIdToken: verifyIdTokenMock });

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid ID token" });
        });

        it("should return 404 if user not found", async () => {
            req.body = { idToken: "token" };
            const verifyIdTokenMock = jest.fn().mockResolvedValue({ uid: "firebase_uid" });
            admin.auth.mockReturnValue({ verifyIdToken: verifyIdTokenMock });
            User.findById.mockResolvedValue(null);

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });

        it("should login successfully and send OTP", async () => {
            req.body = { idToken: "token" };
            const verifyIdTokenMock = jest.fn().mockResolvedValue({ uid: "mongo_id" });
            const getUserMock = jest.fn().mockResolvedValue({ uid: "firebase_uid" });

            admin.auth.mockReturnValue({
                verifyIdToken: verifyIdTokenMock,
                getUser: getUserMock
            });

            const mockUserInstance = {
                _id: "mongo_id",
                email: "test@example.com",
                fullName: "Test User",
                firebaseId: "firebase_uid",
                save: mockSave
            };
            User.findById.mockResolvedValue(mockUserInstance);

            generateOTP.mockReturnValue("123456");
            expiredOTP.mockReturnValue(new Date().getTime() + 300000);

            transporter.sendMail.mockResolvedValue({});

            await login(req, res);

            expect(mockSave).toHaveBeenCalled(); // Should save OTP
            expect(transporter.sendMail).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "OTP sent to your email" }));
        });
    });

    describe("verify2FA", () => {
        it("should verify OTP and return custom token", async () => {
            req.body = { uid: "user_id", otp: "123456" };
            const mockUserInstance = {
                _id: "user_id",
                otpCode: "123456",
                otpExpire: new Date(Date.now() + 10000), // Future
                save: mockSave
            };
            User.findById.mockResolvedValue(mockUserInstance);

            const createCustomTokenMock = jest.fn().mockResolvedValue("custom_token");
            admin.auth.mockReturnValue({ createCustomToken: createCustomTokenMock });

            await verify2FA(req, res);

            expect(mockSave).toHaveBeenCalled(); // Clear OTP
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ customToken: "custom_token" }));
        });

        it("should return 400 for invalid OTP", async () => {
            req.body = { uid: "user_id", otp: "wrong" };
            const mockUserInstance = {
                _id: "user_id",
                otpCode: "123456",
                otpExpire: new Date(Date.now() + 10000)
            };
            User.findById.mockResolvedValue(mockUserInstance);

            await verify2FA(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid OTP" });
        });
    });

    describe("forgotPassword", () => {
        it("should return 404 if user not found", async () => {
            req.body = { email: "notfound@example.com" };
            User.findOne.mockResolvedValue(null);

            await forgotPassword(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });

        it("should send OTP for password reset", async () => {
            req.body = { email: "test@example.com" };
            const mockUserInstance = {
                email: "test@example.com",
                save: mockSave
            };
            User.findOne.mockResolvedValue(mockUserInstance);
            generateOTP.mockReturnValue("654321");
            expiredOTP.mockReturnValue(new Date().getTime() + 300000);
            transporter.sendMail.mockResolvedValue({});

            await forgotPassword(req, res);

            expect(mockSave).toHaveBeenCalled();
            expect(transporter.sendMail).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "OTP sent to your email" });
        });
    });

    describe("resetPassword", () => {
        it("should return 404 if user not found", async () => {
            req.body = { email: "notfound@example.com" };
            User.findOne.mockResolvedValue(null);

            await resetPassword(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });

        it("should return 400 for invalid OTP", async () => {
            req.body = { email: "test@example.com", otp: "wrong", password: "newpass" };
            const mockUserInstance = {
                email: "test@example.com",
                otpCode: "123456",
                otpExpire: new Date(Date.now() + 10000)
            };
            User.findOne.mockResolvedValue(mockUserInstance);

            await resetPassword(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid OTP" });
        });

        it("should return 400 if OTP expired", async () => {
            req.body = { email: "test@example.com", otp: "123456", password: "newpass" };
            const mockUserInstance = {
                email: "test@example.com",
                otpCode: "123456",
                otpExpire: new Date(Date.now() - 10000) // Past
            };
            User.findOne.mockResolvedValue(mockUserInstance);

            await resetPassword(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "OTP expired" });
        });

        it("should reset password successfully", async () => {
            req.body = { email: "test@example.com", otp: "123456", password: "newpass" };
            const mockUserInstance = {
                email: "test@example.com",
                otpCode: "123456",
                otpExpire: new Date(Date.now() + 10000),
                save: mockSave
            };
            User.findOne.mockResolvedValue(mockUserInstance);
            bcrypt.hash.mockResolvedValue("new_hashed_password");

            await resetPassword(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith("newpass", 10);
            expect(mockSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Password reset success" });
        });
    });

    describe("getMe", () => {
        it("should return user info", async () => {
            req.user = { _id: "user_id" };
            const mockUser = {
                _id: "user_id",
                userName: "test",
                email: "test@example.com"
            };

            // Mock chainable select
            const mockQuery = {
                select: jest.fn().mockResolvedValue(mockUser)
            };
            User.findById.mockReturnValue(mockQuery);

            await getMe(req, res);

            expect(User.findById).toHaveBeenCalledWith("user_id");
            expect(mockQuery.select).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ user: mockUser });
        });

        it("should return 404 if user not found", async () => {
            req.user = { _id: "user_id" };
            const mockQuery = {
                select: jest.fn().mockResolvedValue(null)
            };
            User.findById.mockReturnValue(mockQuery);

            await getMe(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });

        it("should return 500 on unexpected error", async () => {
            const mockQuery = {
                select: jest.fn().mockRejectedValue(new Error("DB Error"))
            };
            User.findById.mockReturnValue(mockQuery);

            await getMe(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining("Failed to get user") }));
        });
    });

    describe("logout", () => {
        it("should clear cookie and logout", async () => {
            await logout(req, res);
            expect(res.clearCookie).toHaveBeenCalledWith("authToken");
            expect(res.json).toHaveBeenCalledWith({ message: "Logout success" });
        });

        it("should return 500 on unexpected error", async () => {
            res.clearCookie.mockImplementation(() => { throw new Error("Cookie Error"); });

            await logout(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining("Failed to logout") }));
        });
    });
});
