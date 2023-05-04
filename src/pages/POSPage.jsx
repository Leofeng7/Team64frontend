import React, {useEffect, useRef, useState} from 'react'
import MainLayout from '../layouts/MainLayout'
import axios from "axios"
import { ComponentToPrint } from '../components/ComponentToPrint';
import { useReactToPrint } from 'react-to-print';

/**
 * Updates a transaction by sending a POST request to the server.
 * @param {string} trans_date - The date of the transaction.
 * @param {string} trans_dayofweek - The day of the week of the transaction.
 * @param {number} trans_price - The price of the transaction.
 * @param {string} sm_name - The name of the smoothie.
 * @param {number} offset - Used for creating transactions and makes it easier in the backend (indexing and etc)
 * @returns {Promise<object>} A Promise that resolves to the JSON response from the server.
 */
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

  const tts = () => {

    const speech = new SpeechSynthesisUtterance("");
    speech.rate=1.2
    const voices = window.speechSynthesis.getVoices();
    console.log(voices)
    const selectedVoice = voices.find(voice => voice.name === "Google UK English Male");
    speech.voice = selectedVoice
    speech.lang = "en-US";
    console.log(window.speechSynthesis)
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech); 
    let words="Here is your receipt : "
    cart.forEach(cartItem => {
        words += "Smoothie Name : "
        words += cartItem.sm_name + "."
        words += "Quantity : "
        words += String(cartItem.quantity) + "."
    });
    words += "Order Total : "
    words += String(totalAmount)
    speech.text=words
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);  
  };

  /**
   * Fetches smoothies from the server / backend and sets them in the state.
   * @async
   * @function
   * @returns {Promise<void>} Promise that resolves when the products have been fetched and set in the state.
   * @throws {Error} If there is an error fetching the products.
   */
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

  /**
   * Adds a smoothie product to the customer's cart.
   * @async
   * @function
   * @param {Object} product - The smoothie product to be added to the cart.
   * @param {string} product.sm_id - The unique ID of the smoothie product.
   * @param {number} product.sm_price - The price of the smoothie product.
   * @returns {Promise<void>} Promise that resolves when the smoothie product has been added to the cart.
   * @throws {Error} If there is an error adding the smoothie product to the cart.
   */
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

  /**
   * Removes a smoothie from the customer's cart
   * @param {object} product - The smoothie to remove from the cart
   */
  const removeProduct = async(product) =>{
    const newCart =cart.filter(cartItem => cartItem.sm_id !== product.sm_id);
    setCart(newCart);
  }

  const componentRef = useRef();

  const handleReactToPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  /**
   * Handles the printing of the component and updates the transaction for each item in the cart.
   * @returns {void}
   */
  const handlePrint = () => {
    handleReactToPrint(); 
    tts()
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

  /**
   * Updates the cart total when the cart changes.
   * @function
   * @name useEffect
   * @param {array} cart - The cart state array.
   */
  useEffect(() => {
    /**
     * Calculates the new cart total.
     * @type {number}
     */
    let newTotalAmount = 0;
    cart.forEach(icart => {
      newTotalAmount = newTotalAmount + parseFloat(icart.totalAmount);
    })
    /**
     * Sets the new cart total.
     * @type {number}
     */
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