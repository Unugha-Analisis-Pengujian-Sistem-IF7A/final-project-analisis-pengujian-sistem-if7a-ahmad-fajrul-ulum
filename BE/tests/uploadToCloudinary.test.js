
import { jest } from "@jest/globals";

// Define mocks
jest.unstable_mockModule("../config/cloudinary.js", () => ({
    default: {
        uploader: {
            upload_stream: jest.fn(),
        },
    },
}));

jest.unstable_mockModule("streamifier", () => ({
    default: {
        createReadStream: jest.fn(),
    },
}));

jest.unstable_mockModule("sharp", () => ({
    default: jest.fn(),
}));

jest.unstable_mockModule("axios", () => ({
    default: {
        get: jest.fn(),
    },
}));

// Import modules AFTER mocks are defined
const cloudinary = (await import("../config/cloudinary.js")).default;
const streamifier = (await import("streamifier")).default;
const sharp = (await import("sharp")).default;
const axios = (await import("axios")).default;

const { uploadToCloudinary, isValidImageUrl, downloadAndUpload } = await import("../utils/uploadToCloudinary.js");

describe("uploadToCloudinary Util", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("uploadToCloudinary", () => {
        it("should reject if file buffer is empty", async () => {
            await expect(uploadToCloudinary(null, {})).rejects.toThrow("File buffer is empty");
        });

        it("should upload an image successfully", async () => {
            const mockResult = { secure_url: "http://url", public_id: "123" };
            const mockBuffer = Buffer.from("image");

            const sharpInstance = {
                resize: jest.fn().mockReturnThis(),
                jpeg: jest.fn().mockReturnThis(),
                toBuffer: jest.fn().mockResolvedValue(mockBuffer)
            };
            sharp.mockReturnValue(sharpInstance);

            const mockPipe = jest.fn();
            streamifier.createReadStream.mockReturnValue({ pipe: mockPipe });

            cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
                callback(null, mockResult);
                return {};
            });

            const result = await uploadToCloudinary(mockBuffer, { mimetype: "image/png" });

            expect(sharp).toHaveBeenCalled();
            expect(result).toEqual({ url: mockResult.secure_url, public_id: mockResult.public_id });
        });

        it("should upload raw file successfully", async () => {
            const mockResult = { secure_url: "http://url", public_id: "123" };
            const mockBuffer = Buffer.from("data");

            const mockPipe = jest.fn();
            streamifier.createReadStream.mockReturnValue({ pipe: mockPipe });

            cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
                callback(null, mockResult);
                return {};
            });

            const result = await uploadToCloudinary(mockBuffer, { mimetype: "application/pdf" });

            expect(sharp).not.toHaveBeenCalled();
            expect(result).toEqual({ url: mockResult.secure_url, public_id: mockResult.public_id });
        });

        it("should reject on cloudinary error", async () => {
            const mockBuffer = Buffer.from("image");
            const mockPipe = jest.fn();
            streamifier.createReadStream.mockReturnValue({ pipe: mockPipe });

            // Mock sharp
            const sharpInstance = {
                resize: jest.fn().mockReturnThis(),
                jpeg: jest.fn().mockReturnThis(),
                toBuffer: jest.fn().mockResolvedValue(mockBuffer)
            };
            sharp.mockReturnValue(sharpInstance);

            cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
                callback(new Error("Cloudinary Error"), null);
                return {};
            });

            await expect(uploadToCloudinary(mockBuffer, { mimetype: "image/png" })).rejects.toThrow("Cloudinary Error");
        });

        it("should handle error in processing flow inside IIFE", async () => {
            // Force an error in the async IIFE part, e.g. sharp failing
            const mockBuffer = Buffer.from("image");
            sharp.mockImplementation(() => { throw new Error("Processing Error"); });

            await expect(uploadToCloudinary(mockBuffer, { mimetype: "image/png" })).rejects.toThrow("Processing Error");
        });
    });

    describe("isValidImageUrl", () => {
        it("should validate domains correctly", () => {
            expect(isValidImageUrl("https://res.cloudinary.com/foo.jpg")).toBe(true);
            expect(isValidImageUrl("http://res.cloudinary.com/foo.jpg")).toBe(false);
        });
    });

    describe("downloadAndUpload", () => {
        it("should download and upload image", async () => {
            axios.get.mockResolvedValue({
                data: Buffer.from("img"),
                headers: { "content-type": "image/jpeg" }
            });

            const sharpInstance = {
                resize: jest.fn().mockReturnThis(),
                jpeg: jest.fn().mockReturnThis(),
                toBuffer: jest.fn().mockResolvedValue(Buffer.from("processed")),
            };
            sharp.mockReturnValue(sharpInstance);
            streamifier.createReadStream.mockReturnValue({ pipe: jest.fn() });
            cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
                callback(null, { secure_url: "uploaded", public_id: "id" });
                return {};
            });

            const result = await downloadAndUpload("https://example.com/img.jpg");
            expect(result.url).toBe("uploaded");
        });

        it("should throw error if content type is not image", async () => {
            axios.get.mockResolvedValue({
                data: Buffer.from("pdf"),
                headers: { "content-type": "application/pdf" }
            });

            await expect(downloadAndUpload("url")).rejects.toThrow("Error downloading image");
        });

        it("should throw generic error on download fail", async () => {
            axios.get.mockRejectedValue(new Error("Network Error"));
            await expect(downloadAndUpload("url")).rejects.toThrow("Error downloading image");
        });
    });
});
