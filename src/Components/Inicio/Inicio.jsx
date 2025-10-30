import { Container, Typography, Box, Button } from "@mui/material";
import "./inicio.css"; 


const inicio = () => {
  return (
    <>
 

      <Container className="news-container">
        <Typography variant="h3" className="news-title">
          Bienvenido al Diario Digital UDLA
        </Typography>

        <Typography variant="h6" className="news-subtitle">
          Tu fuente confiable de noticias sobre tecnología, cultura, deportes y actualidad.
        </Typography>

        <Box className="news-content">
          <img
            src="https://copilot.microsoft.com/th/id/BCO.b913fc13-abca-4c65-bea9-2fcd3bda9aa3.png"
            alt="Logo Diario Digital"
            className="news-logo"
          />

          <Typography variant="body1" className="news-text">
            El <strong>Diario Digital UDLA</strong> es un medio de comunicación universitario
            comprometido con la veracidad, la independencia y la innovación periodística.
            Nuestro equipo de reporteros y editores trabaja para ofrecerte la información más
            relevante y actualizada en distintas áreas del conocimiento.
          </Typography>

          <Button
            href="/login"
            variant="contained"
            color="primary"
            size="large"
            className="news-button"
          >
            Acceder al Panel Administrativo
          </Button>
        </Box>
      </Container>

    </>
  );
};

export default inicio;
