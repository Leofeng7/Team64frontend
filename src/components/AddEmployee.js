import { Form, Button, Table } from "react-bootstrap";
import { createRef, Component } from 'react';
import './comp.css';


export default class AddEmployee extends Component{
    constructor() {
        super();
        this.state = {
            employees: []
        }
        this.fetchEmployees()
        this.formData = createRef()
    }

    fetchEmployees = async() => {
        try {
          const response = await fetch("https://team64backend.onrender.com/employees")
          const jsonData = await response.json()
          this.setState({
            employees: jsonData
          });
        } catch (err) {
          console.log(err.message)
        }
    }

    AddEmployee(emp_name, emp_hours, emp_startday, shift_id) { // Adding a new item to the database
        return fetch('https://team64backend.onrender.com/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emp_name, emp_hours, emp_startday, shift_id }),
        }).then((response) => response.json());
    } 

    DeleteItem(emp_name) { // Deleting an item from the database
        return fetch('https://team64backend.onrender.com/employees', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({emp_name}),
        }).then((response) => response.json());
    }
    
    // addproduct handler method
    add = (event) => {
        event.preventDefault();
        //console.log(formData.current)
        const newEmployee = {
            emp_name: this.formData.current.product_name.value,
            emp_hours: this.formData.current.price.value,
            emp_startday: this.formData.current.start_date.value,
            shift_id: Number(this.formData.current.qty.value)
        }
        this.AddEmployee(newEmployee.emp_name, newEmployee.emp_hours, newEmployee.emp_startday, newEmployee.shift_id)

        this.state.employees.push(newEmployee);
        this.setState({
            employees: this.state.employees
        });
    }
    delVal = (event) => {
        const indexOfArray = event.target.value;
        this.DeleteItem(this.state.employees[indexOfArray].emp_name)
        delete this.state.employees[indexOfArray];
        this.setState({
            employees: this.state.employees
        });
    }

    changeBackground(e) {
        e.target.style.background = 'grey';
    }
    changeAddBack(e) {
        e.target.style.background = 'green';
    }
    changeSubBack(e) {
        e.target.style.background = 'red';
    }


    render() {
        return (
            <div>
                <Form onSubmit={this.add} ref={this.formData}>
                    <Form.Group controlId="formBasicProductName">
                        <Form.Label class="product">Name:</Form.Label>
                        <Form.Control type="text" placeholder="Enter Employee Name" name="product_name" />
                    </Form.Group>

                    <Form.Group controlId="formBasicPrice">
                        <Form.Label class="product">Hours:</Form.Label>
                        <Form.Control type="decimal" placeholder="Hours Worked" name="price" />
                    </Form.Group>

                    <Form.Group controlId="formBasicQty">
                        <Form.Label class="product">Start Date:</Form.Label>
                        <Form.Control type="text" placeholder="Employee Start Date" name="start_date" />
                    </Form.Group>
                    <Form.Group controlId="formBasicQty">
                        <Form.Label class="product">Shift:</Form.Label>
                        <Form.Control type="decimal" placeholder="Shift" name="qty" />
                    </Form.Group>
                    <Form.Group>
                        <span></span>
                    </Form.Group>
                    <div class="addButton"></div>
                    <Button  class="btn btn-primary btn-lg btn-block" variant="primary" type="submit">
                        Add to Employees
            </Button>
            <div class="addButton"></div>
                </Form>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            {/* <th>Index</th> */}
                            <th class="product2">Name:</th>
                            <th class="product2">Hours</th>
                            <th class="product2">Start Date:</th>
                            <th class="product2">Shift</th>
                            <th class="product2">View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.employees.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        {/* <td>{index}</td> */}
                                        <td>{item.emp_name}</td>
                                        <td>{item.emp_hours}</td>
                                        <td>{item.emp_startday}</td>
                                        <td>{item.shift_id}</td>
                                        <td class="spacer">
                                            <Button onMouseEnter={(this.changeBackground)} onMouseLeave={(this.changeSubBack)} variant="danger" onClick={event => this.delVal(event)} value={index}>Delete</Button>

                                            <Button onMouseEnter={(this.changeBackground)} onMouseLeave={(this.changeSubBack)} variant="danger" onClick={event => this.delVal(event)} value={index}>Select</Button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </div>
        )
    }

}