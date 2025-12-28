// import { Navigate } from "react-router-dom";
// import { useAuth } from "../auth/AuthProvider";
// import { useSelector } from "react-redux";
// import Loading from "../components/Admin/common/Loading";

// const ProtectedRoutes = ({ children }) => {
//   const { user: userFirebase, loading: authLoading } = useAuth();
//   const { user: dbUser, loading: reduxLoading, isAuthReady } = useSelector(
//     (state) => state.auth
//   );

//   // Jangan render apapun sebelum proses auth lengkap
//   if (authLoading || reduxLoading || !isAuthReady) {
//     return <Loading />;
//   }

//   // Validasi user dan role admin
//   if (userFirebase && dbUser?.role === "admin") {
//     return children;
//   }

//   // Jika tidak memenuhi, redirect ke login
//   return <Navigate to={"/login"} replace />;
// };

// export default ProtectedRoutes;


// // middleware/ProtectedRoutesUser.jsx
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../auth/AuthProvider";
// import { useSelector } from "react-redux";
// import Loading from "../components/Admin/common/Loading";

// const ProtectedRoutesUser = ({ children }) => {
//   const { user: userFirebase, loading: authLoading } = useAuth();
//   const { user: dbUser, loading: reduxLoading, isAuthReady } = useSelector(
//     (state) => state.auth
//   );

//   if (authLoading || reduxLoading || !isAuthReady) {
//     return <Loading />;
//   }

//   if (userFirebase && dbUser?.role === "user") {
//     return children;
//   }

//   return <Navigate to="/login" replace />;
// };

// export default ProtectedRoutesUser;



import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useSelector } from "react-redux";
import Loading from "../components/Admin/common/Loading";
import PropTypes from "prop-types";

const ProtectedRoutes = ({ children }) => {
  const { user: userFirebase, loading: authLoading } = useAuth();
  const { user: dbUser, loading: reduxLoading, isAuthReady } = useSelector(
    (state) => state.auth
  );

  // Jangan render apapun sebelum proses auth lengkap
  if (authLoading || reduxLoading || !isAuthReady) {
    return <Loading />;
  }

  // Validasi user dari Firebase dan database
  if (userFirebase && dbUser) {
    return children;
  }

  // Jika tidak memenuhi, redirect ke login
  return <Navigate to={"/login"} replace />;
};

ProtectedRoutes.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoutes;
