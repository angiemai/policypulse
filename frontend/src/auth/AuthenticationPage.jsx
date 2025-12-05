import "react"
import {SignIn, SignUp, SignedIn, SignedOut, SignUpButton} from "@clerk/clerk-react"
import {useNavigate} from "react-router-dom";
import React from "react";
import './AutenticationPage.css';
import LandingPage from "./LandingPage.jsx";
import img1 from "./Img/policy-writing-illustration.jpg"

const pageStyle = {display: "flex", alignItems: "center", justifyContent: "center", height: "100vh"}

export function AuthenticationPage() {
    return <div>
        <SignedOut>
            <LandingPage/>
        </SignedOut>
        <SignedIn>
            <div className="redirect-message">
                <p>You are already signed in.</p>
            </div>
        </SignedIn>
    </div>
}

export const LogInPage = () => {
    return (
        <div style={pageStyle}>
            <SignIn routing="path" path="/log-in"/>
        </div>
    )
}

export const SignUpPage = () => {
    return (
        <div style={pageStyle}>
            <SignUp routing="path" path="/sign-up"
            />
        </div>
    )
}