import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import Main from "./Components/Main/Main";
import News from "./Components/News/News";
import LoginPage from "./Pages/LoginPages/LoginPages"; // asegúrate que el nombre coincida exactamente
import Admin from "./Components/Admin/Admin";
import Reportero from "./Components/Reportero/Reportero";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        {/* Página pública */}
        <Route path="/" element={<Main />} />

        {/* Noticias públicas */}
        <Route path="/news" element={<News />} />

        {/* Página de inicio de sesión */}
        <Route path="/login" element={<LoginPage />} />

        {/* Panel del Reportero (protegido) */}
        <Route
          path="/reportero"
          element={
            <ProtectedRoute rolRequerido="reportero">
              <Reportero />
            </ProtectedRoute>
          }
        />

        {/* Panel del Editor/Admin (protegido) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute rolRequerido="editor">
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Página 404 */}
        <Route
          path="*"
          element={
            <h2 style={{ textAlign: "center", marginTop: "100px" }}>
              Página no encontrada
            </h2>
          }
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
