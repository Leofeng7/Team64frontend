import './pages.css';
import NavbarComp from '../components/NavbarComp';
// bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';
import AddInventory from '../components/classComponent';
import React from 'react'
import AddEmployee from '../components/AddEmployee';
function Employee() {
  return (
    <div className="App">
      <NavbarComp/>
      <header className="App-header">
        <h1 class="inv">Employees</h1>
        <AddEmployee/>
      </header>
    </div>
  );
}

export default Employee;