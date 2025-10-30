import './App.css';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Inicio from './Components/Inicio/Inicio';
import News from './Components/News/News';
import Admin from './Components/Admin/Admin';
import Login from './Pages/LoginPages/Loginpage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


// 🔹 Contexto de autenticación


function App() {
  return (
     <Router>
      
       <Header />

       <Routes>
         {/* Página pública */}
         <Route path="/" element={<Inicio />} />

         {/* Noticias públicas */}
         <Route path="/news" element={<News />} />

         {/* Página de inicio de sesión */}
         <Route path="/login" element={<Login />} />

         {/* Panel administrativo (solo para usuarios autenticados) */}
         <Route
           path="/admin"
           element={
            
               <Admin />
            
           }
         />

         {/* Ruta por defecto (404 opcional) */}
         <Route path="*" element={<h2 style={{ textAlign: "center" }}>Página no encontrada</h2>} />
       </Routes>

       <Footer />
    
     </Router>
  );
}

export default App;
