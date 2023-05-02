import React from 'react';
import './pages.css';
import { useNavigate } from "react-router-dom";


function PageSelect() {
  const navigate = useNavigate();

  return (
    <div className = "buttonContainer">
      <button onClick = {() => navigate('/customer')} className="button">Customer View</button>
      <button onClick = {() => navigate('/man')} className="button">Manager View</button>
      <button onClick = {() => navigate('/pos')} className="button">Server View</button>
    </div>
  );
}

export default PageSelect;