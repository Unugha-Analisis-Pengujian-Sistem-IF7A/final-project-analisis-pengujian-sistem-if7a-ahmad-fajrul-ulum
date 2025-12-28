import { createContext, useContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { auth } from "../firebase";
import { getMe } from "../app/users/authSlice";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {


        const token = await firebaseUser.getIdToken();

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
        setIdToken(token);
        dispatch(getMe(token)); // <<<<< BENERAN BAWA TOKEN
      } else {

        setUser(null);
        setIdToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  const value = useMemo(() => ({
    user,
    loading,
    idToken
  }), [user, loading, idToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
