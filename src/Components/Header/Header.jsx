import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

import "./Header.css"; // 🔗 Importamos el CSS propio

const Header = () => {
  return (
    <AppBar position="static" color="primary" className="header-container">
      <Toolbar className="header-toolbar">
        <Box className="header-logo-box">
          <img
            src="https://copilot.microsoft.com/th/id/BCO.b913fc13-abca-4c65-bea9-2fcd3bda9aa3.png"
            alt="Logo del Diario Digital UDLA"
            className="header-logo"
          />
          <Typography variant="h5" component="div" className="header-title">
            Diario Digital UDLA
          </Typography>
        </Box>

        <Button
        
          to="/login"
          variant="contained"
          color="secondary"
          className="header-button"
        >
          Iniciar Sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
