// src/Pages/NotFound.jsx
import { useEffect, useRef } from "react";
import { Button, Typography, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./NotFound.css";

const NotFound = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const letras =
      "アカサタナハマヤラワイキシチニヒミリウクスツヌフムユルABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 16;
    const columnas = canvas.width / fontSize;
    const gotas = Array.from({ length: columnas }).fill(1);

    const dibujar = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff80";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < gotas.length; i++) {
        const texto = letras.charAt(Math.floor(Math.random() * letras.length));
        ctx.fillText(texto, i * fontSize, gotas[i] * fontSize);
        if (gotas[i] * fontSize > canvas.height && Math.random() > 0.975)
          gotas[i] = 0;
        gotas[i]++;
      }
    };

    const interval = setInterval(dibujar, 33);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="notfound-wrapper">
      <canvas ref={canvasRef} className="matrix-canvas"></canvas>
      <div className="matrix-overlay"></div>

      <Container className="notfound-content">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="notfound-box"
        >
          <Typography variant="h2" className="notfound-title glitch">
            404
          </Typography>

          <Typography variant="h5" className="notfound-subtitle">
            Página no encontrada
          </Typography>

          <Typography variant="body1" className="notfound-text">
            Parece que te has perdido en la red de datos del Diario Digital UDLA 🕶️
          </Typography>

          <Button
            component={Link}
            to="/"
            variant="contained"
            className="notfound-button"
          >
            Volver al Inicio
          </Button>
        </motion.div>
      </Container>
    </div>
  );
};

export default NotFound;
