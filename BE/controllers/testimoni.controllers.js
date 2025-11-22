import Testimoni from "../models/testimoni.models.js";
import Notification from "../models/notification.models.js";
import {
  uploadToCloudinary,
  isValidImageUrl,
  downloadAndUpload,
} from "../utils/uploadToCloudinary.js";

// ✅ GET All Testimoni
export const getAllTestimoni = async (req, res) => {
  try {
    const testimoni = await Testimoni.find().sort({ createdAt: -1 });
    res.status(200).json({ testimoni, success: true });
  } catch (error) {
    console.error("Error getAllTestimoni", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// ✅ CREATE Testimoni
export const createTestimoni = async (req, res) => {
  try {
    const {
      author,
      content,
      rating,
      testimoniImage: testimoniImageUrl,
      createdBy,
    } = req.body;
    let testimoniImage = "";

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file,
        "testimoni"
      );
      testimoniImage = result.url;
    } else if (testimoniImageUrl && isValidImageUrl(testimoniImageUrl)) {
      const result = await downloadAndUpload(testimoniImageUrl, "testimoni");
      testimoniImage = result.url;
    }

    const newTestimoni = await Testimoni.create({
      author,
      content,
      rating,
      testimoniImage,
    });

    await Notification.create({
      from: createdBy || "admin",
      to: "admin",
      type: "create",
      message: `Testimoni dari "${author}" telah dibuat oleh ${
        createdBy || "admin"
      }.`,
    });

    res.status(201).json({
      message: "Testimoni created",
      testimoni: newTestimoni,
      success: true,
    });
  } catch (error) {
    console.error("Error createTestimoni", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// // ✅ UPDATE Testimoni
// export const updateTestimoni = async (req, res) => {
//   try {
//     const {
//       author,
//       content,
//       rating,
//       testimoniImage: testimoniImageUrl,
//       updatedBy,
//     } = req.body;
//     const { id } = req.params;

//     let updateData = {};
//     if (author) updateData.author = author;
//     if (content) updateData.content = content;
//     if (rating) updateData.rating = rating;

//     if (req.file) {
//       const result = await uploadToCloudinary(
//         req.file.buffer,
//         req.file,
//         "testimoni"
//       );
//       updateData.testimoniImage = result.url;
//     } else if (testimoniImageUrl && isValidImageUrl(testimoniImageUrl)) {
//       const result = await downloadAndUpload(testimoniImageUrl, "testimoni");
//       updateData.testimoniImage = result.url;
//     }

//     if (Object.keys(updateData).length === 0) {
//       return res
//         .status(400)
//         .json({ message: "No data to update", success: false });
//     }

//     const updated = await Testimoni.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });

//     if (!updated) {
//       return res
//         .status(404)
//         .json({ message: "Testimoni not found", success: false });
//     }

//     await Notification.create({
//       from: updatedBy || "admin",
//       to: "admin",
//       type: "update",
//       message: `Testimoni dari "${updated.author}" telah diperbarui oleh ${
//         updatedBy || "admin"
//       }.`,
//     });

//     res.status(200).json({
//       message: "Testimoni updated",
//       testimoni: updated,
//       success: true,
//     });
//   } catch (error) {
//     console.error("Error updateTestimoni", error);
//     res.status(500).json({
//       message: "Internal server error",
//       success: false,
//       error: error.message,
//     });
//   }
// };



export const updateTestimoni = async (req, res) => {
  try {
    const {
      author,
      content,
      rating,
      testimoniImage: testimoniImageUrl,
      updatedBy,
      removeImage, // <-- pastikan ini ikut ditangkap
    } = req.body;
    const { id } = req.params;

    let updateData = {};
    if (author) updateData.author = author;
    if (content) updateData.content = content;
    if (rating) updateData.rating = rating;

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file,
        "testimoni"
      );
      updateData.testimoniImage = result.url;
    } else if (
      testimoniImageUrl &&
      isValidImageUrl(testimoniImageUrl)
    ) {
      const result = await downloadAndUpload(testimoniImageUrl, "testimoni");
      updateData.testimoniImage = result.url;
    }

    // ✅ Jika user ingin menghapus gambar
    if (removeImage === "true") {
      updateData.testimoniImage = null;
    }

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "No data to update", success: false });
    }

    const updated = await Testimoni.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Testimoni not found", success: false });
    }

    await Notification.create({
      from: updatedBy || "admin",
      to: "admin",
      type: "update",
      message: `Testimoni dari "${updated.author}" telah diperbarui oleh ${
        updatedBy || "admin"
      }.`,
    });

    res.status(200).json({
      message: "Testimoni updated",
      testimoni: updated,
      success: true,
    });
  } catch (error) {
    console.error("Error updateTestimoni", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};


// ✅ DELETE Testimoni
export const deleteTestimoni = async (req, res) => {
  try {
    const { deletedBy } = req.body;

    const deleted = await Testimoni.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Testimoni not found", success: false });
    }

    await Notification.create({
      from: deletedBy || "admin",
      to: "admin",
      type: "delete",
      message: `Testimoni dari "${deleted.author}" telah dihapus oleh ${
        deletedBy || "admin"
      }.`,
    });

    res.status(200).json({ message: "Testimoni deleted", success: true });
  } catch (error) {
    console.error("Error deleteTestimoni", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
