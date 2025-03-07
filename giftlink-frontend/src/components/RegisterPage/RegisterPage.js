/*jshint esversion: 8 */
import React, { useState } from 'react';

//{{Insert code here}} //Step 1 - Task 1: Import urlConfig from `giftlink-frontend/src/config.js`
import {urlConfig} from '../../config';

//{{Insert code here}} //Step 1 - Task 2: Import useAppContext `giftlink-frontend/context/AuthContext.js`
import { useAppContext } from '../../context/AuthContext';

//{{Insert code here}} //Step 1 - Task 3: Import useNavigate from `react-router-dom` to handle navigation after successful registration.
import { useNavigate } from 'react-router-dom';

import './RegisterPage.css';

function RegisterPage() {
    // Insert code here to create useState hook variables for firstName, lastName, email, password
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //{{Insert code here}} //Step 1 - Task 4: Include a state for error message.
    const [showerr, setShowerr] = useState('');

    //{{Insert code here}} //Step 1 - Task 5: Create a local variable for `navigate`   and `setIsLoggedIn`.
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();


    // Insert code here to create handleRegister function and include console.log
    const handleRegister = async () => {
        const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
            //{{Insert code here}} //Step 1 - Task 6: Set method
            method: 'POST',
            //{{Insert code here}} //Step 1 - Task 7: Set headers
            headers: {
                'content-type': 'application/json',
            },
            //{{Insert code here}} //Step 1 - Task 8: Set body to send user details
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            })
        });

        
            //Step 2 - Task 1
            const json = await response.json();
            console.log('json data', json);
            console.log('er', json.error);
            //Step 2 - Task 2
            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', firstName);
                sessionStorage.setItem('email', json.email);
            //Step 2 - Task 3
                setIsLoggedIn(true);
            //Step 2 - Task 4
                navigate('/app');
            }
            if (json.error) {
            //Step 2 - Task 5
                setShowerr(json.error);
            }
        }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="register-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Register</h2>

                        {/* Insert code here to create input elements for all the variables - firstName, lastName, email, password */}
                        {/* FirstName  */}
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label"> First Name</label><br />
                            <input
                                id="firstName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        {/* LastName  */}
                            <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">LastName</label>
                            <input
                                id="lastName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        {/* email  */}
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

                        {/* Password  */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        {/* Step 2 - Task 6*/}
                        
                                <div className="text-danger">{showerr}</div>
                        </div>

                        {/* Insert code here to create a button that performs the `handleRegister` function on click */}
                        <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>Register</button>
                        <p className="mt-3 text-center">
                            Already a member? <a href="/app/login" className="text-primary">Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    ); // End of return
}

export default RegisterPage;
