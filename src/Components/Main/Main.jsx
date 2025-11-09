import { useEffect, useRef } from "react";
import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import "./Main.css";

const Main = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const letras =
      "アカサタナハマヤラワイキシチニヒミリウクスツヌフムユルエケセテネヘメレABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
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
        if (gotas[i] * fontSize > canvas.height && Math.random() > 0.975) {
          gotas[i] = 0;
        }
        gotas[i]++;
      }
    };

    const interval = setInterval(dibujar, 33);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="main-matrix-wrapper">
      <canvas ref={canvasRef} className="matrix-canvas"></canvas>
      <div className="matrix-overlay"></div>

      <Container className="main-content">
        <motion.div
          className="content-box"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <Typography variant="h3" className="main-title">
            Bienvenido al Diario Digital UDLA
          </Typography>

          <Typography variant="h6" className="main-subtitle">
            Tu fuente confiable de noticias sobre tecnología, cultura, deportes y actualidad.
          </Typography>

          <motion.img
            src="https://copilot.microsoft.com/th/id/BCO.b913fc13-abca-4c65-bea9-2fcd3bda9aa3.png"
            alt="Logo Diario Digital"
            className="main-logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          />

          <Typography variant="body1" className="main-text">
            El <strong>Diario Digital UDLA</strong> es un medio universitario
            comprometido con la veracidad, la independencia y la innovación periodística.
          </Typography>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <Button
              component={Link}
              to="/login"
              variant="contained"
              size="large"
              className="main-button"
            >
              Acceder al Panel Administrativo
            </Button>
          </motion.div>
        </motion.div>
      </Container>
   
    </div>
  )
};

export default Main;
