import {useNavigate} from "react-router-dom";
import React,{useState, useEffect} from "react";
import { CiMicrochip } from "react-icons/ci";
import { LuBookOpenCheck } from "react-icons/lu";
import { FaHandshake } from "react-icons/fa";
import { RiseOutlined} from '@ant-design/icons';
import { BsCurrencyDollar } from "react-icons/bs";
import { Slider, Progress, Tag } from "antd";
import { RiRobot2Line } from "react-icons/ri";
import {getRoundNumber} from "antd/es/color-picker/util.js";
import img1 from "./Img/image_1.jpg"
import img2 from "./Img/image_2.jpg"
import img3 from "./Img/image_3.jpg"


// import img1 from "/Img/policy-writing-illustration.jpg"
export default function LandingPage() {
    const navigate = useNavigate()
    const landingCard= [
        {icon:<CiMicrochip color="#a1ffd3" fontSize="22px"/>, title: "Policy Pulse AI helper Agent", content:"Instant, confidential support and policy guidance available 24/7 for your employees."},
        {icon:<LuBookOpenCheck color="#ffa1d3" fontSize="18px"/>, title:"Online Courses & Webinars", content:"Comprehensive e-learning modules to build awareness and understanding across your organisation."},
        {icon:<FaHandshake color="#a1ffd3" fontSize="18px"/>, title:"In-Person Delivery", content: "Engaging workshops and training sessions delivered by expert facilitators"}
    ]

    // FOR THE IMAGES ON THE FIRST SECTION
    const images = [img1, img2, img3]
    const [slide,setSlide]= useState(0)
    useEffect(()=> {
        const interval= setInterval(()=> {
            setSlide((prev)=> (prev+1)%3)
        }, 4000)

        return () => clearInterval(interval)

    },[])

    const user_comments =[
        {profilePicture: img1, name: "Iain MacLeod", profession:"DE&I Consultant | Inclusion Ambassador", isVerified: false,
            content:"This is wonderful news Fari, and highly deserved. Your work is incredibly important, and your approach is just right. Congratulations."},
        {profilePicture: img1, name:"Nikki Varney", profession:"Founder, Smart Perks Plus", isVerified:false,
            content: "Thank you so much for yesterday's information, engaging event on a really difficult, emotional subject. I hope you find lots of much deserved new confident about having conversations with " +
                "their managers and clients about the issue. All fertile conversations with me."},
        {profilePicture: img1, name: "Well Wisher", profession: "Business Development Consultant", isVerified: false,
            content: "While employees and staff are increasingly engaged in discussions around mental health, an equally critical yet often overlooked area is reproductive and fertility health in the workplace. " +
                "This issue relevant to both men and women, and is a frontier that we also need to harness and nurture. I highly recommend these events as not only are they an opportunity to discuss more in depth " +
                "matters often neglected, but also a tool that empowers us as people and as a company."}
    ]

    const [sliderValue, setSliderValue]= useState(1)
    return (
        <div className="autentication-page" >
            <NavBar navigate={navigate}/>

            {/*  SECTION 1  */}
            <div className="section-1">

                <div style={{display: "flex", flexDirection: "column", gap: 30, paddingTop: "4em", maxWidth: 550}}>
                    <span style={{
                        display:"flex", flexWrap:"wrap",
                        fontSize:"3.2em", fontWeight: 700,
                        whiteSpace:"pre", //To preserve the white spaces
                        background: 'linear-gradient(to right, #6b21a8, #4f46e5)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        }}>POLICY <span style= {{display:"flex", alignItems:"flex-start"}}>PULSE <p style={{fontSize:"0.2em"}}>TM</p></span>
                    </span>
                    <p style={{fontWeight: 500, fontSize: "1em"}}>The discreet, legally compliant employee reproductive care toolkit for busy managers of high performing teams.</p>
                    <button style={{fontSize:"1.6em"}} onClick={() => navigate("/sign-up")}> Get Started</button>
                </div>

                <div>
                    <img src={images[slide]} alt="none"/>
                </div>
            </div>

                {/*  SECTION 2  */}
            <>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center", padding:"60px 30px 15px 30px", gap:7}}>
                    <h2> 45 Female Conditions, 27 Male Conditions, All Supported</h2>
                    <p className="medium-p"> Comprehensive solutions tailored to your organisation's needs </p>
                </div>

                <div className="card-list" >
                    {landingCard.map ((item,index) => (
                    <div key={index} className="landing-page-card" >
                        <div style={{
                            backgroundImage: `url(${img1})`,
                            backgroundSize: "cover",
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            width:"100%", height:"9rem",
                            borderRadius:15
                        }}/>
                        <span style={{display:"flex", alignItems:"center", gap:6, padding:7, fontWeight:600}}> {item.icon} {item.title}</span>
                        <p className="medium-p" style={{padding:"0px 7px 20px 14px"}}> {item.content} </p>
                    </div>))}
                </div>
            </>

            <div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}>

                {/*  SECTION 3  */}
            <div className="section-3" >
                    <div className="slip-ups" style={{display:"flex",flexDirection:"column", gap:10,}}>
                        <h3> Slip-ups can cost £350k per case</h3>
                        <p className="medium-p"> Unaddressed reproductive health issues cost UK businesses billions annually. Supporting your employees isn't just the right thing to do – <strong> <i>it's a smart financial decision</i></strong>.</p>
                        <p className="small-p"> Use our calculator to see the potential financial impact Pulse Pulse could have on your organisation</p>
                    </div>

                    <div className="demo-calculator" style={{minWidth:"14.3rem", backgroundColor:"white", border:"1px solid #C156E8C7", borderRadius:10, padding:10}}>
                        <h5> <RiseOutlined/> Calculate Your Potential ROI </h5>
                        <div style={{display:"flex", justifyContent:"space-between", paddingTop:15}}>
                            <h6> Number of Employees</h6>
                            <span className="small-p"> {sliderValue}</span>
                        </div>
                        <Slider tooltip={{ formatter: null }} min={1} max={10000} value={sliderValue} onChange={(newValue) => {setSliderValue(newValue)}}/>
                        <h6> Average Annual Salary (£)</h6>
                        <div style={{ width:"100%", height:20, border:"gray 1px solid", borderRadius:3, fontSize:10, alignItems:"center", display:"flex", gap:7, margin:"5px 0"}}> <BsCurrencyDollar/> 100 000</div>
                        <div style={{display: "flex", flexDirection: "column", textAlign:"center", padding:"12px 5px",margin:"7px 0", background:"linear-gradient(to right,#CE97EA52,#97BBEA3C", borderRadius:5}}>
                            <h6 > Potential Annual Productivity Gain </h6>
                            <span style={{
                                background: 'linear-gradient(to right, #6b21a8, #4f46e5)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}> £ {getRoundNumber(sliderValue*100000*0.07).toLocaleString()} </span>
                            <p style={{fontSize:8}} >*Estimated based on industry benchmarks for productivity loss due to unaddressed reproductive (menopause) issues. </p>
                        </div>
                    </div>

            </div>

            <Opinion comments={user_comments}/>
            </div>
            <Footer/>
        </div>
)
}

function NavBar({
    navigate
}) {
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            zIndex: 1,
            position: "fixed",
            backgroundColor:"white",
            padding:"10px 30px",
            width:"100%",
            fontSize:"13px",
            gap:10
        }}>
            <h2> We are eden </h2>
            <div style={{display: "flex", gap: 20}}>
                <p> ROI</p>
                <p>Testimonials</p>
                <p> Solutions</p>
                <p> About</p>
            </div>
            <button style={{fontSize: "1em"}} onClick={() => navigate("/log-in")}> Log In</button>
        </div>
    )
}

function Opinion({comments}){

    const getBorderColor = (index) => {
        return index % 2 === 0 ?
            {border: "1px solid #6BF4BBFF", borderLeft: "3px solid #6BF4BBFF"} : {
                border: "1px solid #9340CAFF",
                borderLeft: "3px solid #9340CAFF"
            }
    }

    return(
        <div className="section-4" >

            {/*  SECTION A  */}
            <div style={{display:"flex", flexDirection:"column",gap:15}}>
                <h5>Trusted by Leading Organisation</h5>
                <div style={{display:"flex",flex:"1", gap:10}}>
                    <div style={{
                        flex:1,
                        display: "flex",
                        borderRadius: 5,
                        background: 'linear-gradient(to right, #DCFAFC93, #BFF8EAC2)',
                        padding: 12, gap:5,
                        alignItems: "center",
                        border: "1px solid #BFF6F8FF",
                        color: "#0e8c7e", maxWidth:"12rem"
                    }}>
                        <Tag color="#14B7A5FF" style={{
                            width: 30,
                            height: 30,
                            borderRadius: 20,
                            display: "flex",
                            alignItems: "center",
                            color: "white",
                            justifyContent: "center",
                            fontSize: 20
                        }}> <RiseOutlined/> </Tag>
                        <div>
                            <h4>98%</h4>
                            <p className="small-p"> Employee Satisfaction</p>
                        </div>
                    </div>
                    <div style={{
                        flex:1,
                        display: "flex",
                        borderRadius: 5,
                        background: 'linear-gradient(to right, #A653F347, #A653F39B)',
                        padding: "12px 20px",
                        alignItems: "center",
                        border: "1px solid #A653F391",
                        color: "#8b41cc", maxWidth:"12rem"
                    }}>
                        <Tag color="#A754F5FF" style={{
                            width: 30,
                            height: 30,
                            borderRadius: 20,
                            display: "flex",
                            alignItems: "center",
                            color: "white",
                            justifyContent: "center",
                            fontSize: 20
                        }}> <RiseOutlined/> </Tag>
                        <div>
                            <h4> 4.9/5</h4>
                            <p className="small-p"> Platform Rating</p>
                        </div>
                    </div>
                </div>

                {/*  SECTION B  */}
                <div style={{display: "flex",flexDirection:"column",gap:4, border: "1px solid #ccc", borderRadius: 3, fontSize:11, padding:"10px 13px", maxWidth:"24.6rem"}}>
                    <h4> User Satisfaction Over Time</h4>
                    <div style={{display:"grid",grid:"1fr 1fr 1fr/1fr 1fr",gridRowGap:5, paddingTop:10}} >
                        <p> Overall Experience </p>  <b><Progress percent={98} size="small"/></b>
                        <p> User-friendliness </p> <b><Progress percent={96} strokeColor="#CB9EF7FF" size="small"/></b>
                        <p> Customer service quality </p> <b><Progress percent={99} strokeColor="#6BF4BBE8"  size="small"/></b>
                    </div>
                </div>
            </div>

            {/*  SECTION A  */}
            <div>
                <h5>User Experience</h5>
                <div style={{display:"flex", flexDirection:"column", overflow:"auto", marginTop:15, gap:10, maxHeight:"15rem"}}>
                    {/*  Comment Card */}
                    {comments.map((item,index) => (
                    <div key={index} style={{...getBorderColor(index), borderRadius: 5, padding: "10px 14px"}}>
                        <div style={{display: "flex", alignItems: "center", gap: 10}}>
                            <span style={{display: "flex", flex:"none", width: 30, height:30, borderRadius: 15, overflow: "hidden"}}>
                                <img src={item.profilePicture} alt="User profile picture"/>
                            </span>
                            <div style={{fontSize: 10}}>
                                <b> {item.name}</b>
                                <p> {item.profession}</p>
                            </div>
                        </div>
                        <p style={{fontSize: 11, lineHeight: 1.5, paddingTop: 7}}><i> {item.content}</i></p>
                    </div>))}
                </div>
            </div>

        </div>
    )
}

function Footer(){
    return(
        <div style={{background: "linear-gradient(to right, #40CAAAFF, #40A1CAFF)",display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:30, color:"#FFFFFFF2", gap:15}}>
            <Tag color="#FFFFFFB8" style={{backgroundColor:"#FFFFFF3D", borderRadius:10, fontFamily:"inherit", padding:"2px 10px"}}> Limited Time Offer</Tag>
            <h2> EXCLUSIVE FREE TRIAL</h2>
            <p className="small-p"> A special offer for SMEs and Corporate Managers to empower your team!</p>
            <div style={{display: "flex", gap: 10, fontSize: 12}}>
                <a href="https://policy-pulse.uk-ba.net/" target="_blank" rel="noopener norefferer" className="footer-link-btn"
                   style={{color: "#3FC7A9FF"}}>
                    <RiRobot2Line/> Try the AI agent</a>

                <a href="https://we-are-eden.thinkific.com/products/courses/ai-placeholder" target="_blank" rel="noopener norefferer" className="footer-link-btn"
                   style={{color:"var(--primary-color)"}}>
                    <LuBookOpenCheck/> Explore Online Courses</a>
            </div>
        </div>
    )
}