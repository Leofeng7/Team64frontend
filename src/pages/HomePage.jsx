import React, { useState } from "react"
import { GoogleLogin } from '@react-oauth/google';
import {Link} from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { useNavigate } from "react-router-dom";

function HomePage() {
  let [authMode, setAuthMode] = useState("signin")
  const navigate = useNavigate();
  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
  }

  const [emailText, setemailText] = useState("");
  const [passwordText, setpasswordText] = useState("");

  /**
   * Performs a login check for the user with the given email and password.
   * If successful, navigates to the POS page.
   * @async
   * @function checkLogin
   * @returns {void}
   */
  async function checkLogin() {
    try {
      const response = await fetch("https://team64backend.onrender.com/oauth", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({emailText, passwordText}),
      })
      const jsonData = await response.json()
      if (jsonData[0].oauth_view == "server") {
        navigate('/pos')
      } else if (jsonData[0].oauth_view == "manager") {
        navigate('/man')
      } else if (jsonData[0].oauth_view == "customer") {
        navigate('/customer')
      } else {
        navigate('/menu')
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  /**
   * Handle change event for email input field
   * @param {object} event - The event object
   */
  const handleEmailChange = (event) => {
    setemailText(event.target.value); // Update state with the input value
  };

  /**
    * Updates the state with the input value of the password field.
    * 
    * @param {Object} event - The input change event object.
    * @param {string} event.target.value - The value of the password input field.
    * @return {void}
    */
  const handlePasswordChange = (event) => {
    setpasswordText(event.target.value); // Update state with the input value
  };
  
  return (
    <MainLayout>
        <div className='bg-light p-5 mt-4 rounded-3'>
          <h1>Smoothie King Server Login</h1>
          <div className="Auth-form-container">
          <form className="Auth-form">
            <div className="Auth-form-content">
              <h3 className="Auth-form-title">Sign In</h3>
              <div className="text-center">
              </div>
              <div className="form-group mt-3">
                <label>Email address</label>
                <input
                  type="email"
                  className="form-control mt-1"
                  placeholder="Enter email"
                  value={emailText}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control mt-1"
                  placeholder="Enter password"
                  value={passwordText}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="d-grid gap-2 mt-3">
                  <Link to='' onClick = {checkLogin} className='btn btn-primary'>Login</Link>
              </div>
            </div>
            <div className="d-grid gap-2 mt-3">
              <GoogleLogin className = 'form-control mt-1'
                onSuccess={credentialResponse => {
                  console.log(credentialResponse);
                  navigate('/pageselect')
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
            </div>
          </form>
          
        </div>
      </div>
    </MainLayout>
  )
}



export default HomePage