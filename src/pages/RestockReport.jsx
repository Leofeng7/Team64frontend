import './pages.css';
import MainLayout from '../layouts/MainLayout';
import NavbarComp from '../components/NavbarComp';
// bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useRef, useState} from 'react';
import { Form, Button, Table } from "react-bootstrap";

function RestockItems() {
  const [needsRestock, setNeedsRestock] = useState([{ Item: "Item", Quantity: "0" }, { Item: "Item", Quantity: "0" }]);

  const handleItems = async() => {
    try {
      const response = await fetch("https://team64backend.onrender.com/restock", {
        method : "GET",
        headers: { 'Content-Type': 'application/json' },
      });
      const jsonData = await response.json()
      setNeedsRestock(jsonData)
      console.log(jsonData)
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => { handleItems() }, [])

  return (
    <MainLayout>
      <div className="App">
        <NavbarComp/>
        <header className="App-header" style={{color: "black"}}>
          
          <h1 class="inv">Restock Report</h1>
          <table>
            <tr>
              <th>Item:</th>
              <th>Quantity:</th>
            </tr>
            {needsRestock.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.item_name}</td>
                  <td>{val.item_quantitylbs}</td>
                </tr>
              )
            })}
          </table>
        </header>
      </div>
    </MainLayout>
  );
}

export default RestockItems;