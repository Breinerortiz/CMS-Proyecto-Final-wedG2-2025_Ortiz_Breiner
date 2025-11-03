import { useEffect, useState } from "react";
import { db } from "../../Firebase/ConfigFirebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  CircularProgress,
} from "@mui/material";
import "./News.css";

const News = () => {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 🔥 Cargar solo las noticias publicadas
  const cargarNoticiasPublicadas = async () => {
    try {
      const q = query(collection(db, "noticias"), where("estado", "==", "Publicado"));
      const querySnapshot = await getDocs(q);

      const lista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNoticias(lista);
    } catch (error) {
      console.error("Error cargando noticias:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarNoticiasPublicadas();
  }, []);

  return (
    <Container className="news-container">
      <Typography variant="h3" className="news-title" gutterBottom>
        Noticias Publicadas 📰
      </Typography>

      {cargando ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : noticias.length === 0 ? (
        <Typography variant="h6" color="textSecondary" sx={{ textAlign: "center" }}>
          No hay noticias publicadas todavía.
        </Typography>
      ) : (
        <Box className="news-grid">
          {noticias.map((n) => (
            <Card key={n.id} className="news-card">
              {n.imagenUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={n.imagenUrl}
                  alt={n.titulo}
                />
              )}
              <CardContent>
                <Typography variant="h5">{n.titulo}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {n.subtitulo}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {n.contenido && n.contenido.length > 120
                    ? n.contenido.slice(0, 120) + "..."
                    : n.contenido}
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 1, color: "gray" }}
                >
                  Categoría: {n.categoria} | Autor: {n.autorEmail}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default News;
