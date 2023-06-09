import React, { useEffect, useRef, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import axios from 'axios';
import { ComponentToPrint } from '../components/ComponentToPrint';
import { useReactToPrint } from 'react-to-print';

function Menu() {
  const [smoothieTypes, setSmoothieTypes] = useState([
    'Feel Energized',
    'Get Fit',
    'Manage Weight',
    'Be Well',
    'Enjoy a Treat',
  ]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState(['Napkins', 'Cups', 'Straws']);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [productType, setProductType] = useState(smoothieTypes[0]);

  /**
   * Fetches smoothies from the server / backend and sets them in the state.
   * @async
   * @function
   * @returns {Promise<void>} Promise that resolves when the products have been fetched and set in the state.
   * @throws {Error} If there is an error fetching the products.
   */
  const fetchProducts = async () => {
    try {
      const response = await fetch('https://team64backend.onrender.com/smoothies');
      const jsonData = await response.json();
      setProducts(jsonData);
      console.log(jsonData);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const componentRef = useRef();

  const handleReactToPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrint = () => {
    handleReactToPrint();
  };

  /**
   * Adds the Google Translate element to the document.
   * @function
   * @name addTranslateScript
   */
  const addTranslateScript = () => {
    /**
     * Creates a script element.
     * @type {HTMLElement}
     */
    var addScript = document.createElement('script');
    addScript.setAttribute(
      'src',
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
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
        pageLanguage: 'en',
        autoDisplay: false,
      },
      'google_translate_element'
    );
  };

  useEffect(() => {
    addTranslateScript();
  }, []);

  /**
   * Handles the click event for a product type button and sets the current product type.
   *
   * @param {string} type - The type of product to set as current.
   * @returns {void}
   */
  const handleProductTypeClick = (type) => {
    setProductType(type);
  };

  return (
    <MainLayout>
      <div id="google_translate_element"></div>
      <h1>Menu</h1>
      <div className='row'>
        <h5>Smoothie Types</h5>
      </div>
      <div className="row">
        <div className="col-lg-12">
            
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
            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-7 g-0 gy-0 my-0' style={{ marginBottom: '0' }}>
              {products.map((product, key) => {
                if (product.sm_type == productType) {
                  return (
                    <div key={key} className='col-lg-3 mb-2 smoothie-item'>
                        <div className='pos-item px-0 text-center border' style={{fontSize: '9px', height: 'auto'}}>
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
      </div>
    </MainLayout>
  );

  
}
      
export default Menu

