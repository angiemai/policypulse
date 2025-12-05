import React from 'react';
import { Routes, Route } from "react-router-dom";
import { ConfigProvider } from 'antd';

import ClerkProviderWithRoutes from "./auth/ClerkProviderWithRoutes.jsx";
import { Layout } from "./layout/Layout.jsx";
import { AuthenticationPage } from "./auth/AuthenticationPage.jsx";
import './App.css';

import  Home from "./home/Home.jsx"; // Import Home component
import { Calculator } from "./calculator/Calculator.jsx";
import { AIAgent } from "./agent/AIAgent.jsx";
import { Settings } from './settings/Settings';

import PolicyWriter from './policywriter/PolicyWriter.jsx';
import { MyPolicies } from './policy/MyPolicies.jsx';     // MyPolicies is in src/policy/
import { MyDocumentsList } from './documents/MyDocumentsList.jsx'; // MyDocumentsList is a separate page
import CoursesList from "./courses/CoursesList.jsx"
import Notifications from "./notifications/Notifications.jsx";
import {LogInPage} from "./auth/AuthenticationPage.jsx";
import {SignUpPage} from "./auth/AuthenticationPage.jsx";
import PoliciesManager from "./policy/Policy.jsx";

function App() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#8A38F5',
                },
            }}
        >
            <ClerkProviderWithRoutes>
                <Routes>
                    <Route path="/log-in/*" element={<LogInPage/>}/>
                    <Route path="sign-up" element={<SignUpPage/>}/>
                    <Route path="/sign-in/*" element={<AuthenticationPage />} /> {/* By default, clerk sets it the route name to "sign-in"*/}
                    {/*<Route path="/sign-up" element={<AuthenticationPage />} />*/}
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path ="/courses-list" element={<CoursesList />}/>
                        <Route path="/policies-list" element={<PoliciesManager/>}/>

                        <Route path="/documents" element={<MyDocumentsList />} /> {/* Route for MyDocumentsList */}
                        {/* Policy Writer route now includes an optional ID for editing */}
                        <Route path="/policy-writer/:policyId?" element={<PolicyWriter />} />
                        <Route path="/my-policies" element={<MyPolicies />} /> {/* Route for MyPolicies */}

                        <Route path="/calculator" element={<Calculator />} />
                        <Route path="/ai-agent" element={<AIAgent />} />
                        <Route path="/notifications" element={<Notifications/>} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>
                </Routes>
            </ClerkProviderWithRoutes>
        </ConfigProvider>
    );
}

export default App;
