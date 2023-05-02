import './pages.css';
import NavbarComp from '../components/NavbarComp';
import {useEffect, useState} from 'react'

// bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react'

function updateZReport(zrep_id, zrep_items, zrep_price, offset) {
  console.log("UPDATING")
  return fetch('https://team64backend.onrender.com/zrepfill', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ zrep_id, zrep_items, zrep_price, offset }),
  }).then((response) => response.json());
} 
function clearXReport() {
  return fetch('https://team64backend.onrender.com/clearX', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  }).then((response) => response.json());
} 
  
function XReport() {
  const [data, setXRep] = useState([]);
  const handlePrint = () => {
    let offset = 0
    data.forEach(dataItem => {
      console.log(dataItem.xrep_id)
      updateZReport(dataItem.xrep_id, dataItem.xrep_items, dataItem.xrep_price, offset)
      offset+=1
    });
    clearXReport();
  }
  const populate = async() => {
    try {
      const response = await fetch("https://team64backend.onrender.com/xrepfull")
      const jsonData = await response.json()
      setXRep(jsonData)
      
    } catch (err) {
      console.log(err.message)
    }
  }
  
  useEffect(() => {
    populate();
  },[]);
  useEffect(() => {
    handlePrint();
  },[data])
  return (
    <div className="XReport">
        <NavbarComp/>
        <h1 class="inv">X Report</h1>
      <table>
        <tr>
          <th>Item</th>
          <th>Name</th>
          <th>Price</th>
        </tr>
        {data.map((val, key) => {
          return (
            <tr key={key}>
              <td>{val.xrep_id}</td>
              <td>{val.xrep_items}</td>
              <td>{val.xrep_price}</td>
            </tr>
          )
        })}
      </table>
    </div>
  );
}
  
export default XReport;