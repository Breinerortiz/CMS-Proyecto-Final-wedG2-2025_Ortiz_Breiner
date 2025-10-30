import { Typography, Box } from "@mui/material";
import "./Footer.css"; // Importamos su CSS

const Footer = () => {
  return (
    <Box component="footer" className="footer-container">
      <Typography variant="body2" className="footer-text">
        © {new Date().getFullYear()} Diario Digital UDLA — Todos los derechos reservados.
      </Typography>
    </Box>
  );
};

export default Footer;
