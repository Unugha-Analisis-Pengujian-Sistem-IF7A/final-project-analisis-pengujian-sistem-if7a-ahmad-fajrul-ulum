import logoPTModels from "../models/logoPT.models.js";
import Notification from "../models/notification.models.js";
import {
  uploadToCloudinary,
  isValidImageUrl,
  downloadAndUpload,
} from "../utils/uploadToCloudinary.js";

// GET ALL LogoPT
export const getLogoPT = async (req, res) => {
  try {
    const logoPT = await logoPTModels.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "Success get LogoPT", logoPT, success: true });
  } catch (error) {
    console.error("Error getLogoPT", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// CREATE LogoPT
export const createLogoPT = async (req, res) => {
  try {
    const { title, logoPTImage: logoPTImageUrl, createdBy } = req.body;
    let logoPTImage = "";

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file,
        "logoPT"
      );
      logoPTImage = result.url;
    } else if (logoPTImageUrl && isValidImageUrl(logoPTImageUrl)) {
      const result = await downloadAndUpload(logoPTImageUrl, "logoPT");
      logoPTImage = result.url;
    }

    const newLogoPT = await logoPTModels.create({ title, logoPTImage });

    await Notification.create({
      from: createdBy || "admin",
      to: "admin",
      type: "create",
      message: `LogoPT "${title}" telah dibuat oleh ${createdBy || "admin"}.`,
    });

    res
      .status(201)
      .json({ message: "LogoPT created", logoPT: newLogoPT, success: true });
  } catch (error) {
    console.error("Error createLogoPT", error);
    res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
  }
};

// UPDATE LogoPT
export const updateLogoPT = async (req, res) => {
  try {
    const { title, logoPTImage: logoPTImageUrl, updatedBy } = req.body;
    let updateFields = {};
    if (title) updateFields.title = title;

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file,
        "logoPT"
      );
      updateFields.logoPTImage = result.url;
    } else if (logoPTImageUrl && isValidImageUrl(logoPTImageUrl)) {
      const result = await downloadAndUpload(logoPTImageUrl, "logoPT");
      updateFields.logoPTImage = result.url;
    }

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ message: "No data to update", success: false });
    }

    const updatedLogoPT = await logoPTModels.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updatedLogoPT) {
      return res
        .status(404)
        .json({ message: "LogoPT not found", success: false });
    }

    await Notification.create({
      from: updatedBy || "admin",
      to: "admin",
      type: "update",
      message: `LogoPT "${updatedLogoPT.title}" telah diperbarui oleh ${
        updatedBy || "admin"
      }.`,
    });

    res
      .status(200)
      .json({
        message: "LogoPT updated",
        logoPT: updatedLogoPT,
        success: true,
      });
  } catch (error) {
    console.error("Error updateLogoPT", error);
    res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
  }
};

// DELETE LogoPT
export const deleteLogoPT = async (req, res) => {
  try {
    const deletedLogoPT = await logoPTModels.findByIdAndDelete(req.params.id);

    if (!deletedLogoPT) {
      return res
        .status(404)
        .json({ message: "LogoPT not found", success: false });
    }

    await Notification.create({
      from: req.body.deletedBy || "admin",
      to: "admin",
      type: "delete",
      message: `LogoPT "${deletedLogoPT.title}" telah dihapus oleh ${
        req.body.deletedBy || "admin"
      }.`,
    });

    res.status(200).json({ message: "LogoPT deleted", success: true });
  } catch (error) {
    console.error("Error deleteLogoPT", error);
    res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
  }
};
