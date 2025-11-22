import heroModels from "../models/hero.models.js";
import Notification from "../models/notification.models.js";
import {
  uploadToCloudinary,
  isValidImageUrl,
  downloadAndUpload,
} from "../utils/uploadToCloudinary.js";

// helper untuk parse boolean ke string
const parseBoolean = (val) => val === true || val === "true";

// ✅ GET All Heroes
export const getHero = async (req, res) => {
  try {
    const heroes = await heroModels.find().sort({ createdAt: -1 });

    res.status(200).json({ heroes, success: true });
  } catch (error) {
    console.error("Error getHero", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// ✅ CREATE Hero
export const createHero = async (req, res) => {
  try {
    const { title, heroImage: heroImageUrl, createdBy, isActive } = req.body;
    let heroImage = "";

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file,
        "hero"
      );
      heroImage = result.url;
    } else if (heroImageUrl && isValidImageUrl(heroImageUrl)) {
      const result = await downloadAndUpload(heroImageUrl, "hero");
      heroImage = result.url;
    }

    const activeFlag = parseBoolean(isActive);
    if (activeFlag) {
      await heroModels.updateMany({ isActive: true }, { isActive: false });
    }

    const newHero = await heroModels.create({ title, heroImage, isActive });

    await Notification.create({
      from: createdBy || "admin",
      to: "admin",
      type: "create",
      message: `Hero "${title}" telah dibuat oleh ${createdBy || "admin"}.`,
    });

    res
      .status(201)
      .json({ message: "Hero created", hero: newHero, success: true });
  } catch (error) {
    console.error("Error createHero", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// ✅ UPDATE Hero
export const updateHero = async (req, res) => {
  try {
    const { title, heroImage: heroImageUrl, updatedBy, isActive } = req.body;
    const { id } = req.params;
    let updateData = {};
    if (title) updateData.title = title;

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file,
        "hero"
      );
      updateData.heroImage = result.url;
    } else if (heroImageUrl && isValidImageUrl(heroImageUrl)) {
      const result = await downloadAndUpload(heroImageUrl, "hero");
      updateData.heroImage = result.url;
    }

    // update isActive
    const activeFlag = parseBoolean(isActive);
    if (activeFlag) {
      await heroModels.updateMany({ isActive: true }, { isActive: false });
      updateData.isActive = true;
    } else {
      updateData.isActive = false;
    }

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "No data to update", success: false });
    }

    const updatedHero = await heroModels.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedHero) {
      return res
        .status(404)
        .json({ message: "Hero not found", success: false });
    }

    await Notification.create({
      from: updatedBy || "admin",
      to: "admin",
      type: "update",
      message: `Hero "${updatedHero.title}" telah diperbarui oleh ${
        updatedBy || "admin"
      }.`,
    });

    res
      .status(200)
      .json({ message: "Hero updated", hero: updatedHero, success: true });
  } catch (error) {
    console.error("Error updateHero", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// ✅ DELETE Hero
export const deleteHero = async (req, res) => {
  try {
    const deletedHero = await heroModels.findByIdAndDelete(req.params.id);
    if (!deletedHero) {
      return res
        .status(404)
        .json({ message: "Hero not found", success: false });
    }

    await Notification.create({
      from: req.body.deletedBy || "admin",
      to: "admin",
      type: "delete",
      message: `Hero "${deletedHero.title}" telah dihapus oleh ${
        req.body.deletedBy || "admin"
      }.`,
    });

    res.status(200).json({ message: "Hero deleted", success: true });
  } catch (error) {
    console.error("Error deleteHero", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
