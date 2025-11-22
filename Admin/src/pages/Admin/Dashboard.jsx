/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fecthDataDashboard } from "../../app/data/dashboardSlice";
import { motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // for loading icon
import { FaRegSadCry } from "react-icons/fa"; // for error icon

// Variants for motion animation
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Dashboard = () => {
  const dispatch = useDispatch();

  const { blogs, testimonials, heroes, logoPTs, iklan, isLoading, error } =
    useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fecthDataDashboard());
  }, [dispatch]);

  // Loading state
  if (isLoading)
    return (
      <div className="flex justify-center items-center p-8 text-xl text-gray-500">
        <AiOutlineLoading3Quarters className="animate-spin mr-2" />
        Loading...
      </div>
    );

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center p-8 text-red-500">
        <FaRegSadCry className="text-3xl mr-2" />
        <span>Failed to load dashboard data. Please try again.</span>
      </div>
    );
  }

  // Data for cards
  const cardData = [
    { title: "Total Blog Posts", value: blogs?.length || 0 },
    { title: "Total Testimonials", value: testimonials?.length || 0 },
    { title: "Total Heroes", value: heroes?.length || 0 },
    { title: "Total Logo PTs", value: logoPTs?.length || 0 },
    { title: "Total Iklan", value: iklan?.length || 0 },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.15 },
        },
      }}
      className="p-6 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-lg shadow-lg transition-all"
    >
      <h1 className="text-4xl font-semibold mb-6 text-gray-800 dark:text-white">Dashboard</h1>

      {/* Card Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {cardData.map((item, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{item.title}</h2>
              <p className="text-3xl font-semibold text-blue-600 dark:text-blue-400">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Dashboard;
