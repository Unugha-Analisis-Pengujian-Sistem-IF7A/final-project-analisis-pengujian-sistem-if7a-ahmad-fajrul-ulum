import { createContext, useContext, useEffect, useState } from "react";

const AdminThemeContext = createContext();

export const useAdminTheme = () => useContext(AdminThemeContext);

import PropTypes from "prop-types";

export const AdminThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("admin-theme") || "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("admin-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
};

AdminThemeProvider.propTypes = {
  children: PropTypes.node,
};
