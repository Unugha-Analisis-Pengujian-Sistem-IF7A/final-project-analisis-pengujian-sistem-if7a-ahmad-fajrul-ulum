import {
  FaEnvelope,
  FaExclamationCircle,
  FaCheckCircle,
  FaBell,
} from "react-icons/fa";
import { useState } from "react";
import { motion } from "framer-motion";

const dummyNotifications = [
  {
    id: 1,
    type: "message",
    icon: <FaEnvelope />,
    title: "New message from John",
    description: "Hey, can we reschedule the meeting?",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "alert",
    icon: <FaExclamationCircle />,
    title: "Server down",
    description: "Production server is not responding.",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 3,
    type: "success",
    icon: <FaCheckCircle />,
    title: "Backup completed",
    description: "Daily backup finished successfully.",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 4,
    type: "alert",
    icon: <FaExclamationCircle />,
    title: "Security warning",
    description: "Multiple failed login attempts detected.",
    time: "2 hours ago",
    read: true,
  },
];

const filterOptions = ["All", "Messages", "Alerts", "Success"];

const NotificationsPage = () => {
  const [filter, setFilter] = useState("All");

  const filteredNotifications = dummyNotifications.filter((notif) => {
    if (filter === "All") return true;
    return notif.type.toLowerCase() === filter.toLowerCase();
  });

  return (
    <motion.div
      className="p-6 max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <FaBell /> Notifications
        </h1>
        <p className="text-base-content/70 mt-1">
          Stay up to date with recent activities and alerts
        </p>
      </div>

      {/* Filter buttons */}
      <div className="mb-4 flex gap-2 flex-wrap">
        {filterOptions.map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`btn btn-sm ${filter === option ? "btn-primary" : "btn-ghost"
              }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <p className="text-base-content/60 text-center py-10">
            No notifications found for &quot;{filter}&quot;.
          </p>
        ) : (
          filteredNotifications.map((notif) => (
            <motion.div
              key={notif.id}
              className={`border rounded-lg p-4 shadow-md flex gap-4 items-start ${notif.read ? "bg-base-200" : "bg-base-100"
                }`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className={`text-xl mt-1 ${notif.type === "alert"
                  ? "text-warning"
                  : notif.type === "message"
                    ? "text-info"
                    : "text-success"
                  }`}
              >
                {notif.icon}
              </span>
              <div>
                <h3 className="font-semibold">{notif.title}</h3>
                <p className="text-sm text-base-content/70">
                  {notif.description}
                </p>
                <p className="text-xs text-base-content/50 mt-1">
                  {notif.time}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default NotificationsPage;
