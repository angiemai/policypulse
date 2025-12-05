import {Select} from "antd";
import React from "react";
import ReactPlayer from 'react-player'

import {useState} from "react";
import {
    StarOutlined, StarFilled, SyncOutlined, CheckOutlined, CloseOutlined, ClockCircleOutlined, TeamOutlined
} from '@ant-design/icons';
import {Tag} from 'antd';
import "./BasicComponents.css"
import "../home/Home.css"

export function OrderingList({data, onSort}){
  const handleSort = (value) => {
    let sortedData = [...data]; // copy to avoid mutating props

    switch (value) {
        case "name-asc":
        sortedData.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        sortedData.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "date-new":
        sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));//if positive, "b" comes before "a"
        break;
      case "date-old":
        sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      default: break;
    }
    onSort(sortedData)
  };

  return (
    <Select defaultValue="name-asc" style={{ height: 39 }} onChange={handleSort}>
      <Select.Option value="name-asc">Name (A–Z)</Select.Option>
      <Select.Option value="name-desc">Name (Z–A)</Select.Option>
      <Select.Option value="date-new">Date (Newest)</Select.Option>
      <Select.Option value="date-old">Date (Oldest)</Select.Option>
    </Select>
  );
}

export function OrderingCategoryList({data, onFilter, category}){
    const handleFilter = (value) => {
        if (value=== "all") {
            onFilter(data)
        }else{
        const filteredData =data.filter (item => item.category === value)
            onFilter(filteredData)
        }}

    return(
        <Select defaultValue="all" style={{height:39}} onChange={handleFilter}>
            <Select.Option value="all">All Categories </Select.Option>
            {category.map (item => (
                <Select.Option value={item.value} >{item.label} </Select.Option>
            ))}
        </Select>
    );
}

export function VideoCard({images}){
    const [video,setVideo] = useState(null)
    const [star, setStar] = useState(false)
    const handleStarClick=(e)=> {
        e.stopPropagation()
        setStar(!star)
    }

    const getStatusIcon = (status) => {
  switch (status) {
    case "Completed":
      return <CheckOutlined className="tick-cross" />;
    case "In progress":
      return <SyncOutlined className="costume-spin"  />;
    case "Not started":
      return <CloseOutlined className="tick-cross" />;
    default:
      return null;
  }
};
    return(
        <div  style={{display:"flex", flexWrap:"wrap", gap:30, justifyContent:"center"}} >
            {images.map((item,index) =>(
                <div className="video-card-image" key={index} onClick={() => setVideo(item.video)} style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundImage: `url(${item.source})`,
                    margin: "0px 10px",
                    backgroundSize: "cover",
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderRadius:10,
                    minWidth: "15rem",
                    minHeight: "13rem",
                    maxWidth: "25rem"
                }}
                >
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <Tag style={{display:"flex", alignItems:"center", justifyContent:"center", margin:6, fontSize:10, gap:4}}
                            color={item.completionStatus === "Completed" ? "blue" : item.completionStatus === "Not started" ? "red" : "gold"}>{getStatusIcon(item.completionStatus)} {item.completionStatus}</Tag>
                        <span onClick={handleStarClick} style={{alignSelf: "flex-end", padding: 5}}>
                            {star ? (<StarFilled style={{color: "gold"}}/>) : (
                                <StarOutlined style={{color: "gold"}}/>)}</span>
                    </div>


                    <div style={{
                        display: "flex",
                        backgroundColor: "#fffdff",
                        flexDirection:"column",
                        padding: 10,
                        marginTop: "auto",
                        borderRadius: "8px 8px 8px 8px"
                        // justifyContent: "center"
                    }}>
                        <h4 style={{overflowWrap:"break-word"}}>{item.title}</h4>
                        <div className="home-card-completion-rate" style={{fontSize:13,}}>
                            <span> <ClockCircleOutlined/> {item.duration} mins</span>
                            <span><TeamOutlined/> {item.completion}% completion</span>
                        </div>

                    </div>
                </div>
            ))}

            {video &&
                <div style={{
                    backgroundColor: "rgba(0,0,0,0.84)",
                    width: "100vw",
                    height: "110vh",
                    position: "fixed", top:0, left:0, display:"flex", alignItems:"center",justifyContent:"center"}}
                onClick={()=>setVideo(null)}>
                <div style={{ zIndex:10, width:"40%"}}>
                    <ReactPlayer src={video} width="100%" height="22rem" pip={true} />
                </div>
                </div>}
        </div>

    )

}
