import blogModels from "../models/blog.models.js";
import Notification from "../models/notification.models.js";
import {
  uploadToCloudinary,
  isValidImageUrl,
  downloadAndUpload,
} from "../utils/uploadToCloudinary.js";

// ✅ GET All Blogs with Pagination & Search
export const getAllBlogs = async (req, res) => {
  try {
    let { page = 1, limit = 10, search } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filters = search ? { title: { $regex: search, $options: "i" } } : {};
    const total = await blogModels.countDocuments(filters);

    const blogs = await blogModels
      .find(filters)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      blogs,
      currentPage: page,
      totalPage: Math.ceil(total / limit),
      totalData: total,
    });
  } catch (err) {
    console.error("Error getAllBlogs:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ GET Single Blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await blogModels.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Tambah notifikasi info ketika blog dilihat (opsional)
    await Notification.create({
      from: req.body.user || "visitor",
      to: "admin",
      type: "info",
      message: `Blog "${blog.title}" telah dilihat.`,
    });

    res.status(200).json({ blog });
  } catch (err) {
    console.error("Error getBlogById:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ CREATE Blog
export const createBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      author,
      blogImage: blogImageUrl,
      status,
    } = req.body;
    let blogImage = "";

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file,
        "blog"
      );
      blogImage = result.url;
    } else if (blogImageUrl && isValidImageUrl(blogImageUrl)) {
      const result = await downloadAndUpload(blogImageUrl, "blog");
      blogImage = result.url;
    }

    const newBlog = await blogModels.create({
      title,
      content,
      author,
      blogImage,
      status,
    });

    await Notification.create({
      from: author || "admin",
      to: "admin",
      type: "create",
      message: `Blog "${title}" telah dibuat oleh ${author || "admin"}.`,
    });

    res.status(201).json({ message: "Blog created", blog: newBlog });
  } catch (err) {
    console.error("Error createBlog:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ UPDATE Blog
export const updateBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      author,
      blogImage: blogImageUrl,
      status,
    } = req.body;
    let updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (status) updateData.status = status;

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file,
        "blog"
      );
      updateData.blogImage = result.url;
    } else if (blogImageUrl && isValidImageUrl(blogImageUrl)) {
      const result = await downloadAndUpload(blogImageUrl, "blog");
      updateData.blogImage = result.url;
    }

    const updatedBlog = await blogModels.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedBlog)
      return res.status(404).json({ message: "Blog not found" });

    await Notification.create({
      from: author || "admin",
      to: "admin",
      type: "update",
      message: `Blog "${updatedBlog.title}" telah diperbarui oleh ${
        author || "admin"
      }.`,
    });

    res.status(200).json({ message: "Blog updated", blog: updatedBlog });
  } catch (err) {
    console.error("Error updateBlog:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ DELETE Blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await blogModels.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await Notification.create({
      from: req.body.author || "admin",
      to: "admin",
      type: "delete",
      message: `Blog "${blog.title}" telah dihapus oleh ${
        req.body.author || "admin"
      }.`,
    });

    res.status(200).json({ message: "Blog deleted", success: true });
  } catch (err) {
    console.error("Error deleteBlog:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
