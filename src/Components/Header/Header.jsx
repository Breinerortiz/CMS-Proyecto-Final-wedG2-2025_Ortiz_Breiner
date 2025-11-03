import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../../Firebase/ConfigFirebase";
import { doc, getDoc } from "firebase/firestore";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);

  // Escucha cambios de sesión en Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Leer rol desde Firestore
        const docRef = doc(db, "usuarios", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRol(docSnap.data().rol);
        }
      } else {
        setUser(null);
        setRol(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar className="header-toolbar">
        {/* Logo y título */}
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <img
            src="https://copilot.microsoft.com/th/id/BCO.b913fc13-abca-4c65-bea9-2fcd3bda9aa3.png"
            alt="Logo"
            className="header-logo"
          />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Diario Digital UDLA
          </Typography>
        </Box>

        {/* Botones dinámicos */}
        {!user ? (
          <>
            <Button color="inherit" component={Link} to="/">
              Inicio
            </Button>
            <Button color="inherit" component={Link} to="/news">
              Noticias
            </Button>
            <Button color="inherit" component={Link} to="/login">
              Iniciar Sesión
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/">
              Inicio
            </Button>
            <Button color="inherit" component={Link} to="/news">
              Noticias
            </Button>

            {rol === "reportero" && (
              <Button color="inherit" component={Link} to="/reportero">
                Panel del Reportero
              </Button>
            )}
            {rol === "editor" && (
              <Button color="inherit" component={Link} to="/admin">
                Panel del Editor
              </Button>
            )}

            <Button color="inherit" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
