// src/layout/Layout.jsx
import React from 'react';
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import Navbar from "../components/Navbar.jsx";
import './Layout.css';
import {useState, useEffect} from 'react';

export function Layout() {
    const [navbar, setNavbar] = useState(() => window.matchMedia("(min-width: 650px)").matches)

    // Makes the sidebar appear(and stay) when the window size is greater than 650px
    useEffect(()=> {
        const mediaQuery= window.matchMedia("(min-width:650px)")
        mediaQuery.addEventListener("change", (event)=>{setNavbar(event.matches);});
    },[])
    return (
        <div className="app-layout">
            <SignedOut>
                <Navigate to="/sign-in" replace />
            </SignedOut>
            <SignedIn>
                {/*<div className={`hamburger-icon ${open ? "open" : ""}`} onClick={() => setNavbar(!navbar)}>*/}
                {/*    <span/>*/}
                {/*    <span/>*/}
                {/*    <span/>*/}
                {/*</div>*/}

                <aside className={ navbar ? 'app-sidebar' : 'app-navbar' }>
                    {navbar? <Sidebar/>: <Navbar/>}
                </aside>
                {/*<aside className="nav-bar"  style={{ visibility: navbar ? 'visible' : 'hidden' }}> <Navbar/></aside>*/}

                <main className="app-content">
                    <div className="main-content-area">
                        <Outlet/>
                    </div>
                </main>
            </SignedIn>
        </div>
    );
}
