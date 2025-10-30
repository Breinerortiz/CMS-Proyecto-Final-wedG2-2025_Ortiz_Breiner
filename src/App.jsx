import './App.css';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
 import Main from './Components/Main/Main';
import News from './Components/News/News';
import Admin from './Components/Admin/Admin';
import LoginPage from './Pages/LoginPages/LoginPages';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


// 🔹 Contexto de autenticación


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
