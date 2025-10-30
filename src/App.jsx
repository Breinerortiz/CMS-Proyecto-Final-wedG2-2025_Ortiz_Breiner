import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import Main from "./Components/Main/Main";
import News from "./Components/News/News";
import LoginPage from "./Pages/LoginPages/LoginPages";
import Admin from "./Components/Admin/Admin";

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


        {/* Panel administrativo */}
        <Route path="/admin" element={<Admin />} />

        {/* Página 404 */}
        <Route
          path="*"
          element={<h2 style={{ textAlign: "center" }}>Página no encontrada</h2>}
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
