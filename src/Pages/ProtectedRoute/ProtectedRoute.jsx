import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../../Firebase/ConfigFirebase";
import { doc, getDoc } from "firebase/firestore";

const ProtectedRoute = ({ children, rolRequerido }) => {
  const [loading, setLoading] = useState(true);
  const [userRol, setUserRol] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "usuarios", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserRol(docSnap.data().rol);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <h3 style={{ textAlign: "center" }}>Cargando...</h3>;

  // No autenticado
  if (!user) return <Navigate to="/login" replace />;

  // Sin permiso
  if (rolRequerido && userRol !== rolRequerido)
    return <Navigate to="/" replace />;

  // Autenticado y con rol correcto
  return children;
};

export default ProtectedRoute;
