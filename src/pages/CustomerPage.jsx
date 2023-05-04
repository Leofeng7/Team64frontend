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
function CustomerPage() {

  {/* Define variables */}
  const [smoothieTypes, setSmoothieTypes] = useState(['Feel Energized', 'Get Fit', 'Manage Weight', 'Be Well', 'Enjoy a Treat']);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState(['Napkins', 'Cups', 'Straws']);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [productType, setProductType] = useState('Be Well');
  const [isPurchased, setIsPurchased] = useState(false); // for purchased print

  const tts = () => {

    const speech = new SpeechSynthesisUtterance("");
  
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
    words += "Total : "
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
      console.log(jsonData)
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
  const addProductToCart = async(product) =>{
    // check if the adding product exist
    let findProductInCart = await cart.find(i=>{
      return i.sm_id === product.sm_id
    });

    {/* Increment the count on the quantity for the smoothie */}
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
        }else{
          newCart.push(cartItem);
        }
      });

      {/* Set the cart and display the update */}
      setCart(newCart);

    {/* Copy over items into a new cart array */}
    }else{
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
  const removeProduct = async(product) => {
    const newCart = cart.filter(cartItem => cartItem.sm_id !== product.sm_id);
    setCart(newCart);
  }

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => setIsPurchased(true)
  });

  /**
   * Updates the cart total when the cart changes.
   * @function
   * @name useEffect
   * @param {array} cart - The cart state array.
   */
  const handlePrint1 = () => {
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
  };

  const handlePrints = () => {
    handlePrint()
    handlePrint1()
  }
  

  {/* Update the cart total */}
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

  /**
   * Adds the Google Translate element to the document.
   * @function
   * @name addTranslateScript
   */
  function addTranslateScript() {
    /**
     * Creates a script element.
     * @type {HTMLElement}
     */
    var addScript = document.createElement("script");
      addScript.setAttribute(
        "src",
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      );
      /**
       * Appends the script element to the body of the document.
       */
      document.body.appendChild(addScript);
      /**
       * Sets the global function that will be called when the Google Translate element is initialized.
       */
      window.googleTranslateElementInit = googleTranslateElementInit;
  };

  /**
    * Creates a new Google Translate element and initializes it to English.
    * @function
    * @global
    * @returns {void}
    */
  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        autoDisplay: false
      },
      "google_translate_element"
    );
  };

  /**
    * Adds the Google Translate script upon mounting.
    * @function
    * @param {Function} fun - The function to be executed upon mounting.
    * @returns {void}
    */
  const useMountEffect = (fun) => useEffect(fun, [])
  {
    useMountEffect(addTranslateScript);
  }

  {/* Main page HTML */}
  return (
    <MainLayout>
    <div id="google_translate_element"></div>
      <h1>Self-Order</h1>
      <div className='row'>
        <h5>Smoothie Types</h5>
      </div>
      <div className="row">
        <div className="col-lg-10">
            
          <div className="row mb-3">
            <div className="col-lg-2 btn btn-rounded" onClick={() => setProductType('Coffee')}>
                Coffee
            </div>
            <div className="col-lg-2 btn btn-rounded" onClick={() => setProductType('Strawberry')}>
                Strawberry
            </div>
            <div className="col-lg-2 btn btn-rounded" onClick={() => setProductType('Blueberry')}>
                Blueberry
            </div>
            <div className="col-lg-2 btn btn-rounded" onClick={() => setProductType('Greens')}>
                Greens
            </div>
            <div className="col-lg-2 btn btn-rounded" onClick={() => setProductType('Mango')}>
                Mango
            </div>
            <div className="col-lg-2 btn btn-rounded" onClick={() => setProductType('Raspberry')}>
                Raspberry
            </div>
          </div>
  
          {isLoading ? (
            'Loading'
          ) : (
            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 g-0 gy-0 my-0 smoothiegrid' style={{ marginBottom: '0'}}>
              {products.map((product, key) => {
                if (product.sm_type == productType) {
                  return (
                    <div key={key} className='col-lg-3 mb-2 smoothie-item'>
                        <div className='pos-item px-0 text-center border' style={{fontSize: '9px', height: 'auto'}} onClick={() => addProductToCart(product)}>
                            <p>{product.sm_name}</p>
                            <img src={product.sm_img} className="img-fluid" style={{width: '60%'}} alt={product.sm_name} />
                            <p>${product.sm_price}</p>
                        </div>
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>
        <div className='col-lg-4 parent-element' style={{ transform: 'translateX(50px)' }}>
              <div style={{display: "none"}}>
                <ComponentToPrint cart={cart} totalAmount={totalAmount} ref={componentRef}/>
              </div>
              <div className='table-responsive bg-dark' style={{ transform: 'scale(0.7)', height: '50vh' }}>
                <div style={{ overflowY: 'auto', height: '100%' }}>
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
                </div>
                <div className='fixed-bottom bg-dark d-flex align-items-center' style={{ height: '70px', lineHeight: '50px' }}>
                  <h2 className='px-2 text-white'>Total Amount: ${totalAmount.toFixed(2)}</h2>
                </div>
              </div>

              <div className='mt-3 plsaddmsg'>
                { totalAmount !== 0 ? <div>
                  <button className='btn btn-primary paynowbtn' style={{ width: "110%" }} onClick={handlePrints}>
                    Pay Now
                  </button>

                </div> : 'Please add a product to the cart'

                }
              </div>
              {isPurchased && <div className="purchasedbtn" style={{color: 'green'}}>Purchase successful!</div>}s
              
        </div>
      </div>
    </MainLayout>
  )
}

export default CustomerPage