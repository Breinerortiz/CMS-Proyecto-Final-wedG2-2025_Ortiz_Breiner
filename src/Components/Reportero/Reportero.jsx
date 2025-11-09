import "./Reportero.css";
import { useEffect, useState } from "react";
import { db, auth } from "../../Firebase/ConfigFirebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Swal from "sweetalert2";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";

const Reportero = () => {
  const [noticias, setNoticias] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("Tecnología");
  const [imagen, setImagen] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(null);

  const CLOUD_NAME = "dd7pgcegz";
  const UPLOAD_PRESET = "IMAGENES_REACT";

  const cargarNoticias = async (user) => {
    const q = query(collection(db, "noticias"), where("autorUID", "==", user.uid));
    const snapshot = await getDocs(q);
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setNoticias(lista);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user);
        cargarNoticias(user);
      }
    });
    return () => unsubscribe();
  }, []);

  const subirImagenACloudinary = async () => {
    const data = new FormData();
    data.append("file", imagen);
    data.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: data,
    });
    const file = await res.json();
    return file.secure_url;
  };

  const guardarNoticia = async () => {
    if (!usuario) {
      Swal.fire("Error", "Debe iniciar sesión para crear una noticia", "error");
      return;
    }
    if (!titulo || !contenido) {
      Swal.fire("Campos vacíos", "Completa el título y contenido.", "warning");
      return;
    }

    setSubiendo(true);
    let imagenUrl = "";

    try {
      if (imagen) {
        imagenUrl = await subirImagenACloudinary();
      }

      if (editando) {
        const noticiaRef = doc(db, "noticias", editando);
        await updateDoc(noticiaRef, {
          titulo,
          subtitulo,
          contenido,
          categoria,
          imagenUrl: imagenUrl || undefined,
          estado: "Terminado",
        });
        Swal.fire("✅ Noticia actualizada", "", "success");
      } else {
        await addDoc(collection(db, "noticias"), {
          titulo,
          subtitulo,
          contenido,
          categoria,
          autorUID: usuario.uid,
          autorEmail: usuario.email,
          estado: "Edición",
          fechaCreacion: Timestamp.now(),
          imagenUrl,
        });
        Swal.fire("📰 Noticia creada", "Guardada en modo edición.", "success");
      }

      setTitulo("");
      setSubtitulo("");
      setContenido("");
      setImagen(null);
      setEditando(null);
      cargarNoticias(usuario);
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar la noticia.", "error");
    } finally {
      setSubiendo(false);
    }
  };

  const editarNoticia = (n) => {
    setEditando(n.id);
    setTitulo(n.titulo);
    setSubtitulo(n.subtitulo);
    setContenido(n.contenido);
    setCategoria(n.categoria);
  };

  const eliminarNoticia = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar noticia?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "noticias", id));
      Swal.fire("Eliminada", "La noticia fue eliminada.", "success");
      cargarNoticias(usuario);
    }
  };

  return (
    <div className="reportero-bg">
      <div className="matrix-overlay"></div>

      {subiendo && (
        <div className="loader-overlay">
          <div className="loader-spinner"></div>
          <div className="loader-text">Subiendo noticia...</div>
        </div>
      )}

      <motion.div
        className="reportero-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Typography variant="h4" className="reportero-title">
          🗞️ Panel del Reportero
        </Typography>

        <motion.div
          className="reportero-form"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h6" className="reportero-subtitle">
            {editando ? "✏️ Editar noticia" : "🆕 Crear nueva noticia"}
          </Typography>

          <TextField
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ className: "form-label" }}
            InputProps={{ className: "form-input" }}
          />
          <TextField
            label="Subtítulo"
            value={subtitulo}
            onChange={(e) => setSubtitulo(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ className: "form-label" }}
            InputProps={{ className: "form-input" }}
          />
          <TextField
            label="Contenido"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            InputLabelProps={{ className: "form-label" }}
            InputProps={{ className: "form-input" }}
          />

          <Select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            className="form-select"
          >
            <MenuItem value="Tecnología">Tecnología</MenuItem>
            <MenuItem value="Deportes">Deportes</MenuItem>
            <MenuItem value="Cultura">Cultura</MenuItem>
            <MenuItem value="Política">Política</MenuItem>
          </Select>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
              className="btn-subir"
            >
              Subir Imagen
              <input type="file" hidden accept="image/*" onChange={(e) => setImagen(e.target.files[0])} />
            </Button>
          </Box>

          <Button
            variant="contained"
            fullWidth
            className="btn-guardar"
            sx={{ mt: 2 }}
            onClick={guardarNoticia}
            disabled={subiendo}
            startIcon={editando ? <SaveIcon /> : null}
          >
            {subiendo ? "Subiendo..." : editando ? "Guardar cambios" : "Guardar noticia"}
          </Button>
        </motion.div>

        <Typography variant="h5" className="mis-noticias">
          Mis Noticias
        </Typography>

        <Box className="reportero-grid">
          {noticias.map((n) => (
            <motion.div key={n.id} className="reportero-card" whileHover={{ scale: 1.03 }}>
              <Card className="cyber-card">
                {n.imagenUrl && <img src={n.imagenUrl} alt={n.titulo} className="reportero-img" />}
                <CardContent>
                  <Typography variant="h6" className="titulo-noticia">{n.titulo}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {n.subtitulo}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        n.estado === "Edición"
                          ? "#ffcc00"
                          : n.estado === "Terminado"
                          ? "#00ff99"
                          : "gray",
                      fontWeight: "bold",
                    }}
                  >
                    Estado: {n.estado}
                  </Typography>

                  <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                    {n.estado === "Edición" && (
                      <>
                        <Tooltip title="Editar">
                          <IconButton color="primary" onClick={() => editarNoticia(n)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton color="error" onClick={() => eliminarNoticia(n.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </motion.div>
    </div>
  );
};

export default Reportero;
