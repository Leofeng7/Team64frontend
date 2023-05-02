import './pages.css';
import NavbarComp from '../components/NavbarComp';
import {useEffect, useRef, useState} from 'react'
import MainLayout from '../layouts/MainLayout'

// bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';
import AddInventory from '../components/classComponent';
import React from 'react'


const data = [
  { Item: "The Hulk", Date: "01/01/2023", Price: "5.5" },
  { Item: "The Gladiator", Date: "01/01/2023", Price: "5.5" },
  { Item: "Protien Plus", Date: "01/01/2023", Price: "7.5"},
]

function ZReport() {
  const [data, setZReport] = useState([]);
  
  const populate = async() => {
    try {
      const response = await fetch("https://team64backend.onrender.com/zrepfull")
      const jsonData = await response.json()
      setZReport(jsonData)
      console.log(jsonData)
    } catch (err) {
      console.log(err.message)
    }
  }
  
  useEffect(() => {
    populate();
  },[]);
  
  return (
    <div className="XReport">
        <NavbarComp/>
        <h1 class="inv">Z Report</h1>
      <table>
        <tr>
          <th>Item</th>
          <th>Name</th>
          <th>Price</th>
        </tr>
        {data.map((val, key) => {
          return (
            <tr key={key}>
              <td>{val.zrep_id}</td>
              <td>{val.zrep_items}</td>
              <td>{val.zrep_price}</td>
            </tr>
          )
        })}
      </table>
    </div>
  );
}
  
export default ZReport;