/*jshint esversion: 8 */
import React, { useState, useEffect } from 'react';
//{{Insert code here}} // Step 1 Task 1: Import urlConfig from `giftlink-frontend/src/config.js`
import {urlConfig} from '../../config';
//{{Insert code here}} //Step 1 Task 2: Import useAppContext `giftlink-frontend/context/AuthContext.js`
import { useAppContext } from '../../context/AuthContext';
//{{Insert code here}} // Step 1 Task 3: Import useNavigate from `react-router-dom` to handle navigation after successful registration.
import { useNavigate } from 'react-router-dom';

import './LoginPage.css';

function LoginPage() {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

//Do these tasks inside the RegisterPage function after the useStates definition
//{{Insert code here}} // Step 1 Task 4: Include a state for incorrect password.
const [incorrect, setIncorrect] = useState('');

//{{Insert code here}} // Step 1 Task 5: Create a local variable for `navigate`,`bearerToken`   and `setIsLoggedIn`.
const navigate = useNavigate();
const bearerToken = sessionStorage.getItem('bearer-token');
const { setIsLoggedIn } = useAppContext();

//{{Insert code here}} // Step 1 Task 6. If the bearerToken has a value (user already logged in), navigate to MainPage
useEffect(() => {
    if (sessionStorage.getItem('auth-token')) {
      navigate('/app')
    }
  }, [navigate])

const handleLogin = async (e) => {
    e.preventDefault();
        // api call
        // template show const response = await fetch(`/api/auth/login`, {
        // FInal solution this
        const res = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {

           //{{Insert code here}} // Step 1 Task 7: Set method
           method: 'POST',

           //{{Insert code here}} // Step 1 Task 8: Set headers
           headers: {
            'content-type': 'application/json',
            'Authorization': bearerToken ? `Bearer ${bearerToken}` : '', // Include Bearer token if available
          },
           //{{Insert code here}} // Step 1 Task 9: Set body to send user details
           body: JSON.stringify({    
            email: email,
            password: password,
          })
        });
        
        // Step 2 Task 1: Access data coming from fetch API
        const json = await res.json();
        console.log('Json', json);
        if (json.authtoken) {

            // Step 2 Task 2: Set user details
            sessionStorage.setItem('auth-token', json.authtoken);
            sessionStorage.setItem('name', json.userName);
            sessionStorage.setItem('email', json.userEmail);

            // Step 2 Task 3: Set the user's state to log in using the `useAppContext`.
            setIsLoggedIn(true);
            // Step 2 Task 4: Navigate to the MainPage after logging in.
            navigate('/app');
        } else {
        // Step 2 Task 5: Clear input and set an error message if the password is incorrect
            document.getElementById("email").value="";
            document.getElementById("password").value="";
            setIncorrect("Wrong password. Try again.");
            setTimeout(() => {
            setIncorrect("");
            }, 2000);
        }
        
    }

        
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="login-card p-4 border rounded">
              <h2 className="text-center mb-4 font-weight-bold">Login</h2>

          {/* insert code here to create input elements for the variables email and  password */}
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                    id="email"
                    type="text"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                    id="password"
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            {/*Step 2: Task 6*/} 
            <span style={{color:'red',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px'}}>{incorrect}</span>
                        
            </div>
            
            {/* insert code here to create a button that performs the `handleLogin` function on click */}
            <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Login</button>
                <p className="mt-4 text-center">
                    New here? <a href="/app/register" className="text-primary">Register Here</a>
                </p>

            </div>
          </div>
        </div>
      </div>
    );
}


export default LoginPage;
