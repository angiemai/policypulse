// src/components/Sidebar.jsx
import React, {useState,useEffect} from 'react';
import { Menu, Carousel, Button } from 'antd';
import {
    HomeOutlined, BookOutlined,
    CalculatorOutlined,
    RobotOutlined,
    SettingOutlined,
    FileTextOutlined, // For My Policies
    FormOutlined,     // For Policy Writer
    FolderOutlined,   // For My Documents
    BellOutlined, // For Notifications
    LeftOutlined, RightOutlined, ScheduleOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, UserButton, useUser } from "@clerk/clerk-react"; 

// IMPORTANT: Import your logo here
import PolicyPulseLogo from '../assets/Original on Transparent.png';
import './Sidebar.css'; // Import sidebar specific styles

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export function Sidebar() {
  const location = useLocation();
  const { isLoaded, isSignedIn, user } = useUser();

  // // WINDOW LISTENER FOR CONDITIONAL RENDER OF NAVBAR AND SIDEBAR
  // const [matches, setMatches] = useState(() => window.matchMedia("(max-width: 768px)").matches);
  //
  // useEffect(() => {
  //   const mediaQueryList = window.matchMedia("(max-width: 768px)");
  //   const listener = (e) => setMatches(e.matches);
  //
  //   mediaQueryList.addEventListener("change", listener);
  //   return () => mediaQueryList.removeEventListener("change", listener);
  // }, []);

  let selectedMenuKey = 'home';
  if (location.pathname.startsWith('/documents')) { // My Documents link
    selectedMenuKey = 'documents';
  } else if (location.pathname.startsWith("/courses-list")) {
      selectedMenuKey="courses-list";
  } else if (location.pathname.startsWith('/policy-writer')) {
    selectedMenuKey = 'policy-writer';
  } else if (location.pathname.startsWith('/my-policies')) {
    selectedMenuKey = 'my-policies';
  } else if (location.pathname.startsWith('/calculator')) {
    selectedMenuKey = 'calculator';
  } else if (location.pathname.startsWith('/ai-agent')) {
    selectedMenuKey = 'ai-agent';
  }
  if (location.pathname === '/') {
    selectedMenuKey = 'home';
  }

  const isSettingsActive = location.pathname.startsWith('/settings');
  const isNotificationsActive = location.pathname.startsWith('/notifications');
  
  const onClick = (e) => {
    console.log('click ', e);
  };

  const sidebarItems = [
    getItem(<Link to="/home">Home</Link>, 'home', <HomeOutlined />),
    getItem(<Link to="/courses-list"> Courses </Link>, "courses-list", <BookOutlined />) ,
    getItem(<Link to="/documents">My Documents</Link>, 'documents', <FolderOutlined />), // My Documents link added
    getItem(<Link to="/policy-writer">Policy Writer</Link>, 'policy-writer', <FormOutlined />),
    getItem(<Link to="/my-policies">My Policies</Link>, 'my-policies', <FileTextOutlined />),
      getItem(<Link to="policies-list"> Policies</Link>, "policies-list",<ScheduleOutlined />),
    getItem(<Link to="/calculator">Calculator</Link>, 'calculator', <CalculatorOutlined />),
    getItem(<Link to="/ai-agent">AI Agent</Link>, 'ai-agent', <RobotOutlined />),
  ];

//   const navbarItems = [
//   { key: "home", label: "Home", path: "/home", icon: <HomeOutlined /> },
//   { key: "courses-list", label: "Courses", path: "/courses-list", icon: <BookOutlined /> },
//   { key: "documents", label: "My Documents", path: "/documents", icon: <FolderOutlined /> },
//   { key: "policy-writer", label: "Policy Writer", path: "/policy-writer", icon: <FormOutlined /> },
//   { key: "my-policies", label: "My Policies", path: "/my-policies", icon: <FileTextOutlined /> },
//   { key: "calculator", label: "Calculator", path: "/calculator", icon: <CalculatorOutlined /> },
//   { key: "ai-agent", label: "AI Agent", path: "/ai-agent", icon: <RobotOutlined /> },
// ];


  return (
    <div className="sidebar-container">
        {/*{matches? (*/}
            <>
        <div className="sidebar-header">
            <img src={PolicyPulseLogo} alt="Policy Pulse Logo" className="logo" />
            <h1 className="app-title">Policy Pulse</h1>
        </div>

        <div className="sidebar-menu-wrapper">
            <Menu
                onClick={onClick}
                style={{ width: '100%', borderRight: 'none', background: 'transparent'}}
                selectedKeys={[selectedMenuKey]}
                mode="inline"
                items={sidebarItems}
                className="app-sidebar-menu"
            />
        </div>

        <div className="sidebar-footer">
            {/*}  <SignedIn>*/}
            <Link to="/settings" className={`nav-item ${isSettingsActive ? 'active' : ''}`}>
                    <SettingOutlined size={20} />
                    <span>Settings</span>
            </Link>
            <Link to="/notifications" className={`nav-item ${isNotificationsActive ? 'active' : ''}`}>
                    <BellOutlined size={20} />
                    <span>Notifications</span>
            </Link>
            <div className="user-information">
                 <UserButton />
                    <div className="user-details">
                        {isLoaded && isSignedIn && user ? (
                            <>
                                <p className="user-name">{user.fullName || user.username || 'User'}</p>
                                <p className="user-email">{user.primaryEmailAddress ? user.primaryEmailAddress.emailAddress : 'No email'}</p>
                            </>
                        ) : (
                            <>
                                <p className="user-name">Loading...</p>
                                <p className="user-email"></p>
                            </>
                        )}
                    </div>
            </div>
                {/*} </SignedIn>*/} {/* Do no understand if it is necessary*/}
        </div> </>)
        {/*:   (<div style={{width: "100vw"}}>*/}
        {/*    <Carousel arrows infinite={false} slidesToShow={1} slidesToScroll={1} dotPosition="bottom">*/}
        {/*        {navbarItems.map((item) => (*/}
        {/*            <div key={item.path} style={{textAlign: "center"}}>*/}
        {/*                <Link*/}
        {/*                    to={item.path}*/}
        {/*                    style={{*/}
        {/*                        padding: "10px 20px",*/}
        {/*                        display: "inline-block",*/}
        {/*                        backgroundColor: location.pathname.startsWith(item.path) ? "#1890ff" : "#f0f0f0",*/}
        {/*                        color: location.pathname.startsWith(item.path) ? "#fff" : "#000",*/}
        {/*                        borderRadius: "5px",*/}
        {/*                    }}*/}
        {/*                >*/}
        {/*                    {item.label}*/}
        {/*                </Link>*/}
        {/*            </div>*/}
        {/*        ))}*/}
        {/*    </Carousel>*/}
        {/*</div>)}*/}
    </div>
  );
}

