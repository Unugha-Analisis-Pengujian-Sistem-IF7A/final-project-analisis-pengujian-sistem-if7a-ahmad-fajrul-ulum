import iklanModels from "../models/iklan.models.js";
import Notification from "../models/notification.models.js";
import {
  uploadToCloudinary,
  isValidImageUrl,
  downloadAndUpload,
} from "../utils/uploadToCloudinary.js";

// helper untuk konversi boolean ke string
const parseBoolean = (val) => val === true || val === "true";

// GET All Iklan
export const getIklan = async (req, res) => {
  try {
    const iklan = await iklanModels.find().sort({ createdAt: -1 });
    res.status(200).json({ iklan, success: true });
  } catch (error) {
    console.error("Error getIklan", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// CREATE Iklan
export const createIklan = async (req, res) => {
  try {
    const {
      title,
      iklanImage: iklanImageUrl,
      link,
      isActive,
      createdBy,
    } = req.body;

    let iklanImage = "";
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file,
        "iklan"
      );
      iklanImage = result.url;
    } else if (iklanImageUrl && isValidImageUrl(iklanImageUrl)) {
      const result = await downloadAndUpload(iklanImageUrl, "iklan");
      iklanImage = result.url;
    }

    const activeFlag = parseBoolean(isActive);
    if (activeFlag) {
      await iklanModels.updateMany({ isActive: true }, { isActive: false });
    }

    const newIklan = await iklanModels.create({
      title,
      iklanImage,
      link,
      isActive: activeFlag,
    });

    await Notification.create({
      from: createdBy || "admin",
      to: "admin",
      type: "create",
      message: `Iklan "${title}" telah dibuat oleh ${createdBy || "admin"}.`,
    });

    res
      .status(201)
      .json({ message: "Iklan created", iklan: newIklan, success: true });
  } catch (error) {
    console.error("Error createIklan", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// UPDATE Iklan
export const updateIklan = async (req, res) => {
  try {
    const {
      title,
      iklanImage: iklanImageUrl,
      updatedBy,
      link,
      isActive,
    } = req.body;
    const { id } = req.params;

    let updateFields = {};
    if (title) updateFields.title = title;
    if (link !== undefined) updateFields.link = link;

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file,
        "iklan"
      );
      updateFields.iklanImage = result.url;
    } else if (iklanImageUrl && isValidImageUrl(iklanImageUrl)) {
      const result = await downloadAndUpload(iklanImageUrl, "iklan");
      updateFields.iklanImage = result.url;
    }

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ message: "No data to update", success: false });
    }

    // handle perbarui isActive
    if (parseBoolean(isActive)) {
      await iklanModels.updateMany({ isActive: true }, { isActive: false });
      updateFields.isActive = true;
    } else if (isActive === "false" || isActive === false) {
      updateFields.isActive = false;
    }

    const updatedIklan = await iklanModels.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updatedIklan) {
      return res
        .status(404)
        .json({ message: "Iklan not found", success: false });
    }

    await Notification.create({
      from: updatedBy || "admin",
      to: "admin",
      type: "update",
      message: `Iklan "${updatedIklan.title}" telah diperbarui oleh ${
        updatedBy || "admin"
      }.`,
    });

    res
      .status(200)
      .json({ message: "Iklan updated", iklan: updatedIklan, success: true });
  } catch (error) {
    console.error("Error updateIklan", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// DELETE Iklan
export const deleteIklan = async (req, res) => {
  try {
    const deletedIklan = await iklanModels.findByIdAndDelete(req.params.id);
    if (!deletedIklan) {
      return res
        .status(404)
        .json({ message: "Iklan not found", success: false });
    }

    await Notification.create({
      from: req.body.deletedBy || "admin",
      to: "admin",
      type: "delete",
      message: `Iklan "${deletedIklan.title}" telah dihapus oleh ${
        req.body.deletedBy || "admin"
      }.`,
    });

    res.status(200).json({ message: "Iklan deleted", success: true });
  } catch (error) {
    console.error("Error deleteIklan", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
