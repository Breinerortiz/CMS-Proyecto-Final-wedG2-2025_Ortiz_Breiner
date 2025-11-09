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
        const docRef = doc(db, "usuarios", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setRol(docSnap.data().rol);
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
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#000",
        boxShadow: "0 2px 12px rgba(0,255,65,0.3)",
        borderBottom: "2px solid #00ff41",
        zIndex: 10,
      }}
    >
      <Toolbar className="header-toolbar" sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo y título */}
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <img
            src="https://copilot.microsoft.com/th/id/BCO.b913fc13-abca-4c65-bea9-2fcd3bda9aa3.png"
            alt="Logo"
            className="header-logo"
          />
          <Typography
            variant="h6"
            sx={{
              ml: 2,
              color: "#00ff41",
              fontWeight: "bold",
              letterSpacing: "1px",
              textShadow: "0 0 10px #00ff41",
            }}
          >
            Diario Digital UDLA
          </Typography>
        </Box>

        {/* Botones dinámicos */}
        <Box>
          {!user ? (
            <>
              <Button className="nav-btn" component={Link} to="/">
                Inicio
              </Button>
              <Button className="nav-btn" component={Link} to="/news">
                Noticias
              </Button>
              <Button className="nav-btn" component={Link} to="/login">
                Iniciar Sesión
              </Button>
            </>
          ) : (
            <>
              <Button className="nav-btn" component={Link} to="/">
                Inicio
              </Button>
              <Button className="nav-btn" component={Link} to="/news">
                Noticias
              </Button>
              {rol === "reportero" && (
                <Button className="nav-btn" component={Link} to="/reportero">
                  Panel del Reportero
                </Button>
              )}
              {rol === "editor" && (
                <Button className="nav-btn" component={Link} to="/admin">
                  Panel del Editor
                </Button>
              )}
              <Button className="nav-btn" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
