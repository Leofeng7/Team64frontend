import './pages.css';
import NavbarComp from '../components/NavbarComp';
// bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';
import AddInventory from '../components/classComponent';
import React from 'react'
function Inventory() {
  return (
    <div className="App">
      <NavbarComp/>
      <header className="App-header">
        
        <h1 class="inv">Inventory</h1>
        <AddInventory/>
      </header>
    </div>
  );
}

export default Inventory;