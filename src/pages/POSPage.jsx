import React, {useEffect, useRef, useState} from 'react'
import MainLayout from '../layouts/MainLayout'
import axios from "axios"
import { ComponentToPrint } from '../components/ComponentToPrint';
import { useReactToPrint } from 'react-to-print';

function updateTransaction(trans_date, trans_dayofweek, trans_price, sm_name, offset) {
  return fetch('https://team64backend.onrender.com/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trans_date, trans_dayofweek, sm_name, trans_price, offset}),
  }).then((response) => response.json());
} 
 
function POSPage() {

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchProducts = async() => {
    try {
      const response = await fetch("https://team64backend.onrender.com/smoothies")
      const jsonData = await response.json()
      setProducts(jsonData)
      for (let i = 0; i < products.length; i++) {
        products[i].sm_price = products[i].sm_price.toFixed(2)
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [])
  const addProductToCart = async(product) => {
    let findProductInCart = await cart.find(i=>{
      return i.sm_id === product.sm_id
    });

    if(findProductInCart){
      let newCart = [];
      let newItem;

      cart.forEach(cartItem => {
        if(cartItem.sm_id === product.sm_id){
          newItem = {
            ...cartItem,
            quantity: cartItem.quantity + 1,
            totalAmount: cartItem.sm_price * (cartItem.quantity + 1)
          }
          newCart.push(newItem);
        } else {
          newCart.push(cartItem);
        }
      });

      setCart(newCart);

    } else {
      let addingProduct = {
        ...product,
        'quantity': 1,
        'totalAmount': product.sm_price,
      }
      setCart([...cart, addingProduct]);
    }

  }

  const removeProduct = async(product) =>{
    const newCart =cart.filter(cartItem => cartItem.sm_id !== product.sm_id);
    setCart(newCart);
  }

  const componentRef = useRef();

  const handleReactToPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrint = () => {
    handleReactToPrint(); 
    let offset=0
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString()
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const day = ("0" + currentDate.getDate()).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    console.log(formattedDate)
    cart.forEach(cartItem => {
      updateTransaction(formattedDate, dayOfWeek, cartItem.totalAmount, cartItem.sm_name, offset)
      offset+=1
    });
  }

  useEffect(() => {
    fetchProducts();
  },[]);

  useEffect(() => {
    let newTotalAmount = 0;
    cart.forEach(icart => {
      newTotalAmount = newTotalAmount + parseFloat(icart.totalAmount);
    })
    setTotalAmount(newTotalAmount);
  },[cart])

  return (
    <MainLayout>
      <div className='row'>
        <div className='col-lg-8'>
          {isLoading ? 'Loading' : <div className='row'>
              {products.map((product, key) =>
                <div key={key} className='col-lg-3 mb-5'>
                  <div className='pos-item px-0 text-center border' onClick={() => addProductToCart(product)}>
                      <p>{product.sm_name}</p>
                      <img src={product.sm_img} className="img-fluid" alt={product.sm_name} />
                      <p>${product.sm_price}</p>
                  </div>

                </div>
              )}
            </div>}
       
        </div>
        <div className='col-lg-4'>
              <div style={{display: "none"}}>
                <ComponentToPrint cart={cart} totalAmount={totalAmount} ref={componentRef}/>
              </div>
              <div className='table-responsive bg-dark'>
                <table className='table table-responsive table-light table-hover'>
                  <thead>
                    <tr>
                      <td>#</td>
                      <td>Name</td>
                      <td>Price</td>
                      <td>Qty</td>
                      <td>Total</td>
                      <td>Action</td>
                    </tr>
                  </thead>
                  <tbody>
                    { cart ? cart.map((cartProduct, key) => <tr key={key}>
                      <td>{cartProduct.sm_id}</td>
                      <td>{cartProduct.sm_name}</td>
                      <td>${cartProduct.sm_price}</td>
                      <td>{cartProduct.quantity}</td>
                      <td>${cartProduct.totalAmount}</td>
                      <td>
                        <button className='btn btn-danger btn-sm' onClick={() => removeProduct(cartProduct)}>Remove</button>
                      </td>

                    </tr>)

                    : 'No Item in Cart'}
                  </tbody>
                </table>
                <h2 className='px-2 text-white'>Total Cost: ${totalAmount.toFixed(2)}</h2>
              </div>

              <div className='mt-3'>
                { totalAmount !== 0 ? <div>
                  <button className='btn btn-primary' onClick={handlePrint}>
                    Checkout
                  </button>

                </div> : 'Please add a product to the cart'

                }
              </div>


        </div>
      </div>
    </MainLayout>
   
  )
}

export default POSPage