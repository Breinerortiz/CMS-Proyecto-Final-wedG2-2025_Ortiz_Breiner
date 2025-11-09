import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../../Firebase/ConfigFirebase";
import { doc, getDoc } from "firebase/firestore";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

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

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  // Opciones según rol
  const getOpciones = () => {
    const opciones = [
      { texto: "Inicio", ruta: "/" },
      { texto: "Noticias", ruta: "/news" },
    ];

    if (rol === "reportero") opciones.push({ texto: "Panel del Reportero", ruta: "/reportero" });
    if (rol === "editor") opciones.push({ texto: "Panel del Editor", ruta: "/admin" });

    if (!user) {
      opciones.push({ texto: "Iniciar Sesión", ruta: "/login" });
    } else {
      opciones.push({ texto: "Cerrar sesión", ruta: null, accion: handleLogout });
    }

    return opciones;
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#000",
        boxShadow: "0 2px 12px rgba(0,255,65,0.3)",
        borderBottom: "2px solid #00ff41",
        zIndex: 1200,
      }}
    >
      <Toolbar className="header-toolbar">
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

        {/* Botones normales (pantallas grandes) */}
        <Box className="nav-links">
          {getOpciones().map((op) =>
            op.accion ? (
              <Button key={op.texto} className="nav-btn" onClick={op.accion}>
                {op.texto}
              </Button>
            ) : (
              <Button key={op.texto} className="nav-btn" component={Link} to={op.ruta}>
                {op.texto}
              </Button>
            )
          )}
        </Box>

        {/* Botón hamburguesa (solo móvil) */}
        <IconButton className="menu-btn" onClick={toggleMenu}>
          {menuAbierto ? <CloseIcon sx={{ color: "#00ff41" }} /> : <MenuIcon sx={{ color: "#00ff41" }} />}
        </IconButton>

        {/* Drawer lateral */}
        <Drawer
          anchor="right"
          open={menuAbierto}
          onClose={() => setMenuAbierto(false)}
          PaperProps={{
            sx: {
              background: "rgba(0, 0, 0, 0.95)",
              color: "#00ff80",
              borderLeft: "2px solid #00ff41",
              boxShadow: "0 0 15px #00ff41",
            },
          }}
        >
          <List sx={{ width: 220 }}>
            {getOpciones().map((op) => (
              <ListItem key={op.texto} disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (op.accion) op.accion();
                    else navigate(op.ruta);
                    setMenuAbierto(false);
                  }}
                >
                  <ListItemText primary={op.texto} sx={{ color: "#00ff80" }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
