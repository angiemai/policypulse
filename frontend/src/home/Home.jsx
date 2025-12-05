// src/policywriter/PolicyWriter.jsx
import React, {useState} from 'react';
import { Carousel, Tag} from "antd";
// import "antd/dist/reset.css";
import {useUser } from "@clerk/clerk-react"
import './Home.css';
import { Link,useNavigate, useParams } from 'react-router-dom'
import img1 from './images/Image_1.jpeg';
import img2 from "./images/futuristic-brain.jpg"
import img3 from "./images/awards.jpg"
import { ArrowRightOutlined, RiseOutlined, ClockCircleOutlined,TeamOutlined } from '@ant-design/icons'
import { FaMedal, FaAward, FaStethoscope} from 'react-icons/fa';
import { Newspaper, ExternalLink } from "lucide-react";

function Welcome() {
    const {user} = useUser()
    return (
        <div className="home-sections" id="welcome">
            <h1> Welcome back, {user.firstName}!</h1>
            <p> Your personalized dashboard for reproductive health insights,
                policy guidance, and professional development resources.</p>
            <button id="start-convo" onClick={()=>window.open("https://www.we-are-eden.com/", "_blank", "noopener,noreferrer")}> Discover More</button>
        </div>
    )
}

function NewsAI() {
    //const [news, setNews] = useState([]);
    const newsUrl="https://we-are-eden.thinkific.com/products/courses/ai-placeholder"
    const news=[
        {
          headline: "Major UK Firms Expand Fertility Benefits Packages",
          summary: "Leading financial institutions increase IVF coverage limits and add mental health support for employees undergoing fertility treatments.",
          category: "Benefits",
          readTime: "3 min read",
          isBreaking: true,
          source: "HR Today"
        },
        {
          headline: "New Research Links Workplace Stress to Fertility Outcomes",
          summary: "Cambridge study reveals correlation between high-pressure work environments and reproductive health challenges.",
          category: "Research",
          readTime: "4 min read",
          isBreaking: false,
          source: "Medical Journal"
        },
        {
          headline: "EU Proposes Standardized Parental Leave Framework",
          summary: "European Commission introduces comprehensive guidelines for maternity, paternity, and fertility treatment leave policies.",
          category: "Policy",
          readTime: "2 min read",
          isBreaking: false,
          source: "Policy Watch"
        },
        {
          headline: "AI-Powered Fertility Tracking Gains Corporate Adoption",
          summary: "Tech companies partner with reproductive health platforms to offer personalized fertility insights as employee benefits.",
          category: "Technology",
          readTime: "3 min read",
          isBreaking: false,
          source: "Tech Health"
        }
      ];

    const getTagColor = (category) => {
        const tagColors = {
    Policy:     { color: "#1e40af", backgroundColor: "#dbeafe", borderColor: "#bfdbfe" },
    Research:   { color: "#6b21a8", backgroundColor: "#f3e8ff", borderColor: "#d8b4fe" },
    Benefits:   { color: "#065f46", backgroundColor: "#d1fae5", borderColor: "#6ee7b7" },
    Technology: { color: "#0f766e", backgroundColor: "#ccfbf1", borderColor: "#5eead4" },
    Rights:     { color: "#7c2d12", backgroundColor: "#ffedd5", borderColor: "#fdba74" }
  };
    return tagColors[category] || tagColors.Policy; //if the category does not exist, it will return the color of policy tag
  };

    return (
        <div className="home-box-content" style={{gap:"2rem"}}>

            {/*---  LATEST NEWS SECTION  ---*/}
            <div className="news-AI-content" style={{backgroundColor:"rgba(216,253,141,0.18)"}} >
                {/* TITLE */}
                <div className="news-AI-title">
                    <Tag icon={<Newspaper/>} style={{ fontSize:50, padding:"5px 10px", border:"1px solid", borderRadius:7, color:"rgb(68,227,30)", backgroundColor:"rgba(153,255,105,0.4)"}}/>
                    <div>
                        <div style={{display:"flex", gap:10, fontSize:20, fontWeight: "bold"}}>
                            <span>Latest Fertility News</span>
                            <RiseOutlined/>
                        </div>
                        <p>Stay updated on industry developments</p>
                    </div>
                </div>

                {/* CONTENT OF NEWS */}
                <div style={{ width: "100%", maxWidth: "600px", margin: "5px 20px 20px" }}>
                <Carousel autoplay autoplaySpeed={2500} dots>
                {news.slice(0,3).map((item,index)=> (
                    <div key={index} className="news-card" style={{padding:"20px 15px", minHeight:"200px"}}>
                        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                            <Tag style={getTagColor(item.category)}> {item.category}</Tag>
                            <a href={newsUrl} target="_blank" style={{textDecoration:"none", color:"black"}}> <ExternalLink style={{width:20}}/> </a>
                        </div>

                        <div style={{display:"flex", flexDirection:"column", paddingRight:"2.5rem",gap:7}}>
                            <h5 style={{fontWeight:645, fontSize:14}}>{item.headline}</h5>
                            <p id="news-paragraph-content"> {item.summary}</p>
                            <div style={{display:"flex", justifyContent:"space-between", gap:10}}>
                                <span> <ClockCircleOutlined/> {item.readTime}</span>
                                <span>{item.source}</span>
                            </div>
                        </div>
                    </div>
                ))}
                </Carousel>
                </div>
            </div>


            <div className="news-AI-content" style={{backgroundColor:"rgba(137,56,243,0.11)"}}>
                <h2> PolicyPulse AI</h2>
                <p>TO DEVELOP</p>
            </div>

        </div>
    )
}

function FeaturedCourses() {
    // const images = [img1,img2]
    const courses = [
        {
            imgUrl: img1,
            title: "ED&I in Clinical Research | LinkedIn",
            duration: 32,
            completion: 92,
            url: "https://www.linkedin.com/events/7259561190769528832/"},
        {imgUrl:img2, title:"Personal & Business Finances strategy",duration:34, completion:87, url:"https://www.linkedin.com/events/7259726875986464770/"},
        {imgUrl:img3, title:"Fertility at work with Sandra Lewin", duration:37, completion:95, url:"https://www.linkedin.com/events/7261406703819059200/"}
    ]
    //TODO: Changing the tags and making them unique
    return (
        <div className="home-sections">
            <div className="home-box-title">
                <h2> Featured Courses</h2>
                <Link to="/courses-list"
                style={{ display: 'flex', alignItems: 'center', justifySelf:"end", gap: '3px', textDecoration:"none", color: "var(--primary-color)" , fontSize:"14px", fontWeight:600}}>
                    <span> View All Courses </span>
                    <ArrowRightOutlined/>
                </Link>
            </div>

            {/* EACH COURSE CARD */}
            <div className="home-box-content">
                 {courses.map((item, index) => (
                     <div className="home-content-card"
                          key={index}
                          style={
                              {
                                  backgroundImage: `url(${item.imgUrl})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat',
                                  // position: "absolute",
                                  // zIndex:0
                              }}>
                         <div className="home-card-text">
                             <Tag color="blue" style={
                                 {
                                     padding: "2px 10px",
                                     fontSize: "11px",
                                     borderRadius: "7px"
                                 }}> Workplace Support</Tag>
                             <h4> {item.title}</h4>
                             <div className="home-card-completion-rate">
                                 <span> <ClockCircleOutlined/> {item.duration} mins</span>
                                 <span><TeamOutlined/> {item.completion}% completion</span>
                             </div>
                             <a href={item.url} target="_blank" rel="noopener norefferer"> Start Course </a>
                         </div>
                     </div>
                     )
                 )}
            </div>
        </div>
    )
}

function Highlights({handleExploreProgram}) {
    const cards = [
        {
            title: "Excellence Award Program",
            content: "Industry recognition for leadership in reproductive health and policy innovation.",
            badge: {
                icon: <FaAward/>,
                style: {
                    color: "#9233e8",
                    border: " 1px solid",
                    borderRadius: "5px",
                    background: "#f1e6fd",
                    fontSize: 18,
                    padding: "7px 10px"
                }
            }
        },
        {
            title: "Executive Conversations",
            content: "Strategic insights from C-suite leaders driving reproductive health initiatives.",
            badge: {
                icon: <TeamOutlined/>,
                style: {
                    color: "#2562e9",
                    border: " 1px solid",
                    borderRadius: "5px",
                    background: "#d9e8fc",
                    fontSize: 18,
                    padding: "7px 10px"
                }
            }

        },
        {
             title: "Medical Practice Insights",
            content: "Evidence-based clinical perspectives on reproductive healthcare delivery.",
            badge: {
                icon: <FaStethoscope/>,
                style: {
                    color: "#16a249",
                    border: " 1px solid",
                    borderRadius: "5px",
                    background: "#dafae5",
                    fontSize: 18,
                    padding: "7px 10px"
                }
            }
        }
    ]
    return (
        <div className="home-sections">
            <div className="home-box-title">
                <h2> Program Highlights</h2>
                <span style={{fontSize: 13, color: "gray", justifySelf:"end"}}> Popularity this month <RiseOutlined/> </span>
            </div>
            <div className="home-box-content">
                {cards.map((item,index) => (
                <div key={index} className="highlight-card" style={{
                    background: "#f7f8f9",
                    border: "1px solid #e3e5e9",
                    borderRadius: "5px",
                    padding: "10px 15px",
                    maxWidth:"18rem"
                    }}>
                    <div className="highlight-card-header" style={{
                        display: "flex",
                        alignItems: "center", gap: "5px", fontSize: "16px", fontWeight: "500"
                    }}>
                        <Tag icon={item.badge.icon} style={item.badge.style}/>
                        {item.title} </div>
                    <p style={{ fontSize:13, color:"#484855", padding:"10px 0"}}> {item.content}</p>
                    <p style= {{fontSize:13, fontWeight:500, color:"var(--primary-color)", cursor: "pointer"}}
                    onClick={handleExploreProgram} > Explore Program <ArrowRightOutlined/> </p> {/*I have to use To Navigate and useParam*/}
                </div>))}
            </div>
        </div>
    )

}

export default function Home() {
    const navigate = useNavigate();
    const handleProgramExplore= () => {
        navigate("/policy-writer") //TODO: Change it to point at each individual program
    }
    return (
        <div className="home-container">
        <Welcome/>
        <NewsAI/>
        <FeaturedCourses/>
        <Highlights handleExploreProgram={handleProgramExplore}/>
    </div>
  );
}


