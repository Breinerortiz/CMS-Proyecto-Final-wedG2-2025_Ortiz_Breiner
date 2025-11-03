import { useEffect, useState } from "react";
import { db, auth } from "../../Firebase/ConfigFirebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  updateDoc,
  doc,
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

const Reportero = () => {
  const [noticias, setNoticias] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("Tecnología");

  const usuario = auth.currentUser;

  const cargarNoticias = async () => {
    const q = query(collection(db, "noticias"), where("autorUID", "==", usuario.uid));
    const querySnapshot = await getDocs(q);
    const lista = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setNoticias(lista);
  };

  useEffect(() => {
    if (usuario) cargarNoticias();
  }, [usuario]);

  const crearNoticia = async () => {
    await addDoc(collection(db, "noticias"), {
      titulo,
      subtitulo,
      contenido,
      categoria,
      autorUID: usuario.uid,
      autorEmail: usuario.email,
      estado: "Edición",
      fechaCreacion: Timestamp.now(),
      fechaActualizacion: Timestamp.now(),
    });

    setTitulo("");
    setSubtitulo("");
    setContenido("");
    setCategoria("Tecnología");

    cargarNoticias();
  };

  const actualizarNoticia = async (id, nuevoEstado) => {
    const ref = doc(db, "noticias", id);
    await updateDoc(ref, {
      estado: nuevoEstado,
      fechaActualizacion: Timestamp.now(),
    });
    cargarNoticias();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel del Reportero 📰
      </Typography>

      {/* Crear noticia */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Crear nueva noticia</Typography>
        <TextField
          label="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Subtítulo"
          value={subtitulo}
          onChange={(e) => setSubtitulo(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Contenido"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <Select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          fullWidth
        >
          <MenuItem value="Tecnología">Tecnología</MenuItem>
          <MenuItem value="Política">Política</MenuItem>
          <MenuItem value="Deportes">Deportes</MenuItem>
          <MenuItem value="Cultura">Cultura</MenuItem>
        </Select>

        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={crearNoticia}>
          Guardar noticia
        </Button>
      </Box>

      {/* Listado de noticias */}
      <Typography variant="h5">Mis noticias</Typography>

      {noticias.map((n) => (
        <Card key={n.id} sx={{ mt: 2, p: 2 }}>
          <CardContent>
            <Typography variant="h6">{n.titulo}</Typography>
            <Typography variant="body2">{n.contenido.slice(0, 100)}...</Typography>
            <Typography variant="caption" display="block">
              Estado actual: <strong>{n.estado}</strong>
            </Typography>

            {n.estado === "Edición" && (
              <Button
                onClick={() => actualizarNoticia(n.id, "Terminado")}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Marcar como Terminado
              </Button>
            )}

            {n.estado === "Terminado" && (
              <Typography sx={{ mt: 1, color: "gray" }}>
                Esperando revisión del editor...
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Reportero;
