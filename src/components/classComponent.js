import { Form, Button, Table } from "react-bootstrap";
import { createRef, Component } from 'react';
import './comp.css';


export default class AddInventory extends Component{
    constructor() {
        super();
        this.state = {
            products: []
        }
        this.fetchProducts()
        this.formData = createRef();
    }

    fetchProducts = async() => {
        try {
          const response = await fetch("http://localhost:8000/inventory")
          const jsonData = await response.json()
          await this.setState({
            products: jsonData
          });
        } catch (err) {
          console.log(err.message)
        }
    }

    AddItem(item_quantitylbs, item_name, item_ppp) { // Adding a new item to the database
        return fetch('http://localhost:8000/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item_quantitylbs, item_name, item_ppp }),
        }).then((response) => response.json());
    } 

    DeleteItem(item_id) { // Deleting an item from the database
        return fetch('http://localhost:8000/inventory', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({item_id}),
        }).then((response) => response.json());
    } 

    IncrementItem(item_id, val) {
        return fetch('http://localhost:8000/inventory/:item_id"', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({item_id, val}),
        }).then((response) => response.json());
    }
    
    // addproduct handler method
    add = (event) => {
        event.preventDefault();
        const newProduct = {
            item_id: this.state.products.length + 1, 
            item_name: this.formData.current.product_name.value,
            item_ppp: this.formData.current.price.value,
            item_quantitylbs: Number(this.formData.current.qty.value)
        }

        this.AddItem(newProduct.item_quantitylbs, newProduct.item_name, newProduct.item_ppp)
        // add a new product inside products array
        this.state.products.push(newProduct);
        this.setState({
            products: this.state.products
        }); 
    }
    // increment qty value by 1
    increQty = (event) => {
        //console.log(event.target.value)
        const indexOfArray = event.target.value;
        this.state.products[indexOfArray].item_quantitylbs = this.state.products[indexOfArray].item_quantitylbs + 1;
        this.IncrementItem(this.state.products[indexOfArray].item_id, 1)
        this.setState({
            products: this.state.products
        });
    }
    // decrement qty value by 1
    decreQty = (event) => {
        const indexOfArray = event.target.value;
        if (this.state.products[indexOfArray].qty == 0) {
            return;
        }
        this.state.products[indexOfArray].item_quantitylbs = this.state.products[indexOfArray].item_quantitylbs - 1;

        this.IncrementItem(this.state.products[indexOfArray].item_id, -1)
        this.setState({
            products: this.state.products
        });
    }
    delVal = (event) => {
        const indexOfArray = event.target.value;
        this.DeleteItem(this.state.products[indexOfArray].item_id)
        delete this.state.products[indexOfArray];
        this.setState({
            products: this.state.products
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
                        <Form.Label class="product">Product Name:</Form.Label>
                        <Form.Control type="text" placeholder="Enter Item Name" name="product_name" />
                    </Form.Group>

                    <Form.Group controlId="formBasicPrice">
                        <Form.Label class="product">Price:</Form.Label>
                        <Form.Control type="decimal" placeholder="Price in USD" name="price" />
                    </Form.Group>

                    <Form.Group controlId="formBasicQty">
                        <Form.Label class="product">Quantity:</Form.Label>
                        <Form.Control type="decimal" placeholder="How many: qty (lbs.)" name="qty" />
                    </Form.Group>
                    <Form.Group>
                        <span></span>
                    </Form.Group>
                    <div class="addButton"></div>
                    <Button  class="btn btn-primary btn-lg btn-block" variant="primary" type="submit">
                        Add to Inventory
            </Button>
            <div class="addButton"></div>
                </Form>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            {/* <th>Index</th> */}
                            <th class="product2">Product Name:</th>
                            <th class="product2">Price</th>
                            <th class="product2">Qty</th>
                            <th class="product2">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.products.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        {/* <td>{index}</td> */}
                                        <td>{item.item_name}</td>
                                        <td>{item.item_ppp}</td>
                                        <td>{item.item_quantitylbs}</td>
                                        <td class="spacer">
                                            <Button onMouseEnter={(this.changeBackground)} onMouseLeave={(this.changeAddBack)} variant="success" onClick={event => this.increQty(event)} value={index}>+</Button>
                                            <Button onMouseEnter={(this.changeBackground)} onMouseLeave={(this.changeSubBack)} variant="danger" onClick={event => this.decreQty(event)} value={index}>-</Button>
                                            <Button onMouseEnter={(this.changeBackground)} onMouseLeave={(this.changeSubBack)} variant="danger" onClick={event => this.delVal(event)} value={index}>Delete</Button>
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