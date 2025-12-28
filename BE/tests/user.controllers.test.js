
import { jest } from "@jest/globals";

// Mocks
jest.unstable_mockModule("../middleware/multer.js", () => ({
    upload: {
        single: jest.fn(() => (req, res, next) => next()),
    },
}));

jest.unstable_mockModule("bcrypt", () => ({
    default: {
        compare: jest.fn(),
        genSalt: jest.fn(),
        hash: jest.fn()
    }
}));

jest.unstable_mockModule("../models/user.models.js", () => ({
    default: {
        findById: jest.fn(),
        findOne: jest.fn()
    }
}));

jest.unstable_mockModule("../utils/uploadToCloudinary.js", () => ({
    uploadToCloudinary: jest.fn(),
    isValidImageUrl: jest.fn(),
    downloadAndUpload: jest.fn()
}));

jest.unstable_mockModule("../config/firebase.js", () => ({
    default: {
        auth: jest.fn(() => ({
            updateUser: jest.fn()
        }))
    }
}));

// Imports
const { updateProfile } = await import("../controllers/user.controllers.js");
const User = (await import("../models/user.models.js")).default;
const bcrypt = (await import("bcrypt")).default;
const { uploadToCloudinary, downloadAndUpload } = await import("../utils/uploadToCloudinary.js");
const admin = (await import("../config/firebase.js")).default;

describe("User Controllers - updateProfile", () => {
    const handler = updateProfile[1]; // The async function
    let req, res;
    const mockUser = {
        _id: "userId",
        userName: "oldUser",
        email: "old@test.com",
        fullName: "Old Name",
        password: "hashedPassword",
        firebaseId: "fb123",
        role: "user",
        save: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            user: { _id: "userId" },
            body: {},
            file: null
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockUser.save.mockResolvedValue(mockUser);
    });

    it("should return 401 if not authorized", async () => {
        req.user = null;
        await handler(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if user not found", async () => {
        User.findById.mockResolvedValue(null);
        await handler(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should update profile successfully with no changes", async () => {
        User.findById.mockResolvedValue(mockUser);
        await handler(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Tidak ada perubahan" }));
    });

    it("should update user basic info", async () => {
        User.findById.mockResolvedValue(mockUser);
        req.body = { fullName: "New Name" };

        // Mock Firebase update
        const updateUserMock = jest.fn().mockResolvedValue({});
        admin.auth.mockReturnValue({ updateUser: updateUserMock });

        await handler(req, res);

        expect(updateUserMock).toHaveBeenCalledWith("fb123", expect.objectContaining({ displayName: "New Name" }));
        expect(mockUser.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should update password", async () => {
        User.findById.mockResolvedValue(mockUser);
        req.body = { oldPassword: "pass", newPassword: "newPass" };

        bcrypt.compare.mockResolvedValue(true);
        bcrypt.genSalt.mockResolvedValue("salt");
        bcrypt.hash.mockResolvedValue("newHashed");

        const updateUserMock = jest.fn().mockResolvedValue({});
        admin.auth.mockReturnValue({ updateUser: updateUserMock });

        await handler(req, res);

        expect(bcrypt.compare).toHaveBeenCalledWith("pass", "hashedPassword");
        expect(mockUser.save).toHaveBeenCalled();
    });

    it("should return 400 if old password doesn't match", async () => {
        User.findById.mockResolvedValue(mockUser);
        req.body = { oldPassword: "wrong", newPassword: "newPass" };
        bcrypt.compare.mockResolvedValue(false);

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Password lama salah" }));
    });

    it("should handle image upload", async () => {
        User.findById.mockResolvedValue(mockUser);
        req.file = { buffer: Buffer.from("img") };

        uploadToCloudinary.mockResolvedValue({ url: "http://new-img.com" });
        const updateUserMock = jest.fn().mockResolvedValue({});
        admin.auth.mockReturnValue({ updateUser: updateUserMock });

        await handler(req, res);

        expect(uploadToCloudinary).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should handle validation error (duplicates)", async () => {
        User.findById.mockResolvedValue(mockUser);
        req.body = { userName: "existingUser" };
        User.findOne.mockResolvedValue({ userName: "existingUser" }); // Duplicate found

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Username sudah digunakan" }));
    });

    it("should return 500 on unexpected error", async () => {
        User.findById.mockRejectedValue(new Error("DB Error"));
        await handler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});
