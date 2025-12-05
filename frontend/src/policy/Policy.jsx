import React, {useState} from 'react';
import {useUser } from "@clerk/clerk-react"
import { Checkbox, Tag, Radio } from 'antd';
import {  Menu } from 'antd';

export default function PoliciesManager(){
   const {user} = useUser()
return (
    <div className="page-container">
        {/* HEADER*/}
        <div className="page-header">
            <h1> Hello, {user.firstName}!</h1>
            <h2 style={{padding: "15px 0"}}> My Policies</h2>
            <p style={{paddingBottom:10}}> Policies Awaiting Sign Off</p>
        </div>
        <div>
         <Radio.Group
             block
             defaultValue={1}
             buttonStyle="solid"
             optionType="button"
    options={[
      { value: 1, label: 'A' },
      { value: 2, label: 'B' },
      { value: 3, label: 'C' },
    ]}
  />
        </div>
        <SignOffCard/>

    </div>
)
}

function SignOffCard() {
    const [selectedOptons, setSelectedOptions] = useState([])
    const options = [
        {
            id: "#876364",
            user: "Arorra Gaur",
            topic: "Topic 1",
            date: "12 Dec, 2020",
            status: "Signed Off"
        },
        {
            id: "#876123",
            user: "James Mullican",
            topic: "Topic 1",
            date: "10 Dec, 2020",
            status: "Pending"
        },
        {
            id: "#876213",
            user: "Robert Bacins",
            topic: "Topic 2",
            date: "09 Dec, 2020",
            status: "Signed Off"
  },
  {
    id: "#876987",
    user: "Bethany Jackson",
    topic: "Topic 1",
    date: "09 Dec, 2020",
    status: "Review"
  },
  {
    id: "#871345",
    user: "Anne Jacob",
    topic: "Topic 3",
    date: "10 Dec, 2020",
    status: "Signed Off"
  },
  {
    id: "#872345",
    user: "Bethany Jackson",
    topic: "Topic 1",
    date: "10 Dec, 2020",
    status: "Pending"
  },
  {
    id: "#872346",
    user: "James Mullican",
    topic: "Topic 3",
    date: "10 Dec, 2020",
    status: "Signed Off"
  },
  {
    id: "#873245",
    user: "Jhon Deo",
    topic: "Topic 2",
    date: "08 Dec, 2020",
    status: "Signed Off"
  },
  {
    id: "#876369",
    user: "Bethany Jackson",
    topic: "Topic 4",
    date: "02 Dec, 2020",
    status: "Review"
  }
];

    return (
        <div style={{width: "100%"}}>
            <Checkbox.Group value={selectedOptons} onChange={(item) => setSelectedOptions(item)}
                            style={{display: "flex", flexDirection: "column", gap: 20, paddingTop: 10, width: "100%"}}>
                {options.map((item) => (
                    <div style={{ display:"flex", height: "2.8rem",
                        background: "#fff",
                        borderRadius: 8,
                        alignItems: "center",
                        fontSize: 14,
                        gap:20,
                        fontWeight: 500,
                        padding: "0 30px",}}>
                    <Checkbox value={item.id}/>
                    <div style={{display:"flex", justifyContent:"space-between", width:"100%"}} >
                <span style={{flex: 1}}>{item.id}</span>
                <span style={{flex: 1}}>{item.user}</span>
                <span style={{flex: 1}}>{item.topic}</span>
                <span style={{flex: 1}}>{item.date}</span>
                     <Tag
  color={
    item.status === "Signed Off"
      ? "green"
      : item.status === "Pending"
      ? "blue"
      : "red"
  }
>
  {item.status}
</Tag>

        </div>
                    </div>
    )
)}
</Checkbox.Group>
</div>
)
}