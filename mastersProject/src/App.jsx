
import  { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './Components/auth/register';
import Login from './Components/auth/login';
import './App.css';
import Faq from './Components/faq/faq';
import Routine from './Components/routine/routine';
import Dashboard from "./Components/dashboard/dashboard";
import DashboardSide from "./Components/dashboard/dashboardSide";
import { AuthProvider } from "./Components/contexts/authContexts";

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/dashboardSide" element={<DashboardSide />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/routine" element={<Routine />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        {/* Default Route (Redirect to Login) */}
        <Route path="/" element={<Login />} />
        
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
