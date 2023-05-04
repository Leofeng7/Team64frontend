import './pages.css';
import NavbarComp from '../components/NavbarComp';
import {useEffect, useState} from 'react'

// bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react'

/**
 * Update the Z report with the given ID and data.
 * 
 * @param {string} zrep_id - The ID of the Z report to update.
 * @param {string[]} zrep_items - An array of items in the Z report.
 * @param {number} zrep_price - The total price of the Z report.
 * @param {number} offset - The time zone offset in minutes.
 * @returns {Promise<object>} A promise that resolves to the response data.
 */
function updateZReport(zrep_id, zrep_items, zrep_price, offset) {
  console.log("UPDATING")
  return fetch('https://team64backend.onrender.com/zrepfill', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ zrep_id, zrep_items, zrep_price, offset }),
  }).then((response) => response.json());
} 

/**
 * Clear X Report function that sends a POST request to the server to clear the X Report.
 *
 * @function
 * @returns {Promise<Object>} A promise that resolves with the JSON response from the server.
 */
function clearXReport() {
  return fetch('https://team64backend.onrender.com/clearX', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  }).then((response) => response.json());
} 
  
/**
 * Fetches X Report data from the server and displays it on the screen. 
 * Allows printing of X Reports and updating Z Reports for each X Report.
 * @returns {JSX.Element} JSX Element with X Report table and NavbarComp.
 */
function XReport() {
  const [data, setXRep] = useState([]);
  /**
   * Handles printing of X Report and updating Z Reports.
   */
  
  const handlePrint = () => {
    data.forEach(dataItem => {
      console.log(dataItem.xrep_id)
      updateZReport(dataItem.xrep_id, dataItem.xrep_items, dataItem.xrep_price, 0)
    });
    clearXReport();
  }

  /**
   * Populates X Report data from the server.
   */
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