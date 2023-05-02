import './pages.css';
import MainLayout from '../layouts/MainLayout';
import NavbarComp from '../components/NavbarComp';
// bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useRef, useState} from 'react';
import { Form, Button, Table } from "react-bootstrap";

function SalesReport() {
  const [best, setBest] = useState([{ Item: "Item", Sales: "0.0" }, { Item: "Item", Sales: "0.0" }, { Item: "Item", Sales: "0.0" }]);
  const [worst, setWorst] = useState([{ Item: "Item", Sales: "0.0" }, { Item: "Item", Sales: "0.0" }, { Item: "Item", Sales: "0.0" }]);
  const [startDate, setStartDate] = useState("2000-01-01")
  const [endDate, setEndDate] = useState("2023-01-01")

  const changeStartDate = (event) => {
    setStartDate(event.target.value);
    console.log(startDate)
  }

  const changeEndDate = (event) => {
    setEndDate(event.target.value);
  }

  async function updateBest() {
    const type=1
    try {
      const response = await fetch("https://team64backend.onrender.com/salesreport", {
        method : "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({startDate, endDate, type}),
      });
      const jsonData = await response.json()
      setBest(jsonData)
      console.log(jsonData)
    } catch (err) {
      console.log(err.message)
    }
  }

  async function updateWorst() {
    const type=0
    try {
      const response = await fetch("https://team64backend.onrender.com/salesreport", {
        method : "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({startDate, endDate, type}),
      });
      const jsonData = await response.json()
      setWorst(jsonData)
      console.log(jsonData)
    } catch (err) {
      console.log(err.message)
    }
  }

  function handleItems() {
    updateBest()
    updateWorst()
  }

  return (
    <MainLayout>
      <div className="App">
        <NavbarComp/>
        <header className="App-header" style={{color: "black"}}>
        <h1 class="inv">Sales Report</h1>
          <Form>
            <Form.Group controlId="formStartDate">
                <Form.Label class="product">Start Date:</Form.Label>
                <Form.Control onChange = {changeStartDate} type="text" placeholder="yyyy-mm-dd" name="startDate" />
            </Form.Group>

            <Form.Group controlId="formEndDate">
                <Form.Label class="product">End Date:</Form.Label>
                <Form.Control onChange = {changeEndDate} type="text" placeholder="yyyy-mm-dd" name="endDate" />
            </Form.Group>
            <Form.Group>
                <span></span>
            </Form.Group>
            <div class="addButton"></div>
            <Button  onClick = {handleItems} class="btn btn-primary btn-lg btn-block" >
                Query Orders
            </Button>
            <div class="addButton"></div>
          </Form>
        <h2 class="inv">Best Selling Items</h2>
          <table>
            <tr>
              <th>Item</th>
              <th>Sales</th>
            </tr>
            {best.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.sm_name}</td>
                  <td>{val.count}</td>
                </tr>
              )
            })}
          </table>
        <h2 class="inv">Worst Selling Items</h2>
          <table>
            <tr>
              <th>Item</th>
              <th>Sales</th>
            </tr>
            {worst.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.sm_name}</td>
                  <td>{val.count}</td>
                </tr>
              )
            })}
          </table>
        </header>
      </div>
    </MainLayout>
  );
}

export default SalesReport;