import React from 'react';
import {useState} from "react"
import {Input, Select} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {OrderingList, OrderingCategoryList, VideoCard} from "../components/BasicComponents.jsx"
import "./CoursesList.css"
import img1 from "../auth/Img/image_2.jpg";
export default function CoursesList(){
     const initialImages =[
        {source: img1, video:"https://www.youtube.com/watch?v=ca3D2AjZ3wg", category:"mod-1", title: "\n" +
                "Module 1 lesson 3 Legal must haves for Reproductive & Fertility Health at Work", duration:"12:47", completionStatus:"Completed", completion:10},
        {source: img1, video: "https://www.youtube.com/watch?v=yRIufeayjQY", category:"mod-1", title: "Understanding Reproductive and Fertility Health at Work", duration:"9:41", completionStatus:"In progress", completion:10},
    ]
    const categories = [{value: "mod-1", label: "Module 1"}, {value:"mod-2", label: "Module 2"}]

    const [sortedImages, setSortedImages] = useState(initialImages);
    const handleSearch=(e)=> {
        const searchTerm = e.target.value
        if (searchTerm.trim() === "") {
            setSortedImages(initialImages)
        }
        else {
            const filtered = initialImages.filter(image => image.title.toLowerCase().includes(searchTerm.toLowerCase()));
            setSortedImages(filtered);
        }
    }

    return (
        <div className="page-container" >
            <div className="page-header">
                <h1> Course List</h1>
                <p> Expand your knowledge in reproductive health and workplace policies.</p>
            </div>

            <div >
                <div id="filter-container" > {/*TODO: make it STICK!*/}
                       <Input
                        placeholder="Search courses..."
                        prefix={<SearchOutlined/>}
                        size="large"
                        onPressEnter={handleSearch}
                    />

                    <div>
                    <OrderingList data={sortedImages} onSort={setSortedImages}/>
                    <OrderingCategoryList data={initialImages} onFilter={setSortedImages} category={categories}/>
                    </div>
                </div>
                {sortedImages.length > 0?
                <VideoCard images={sortedImages}/> : <div style={{backgroundColor:"#C5DDE6D8",border:"2px solid", borderColor:"#3B4357FF", borderRadius:10, margin: "auto 2rem", minHeight:"7rem", justifyContent:"center", display:"flex", alignItems:"center"}}> NO COURSES</div>}
            </div>
        </div>
    )
}