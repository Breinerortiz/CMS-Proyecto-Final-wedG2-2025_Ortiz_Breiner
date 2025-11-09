import { useEffect, useState, useRef } from "react";
import { db } from "../../Firebase/ConfigFirebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Modal,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import "./Admin.css";

const Admin = () => {
  const [noticias, setNoticias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);
  const [contadores, setContadores] = useState({});
  const canvasRef = useRef(null);

  const categorias = ["Todas", "Tecnología", "Deportes", "Cultura", "Política"];

  // 🎬 Fondo Matrix animado
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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
    return () => clearInterval(interval);
  }, []);


  const cargarNoticias = async () => {
    const snapshot = await getDocs(collection(db, "noticias"));
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setNoticias(lista);

    const counts = { Todas: lista.length };
    categorias.slice(1).forEach((cat) => {
      counts[cat] = lista.filter((n) => n.categoria === cat).length;
    });
    setContadores(counts);
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  // ✅ Confirmar cambio de estado
  const confirmarCambioEstado = async (id, nuevoEstado) => {
    const accion =
      nuevoEstado === "Publicado"
        ? "publicar"
        : nuevoEstado === "Desactivado"
          ? "desactivar"
          : "reactivar";

    const color =
      nuevoEstado === "Publicado"
        ? "#00ff80"
        : nuevoEstado === "Desactivado"
          ? "#ff5555"
          : "#0099ff";

    const result = await Swal.fire({
      title: `¿Deseas ${accion} esta noticia?`,
      icon: "question",
      background: "#111",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: color,
      cancelButtonColor: "#444",
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const noticiaRef = doc(db, "noticias", id);
      await updateDoc(noticiaRef, { estado: nuevoEstado });
      await cargarNoticias();

      Swal.fire({
        title: "Hecho ✅",
        text: `La noticia fue ${accion} correctamente.`,
        background: "#111",
        color: "#00ff80",
        timer: 1800,
        showConfirmButton: false,
      });
    }
  };

  const noticiasFiltradas =
    categoriaSeleccionada === "Todas"
      ? noticias
      : noticias.filter((n) => n.categoria === categoriaSeleccionada);

  return (
    <Box className="admin-matrix-wrapper">
      {/* Fondo Matrix */}
      <canvas ref={canvasRef} className="matrix-canvas"></canvas>
      <div className="matrix-overlay"></div>

      <Box className="admin-dashboard">
        {/* 🔹 Header */}
        <Box className="admin-header">
          <IconButton onClick={() => setMenuAbierto(true)} sx={{ color: "#00ff80" }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" className="admin-header-title">
            Panel del Editor 👨‍💼
          </Typography>
        </Box>

        {/* 🧭 Menú lateral */}
        <Drawer
          anchor="left"
          open={menuAbierto}
          onClose={() => setMenuAbierto(false)}
          PaperProps={{
            sx: {
              width: 260,
              background: "rgba(0,0,0,0.9)",
              color: "#00ff99",
              borderRight: "2px solid #00ff80",
            },
          }}
        >
          <Typography variant="h6" sx={{ p: 2, textAlign: "center", color: "#00ff99" }}>
            Categorías 🗂️
          </Typography>
          <List>
            {categorias.map((cat) => (
              <ListItem key={cat} disablePadding>
                <ListItemButton
                  selected={categoriaSeleccionada === cat}
                  onClick={() => {
                    setCategoriaSeleccionada(cat);
                    setMenuAbierto(false);
                  }}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "rgba(0,255,128,0.2)",
                      color: "#fff",
                    },
                    "&:hover": { backgroundColor: "rgba(0,255,128,0.1)" },
                    display: "flex",
                    justifyContent: "space-between",
                    px: 2,
                  }}
                >
                  <ListItemText primary={cat} />
                  <Chip
                    label={contadores[cat] ?? 0}
                    size="small"
                    sx={{
                      backgroundColor: "#00ff99",
                      color: "#000",
                      fontWeight: "bold",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* 📰 Contenido */}
        <Box className="admin-content">
          <Typography variant="h6" sx={{ mb: 2, color: "#00ff99" }}>
            Noticias {categoriaSeleccionada === "Todas" ? "" : `de ${categoriaSeleccionada}`}
          </Typography>

          {noticiasFiltradas.length === 0 ? (
            <Typography align="center" sx={{ color: "#aaa", mt: 5 }}>
              No hay noticias en esta categoría.
            </Typography>
          ) : (
            <Box className="admin-grid">
              {noticiasFiltradas.map((n) => (
                <motion.div
                  key={n.id}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="admin-card"
                >
                  <Card className="card-dark">
                    <img
                      src={n.imagenUrl || "https://via.placeholder.com/200x120?text=Sin+imagen"}
                      alt={n.titulo}
                      className="admin-img"
                    />
                    <CardContent className="admin-card-content">
                      <Typography className="admin-card-title">{n.titulo}</Typography>
                      <Typography className="admin-card-sub">✍️ {n.autorEmail}</Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {n.contenido?.slice(0, 120)}...
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          fontWeight: "bold",
                          color:
                            n.estado === "Publicado"
                              ? "#00ff80"
                              : n.estado === "Desactivado"
                                ? "#ff5555"
                                : "#999",
                        }}
                      >
                        Estado: {n.estado}
                      </Typography>

                      {/* 🔘 BOTONES ACTUALIZADOS */}
                      <Box className="admin-actions">
                        <Button
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => setNoticiaSeleccionada(n)}
                          sx={{
                            borderColor: "#00ff80",
                            color: "#00ff80",
                            "&:hover": { background: "rgba(0,255,128,0.1)" },
                          }}
                        >
                          Ver
                        </Button>

                        {n.estado === "Terminado" && (
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "#00ff80",
                              color: "#000",
                              "&:hover": { backgroundColor: "#00cc66" },
                            }}
                            onClick={() => confirmarCambioEstado(n.id, "Publicado")}
                          >
                            📢 Publicar
                          </Button>
                        )}

                        {n.estado === "Publicado" && (
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "#ff4444",
                              "&:hover": { backgroundColor: "#cc0000" },
                            }}
                            onClick={() => confirmarCambioEstado(n.id, "Desactivado")}
                          >
                            🚫 Desactivar
                          </Button>
                        )}

                        {n.estado === "Desactivado" && (
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "#0099ff",
                              color: "#fff",
                              "&:hover": { backgroundColor: "#0077cc" },
                            }}
                            onClick={() => confirmarCambioEstado(n.id, "Publicado")}
                          >
                            🔁 Reactivar
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          )}
        </Box>

        {/* 📰 Modal vista previa */}
        <AnimatePresence>
          {noticiaSeleccionada && (
            <Modal
              open={true}
              onClose={() => setNoticiaSeleccionada(null)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(6px)",
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="admin-modal"
              >
                <IconButton onClick={() => setNoticiaSeleccionada(null)} className="close-btn">
                  <CloseIcon />
                </IconButton>

                <Typography
                  variant="h4"
                  sx={{
                    color: "#00ff99",
                    fontWeight: 700,
                    textShadow: "0 0 12px rgba(0,255,128,0.6)",
                    mb: 1,
                  }}
                >
                  {noticiaSeleccionada.titulo}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    color: "#aaffcc", // 🌟 verde claro legible
                    textShadow: "0 0 8px rgba(0, 255, 128, 0.5)",
                    fontStyle: "italic",
                  }}
                >
                  {noticiaSeleccionada.subtitulo}
                </Typography>

                {noticiaSeleccionada.imagenUrl && (
                  <img
                    src={noticiaSeleccionada.imagenUrl}
                    alt={noticiaSeleccionada.titulo}
                    className="modal-img"
                  />
                )}

                <Typography
                  variant="body1"
                  sx={{
                    mt: 2,
                    lineHeight: 1.7,
                    color: "#e0ffe0",
                    whiteSpace: "pre-line", // mantiene saltos de línea del texto
                  }}
                >
                  {noticiaSeleccionada.contenido}
                </Typography>
              </motion.div>
            </Modal>
          )}
        </AnimatePresence>

      </Box>
    </Box>
  );
};

export default Admin;
