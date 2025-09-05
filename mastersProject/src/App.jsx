
import  { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './Components/auth/register';
import Login from './Components/auth/login';
import './App.css';
import Faq from './Components/faq/faq';
import Routine from './Components/routine/routine';
import Dashboard from "./Components/dashboard/dashboard";
import DashboardSide from "./Components/dashboard/dashboardSide";
// import MoodForm from "./Components/MoodForm.jsx";

import { AuthProvider } from "./Components/contexts/authContexts";
import RootLayout from "./Components/layout/rootLayout";
import ChatPage from "./Components/chat/chatPage";
import { Toaster } from "./Components/ui/sonner";
import AlcoholLanding from "./Components/alcohol/alcoholLanding";
import AlcoholProfileForm from "./Components/alcohol/alcoholProfileForm";
import MoodGraph from "./Components/mood/MoodGraph";
import DayTracker from "./Components/alcohol/DayTracker";
import MoodEntriesCarousel from "./Components/mood/MoodEntriesCarousel";
function App() {
  return (
    <AuthProvider>
    <Router>
       <Toaster richColors position="top-right" />
      <Routes>
          {/* auth routes, not in sidebar */}  
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/dashboardSide" element={<DashboardSide />} />
         <Route path="/dashboard" element={<Dashboard/>}/>

         <Route element={<RootLayout/>}>
        <Route path="/faq" element={<Faq />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/routine" element={<Routine />} />
        {/* <Route path="/mood" element={<MoodForm />} /> */}
        <Route path="/alcohol" element={<AlcoholLanding/>}/>
        <Route path="/alcoholForm" element={<AlcoholProfileForm/>}/>
         <Route path="/dayTracker" element={<DayTracker/>}/> 
        <Route path="/moodGraph" element={<MoodGraph/>}/>
        <Route path="/insight" element={<MoodEntriesCarousel/>}/>

        </Route>
        {/* Default Route (Redirect to Login) */}
        <Route path="/" element={<Login />} />
        
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
