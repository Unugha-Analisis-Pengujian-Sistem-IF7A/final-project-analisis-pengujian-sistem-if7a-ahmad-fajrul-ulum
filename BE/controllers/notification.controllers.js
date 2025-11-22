import Notification from "../models/notification.models.js";

export const getAllNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const Notifications = await Notification.find({
      to: "admin",
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalCount = await Notification.countDocuments({ to: "admin" });

    res.status(200).json({
      Notifications,
      pagination: {
        currentPage: page,
        totalPage: Math.ceil(totalCount / limit),
        totalCount,
      },
    });
  } catch (error) {
    console.log("Error getAllNotifications", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// delete notification per id
export const deleteOneNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Notification.findOneAndDelete({
      _id: id,
      to: "admin",
    });

    if (!result) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// delete all notifications
export const deleteAllNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({ to: "admin" });
    res.status(200).json({
      message: "All notifications deleted successfully",
      deleteCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Notification.findOneAndUpdate(
      { _id: id, to: "admin", isRead: false }, //filter notifications that are not read
      { isRead: true } // update isRead to true
    );

    if (!result) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { to: "admin", isRead: false }, //filter notifications that are not read
      { isRead: true } // update isRead to true
    );

    res.status(200).json({
      message: "All notifications marked as read",
      modificationCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
