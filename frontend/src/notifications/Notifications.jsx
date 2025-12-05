import React from 'react';
import "./Notifications.css"
import {Input, Select, Tag} from 'antd';
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import {useQuery} from "@tanstack/react-query";
import {OrderingList} from "../components/BasicComponents.jsx"

export default function Notifications() {
    // const [search,setSearch] = useState ("Search notifications...")
    const { Option } = Select; // Child component of Select. It represents a single dropdown item
    const loadMsg = async ()=> {
        const res = await fetch("http://127.0.0.1:8000/notifications")
        if (!res.ok) throw new Error ("Response was not okay")
        return res.json()
    }
    // const msg = loadMsg()
    const {data: msg, isLoading,isPending, isError} = useQuery({
        queryKey:["list-notification"],
        queryFn: loadMsg,
        onSuccess(data)
        {console.log(data)}
    })
    console.log(typeof msg)
    console.log(msg)
    if (isLoading || isPending) {
  return <p>Loading notifications...</p>;
}

    //COLOR-CODING THE NOTIFICATIONS FROM THE INBOX
    const getMessageColor = (category) => {
        const msgImportance= {
            sysUpdate:     { backgroundColor: "#eefbf2"},
            Courses:  { backgroundColor: "#edf4fd"},
            WeeklySummary:   {backgroundColor: "#fcfae6"},
            CompanyTasks: { backgroundColor: "#ccfbf1" },
            ActionRequired:     {backgroundColor: "#fcf0f0"},
            None: { color: "#f3e6fc"}
        };
    return msgImportance[category] || msgImportance.None; //if the category does not exist, it will return the color of policy tag
  };

     // const handleDelete = (msg) => {
     //        msg.update({isDeleted:true})
     //    }

    // async function handleUpdate(itemToGo) {
    //     const res= await fetch('http://127.0.0.1:8000/notifications', {
    //         method: "POST",
    //         headers: {
    //                 "Content-type": "application/json",
    //             },
    //         body: JSON.stringify(itemToGo),
    //     })
    //     console.log(res)
    //
    // }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1> Notifications</h1>
                <p> Stay up to date with the latest announcements and updates.</p>
            </div>

            {/* The item search and ordering list*/}
            <div style={{display: "flex", margin:"30px 0", alignItems:"center", justifyContent:"space-between", gap:15}}>
                <Input
                placeholder="Search notifications..."
                prefix={<SearchOutlined/>}
                size="large"
                onPressEnter={(e) => console.log('Enter pressed:', e.target.value)}
                // style={{maxWidth: 500}}
                />

                <OrderingList/>
            </div>

            {/* Inbox notification*/}
            <div>
                <h3> Inbox </h3>
                {msg.map((item,index) => (
                    <div key={index} style={{
                        ...getMessageColor(item.category),
                        display: "flex", justifyContent:"space-between", padding: "20px 5px", margin: "20px 0", borderRadius: 5
                    }}>

                        <div style={{display: "flex", flexDirection: "column", gap: 6, paddingLeft:15}}>
                            <h4> {item.title}</h4>
                            <p style={{fontSize: 14, color: "#4a5462"}}> {item.content}</p>
                            <p style={{fontSize: 14, color: "#9ba2ae"}}> {item.time}</p>
                        </div>
                        <button className="delete-btn" > X</button>
                    </div>))}

            </div>
        </div>
    )
}
