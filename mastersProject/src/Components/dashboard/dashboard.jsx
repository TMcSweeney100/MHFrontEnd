import React from "react";
import { useAuth } from "../contexts/authContexts";
import {  useNavigate } from "react-router-dom";

function Dashboard() {
    const {currentUser} = useAuth();
    var navigate = useNavigate();

    const handleNavigate = ()=> {
        navigate("/routine")
    }

    return (
     <>
        <h1> Welcome back {currentUser.email} </h1>
        <button onClick={handleNavigate}>Routine</button>
        </>
        
    );
  }

  export default Dashboard;