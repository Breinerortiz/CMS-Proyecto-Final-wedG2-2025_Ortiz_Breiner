import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import Main from "./Pages/Main/Main";
import News from "./Pages/News/News";
import LoginPage from "./Pages/LoginPages/LoginPages"; // asegúrate que el nombre coincida exactamente
import Admin from "./Pages/Admin/Admin";
import Reportero from "./Pages/Reportero/Reportero";
import ProtectedRoute from "./Pages/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <Router>
      <Header />

      <Routes>

        <Route path="/" element={<Main />} />


        <Route path="/news" element={<News />} />


        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/reportero"
          element={
            <ProtectedRoute rolRequerido="reportero">
              <Reportero />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin"
          element={
            <ProtectedRoute rolRequerido="editor">
              <Admin />
            </ProtectedRoute>
          }
        />

       
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
