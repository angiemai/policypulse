import {
    BookOutlined,
    CalculatorOutlined,
    FileTextOutlined,
    FolderOutlined,
    FormOutlined,
    HomeOutlined, RobotOutlined
} from "@ant-design/icons";
import React from "react";
import {Carousel} from "antd";
import {Link} from "react-router-dom";

export default function Navbar(){
    const navbarItems = [
  { key: "home", label: "Home", path: "/home", icon: <HomeOutlined /> },
  { key: "courses-list", label: "Courses", path: "/courses-list", icon: <BookOutlined /> },
  { key: "documents", label: "My Documents", path: "/documents", icon: <FolderOutlined /> },
  { key: "policy-writer", label: "Policy Writer", path: "/policy-writer", icon: <FormOutlined /> },
  { key: "my-policies", label: "My Policies", path: "/my-policies", icon: <FileTextOutlined /> },
  { key: "calculator", label: "Calculator", path: "/calculator", icon: <CalculatorOutlined /> },
  { key: "ai-agent", label: "AI Agent", path: "/ai-agent", icon: <RobotOutlined /> },
];
    return (<div style={{  width: "100vw", backgroundColor: "var(--primary-color)", padding:"5px 20px 5px 10px"}}>
            <Carousel arrows infinite={false} slidesToShow={1} slidesToScroll={1} dots={false}  >
                {navbarItems.map((item) => (
                    <div key={item.path} >
                        <Link
                            to={item.path}
                            style={{
                                padding: "10px 20px",
                                display: "flex",
                                alignItems:"center",
                                justifyContent:"center",
                                color: "#fff",
                                borderRadius: "5px",
                                fontSize:16,
                            }}
                        >
                            {item.label}
                        </Link>
                    </div>
                ))}
            </Carousel>
        </div>)
}