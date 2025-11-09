import "./Reportero.css";
import { useEffect, useState } from "react";
import { db, auth } from "../../Firebase/ConfigFirebase";
import {
  collection,
  addDoc,
  getDocs,
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
} from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";

const Reportero = () => {
  const [noticias, setNoticias] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("Tecnología");
  const [imagen, setImagen] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [usuario, setUsuario] = useState(null);

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

  const crearNoticia = async () => {
    if (!usuario) {
      alert("Debe iniciar sesión para crear una noticia");
      return;
    }

    setSubiendo(true);
    let imagenUrl = "";

    try {
      if (imagen) {
        imagenUrl = await subirImagenACloudinary();
      }

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

      setTitulo("");
      setSubtitulo("");
      setContenido("");
      setImagen(null);
      cargarNoticias(usuario);
    } catch (error) {
      console.error("Error creando noticia:", error);
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <Box className="reportero-container">
      {/* 🌀 Overlay de carga */}
      {subiendo && (
        <div className="loader-overlay">
          <div className="loader-spinner"></div>
          <div className="loader-text">Publicando noticia...</div>
        </div>
      )}

      <Typography variant="h4" className="reportero-title">
        Panel del Reportero 📰
      </Typography>

      <Box className="reportero-form">
        <Typography variant="h6">🆕 Crear nueva noticia</Typography>
        <TextField label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} fullWidth margin="normal" />
        <TextField label="Subtítulo" value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} fullWidth margin="normal" />
        <TextField label="Contenido" value={contenido} onChange={(e) => setContenido(e.target.value)} fullWidth multiline rows={4} margin="normal" />

        <Select value={categoria} onChange={(e) => setCategoria(e.target.value)} fullWidth sx={{ mt: 2 }}>
          <MenuItem value="Tecnología">Tecnología</MenuItem>
          <MenuItem value="Deportes">Deportes</MenuItem>
          <MenuItem value="Cultura">Cultura</MenuItem>
          <MenuItem value="Política">Política</MenuItem>
        </Select>

        <Box sx={{ mt: 2 }}>
          <input type="file" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} />
        </Box>

        <Button
          variant="contained"
          fullWidth
          className="btn-crear"
          sx={{ mt: 2 }}
          onClick={crearNoticia}
          disabled={subiendo}
        >
          {subiendo ? "Subiendo..." : "Guardar noticia"}
        </Button>
      </Box>

      <Typography variant="h5" sx={{ mt: 4 }}>
        🗞️ Mis noticias
      </Typography>

      {noticias.map((n) => (
        <Card key={n.id} className="reportero-card" sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6">{n.titulo}</Typography>
            <Typography variant="body2" color="text.secondary">
              Estado: {n.estado}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Reportero;
