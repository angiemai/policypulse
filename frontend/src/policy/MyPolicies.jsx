// src/policy/MyPolicies.jsx

import React, {useEffect, useState} from 'react';
import {Button, Tag, Card, Dropdown, Menu} from 'antd';
import {EyeOutlined, EditOutlined, PlusOutlined, CopyOutlined, DeleteOutlined, DownloadOutlined, InboxOutlined} from '@ant-design/icons'; // Import PlusOutlined icon
import {useNavigate} from 'react-router-dom';
import './MyPolicies.css'; // Import styles for this component
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useQuery} from '@tanstack/react-query';
import {Download} from "lucide-react";

export function MyPolicies() {
  const navigate = useNavigate();

  //  Context menu items (AntD Dropdown expects menu={{ items }}, not <Menu />)
  const items = [
    { label: "Copy", key: "copy", icon: <CopyOutlined />},
    { label: "Rename", key: "rename", icon: <EditOutlined />},
    { label: "Export", key: "export", icon: <DownloadOutlined />},
    { label: "Archive", key: "archive", icon: <InboxOutlined />},
    { label: "Delete", key: "delete", danger: true, icon: <DeleteOutlined/>},
  ]
  const menuProps= {
  items,
  onClick: ()=>console.log({items}),
};

  //  Mock data for fallback
  const mockPolicies = [
    {
      id: 1,
      name: "UK Maternity and Reproductive Health Policy Framework",
      status: "Active",
      version: "1.0",
      lastUpdated: "2023-03-15",
    },
    {
      id: 2,
      name: "Global Data Privacy Policy",
      status: "Draft",
      version: "0.8",
      lastUpdated: "2023-07-01",
    },
    {
      id: 3,
      name: "Employee Code of Conduct",
      status: "Archived",
      version: "2.1",
      lastUpdated: "2022-11-20",
    },
    {
      id: 4,
      name: "Cybersecurity Incident Response Plan",
      status: "Active",
      version: "1.2",
      lastUpdated: "2024-01-10",
    },
  ];

  //  Data fetching with React Query
  const { data: policies = [], status } = useQuery({
    queryKey: ["list_documents"],
    staleTime: 1000,
    queryFn: async () => {
      const response = await fetch("http://16.171.14.0:8000/my-saved-policies");   // http://127.0.0.1:8000/my-saved-policies");
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    onSuccess: (data) => console.log("Fetched policies:", data),
    onError: (error) => console.error("Query error:", error),
  });

  //  Navigation handlers
  const handleEditPolicy = (id) => navigate(`/policy-writer/${id}`);
  const handleCreateNewPolicy = () => navigate("/policy-writer");

  //  Choose between fetched or mock data
  const displayPolicies = status === "success" ? policies : mockPolicies;

  //  Loading state
  if (status === "loading") return <p>Fetching data...</p>;

  return (
    <div className="page-container">
      {/* Header Section */}
      <div
        className="policy-actions-top"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 className="page-title">My Policies</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateNewPolicy}
          className="create-policy-button"
        >
          Create New Policy
        </Button>
      </div>

      {/* Policy List */}
      <div className="policy-list">
        {displayPolicies.length === 0 ? (
          <p>No policies found.</p>
        ) : (
          displayPolicies.map((policy) => (
            <Dropdown
              key={policy._id || policy.id}
              trigger={["contextMenu"]}
              menu={menuProps}
            >
              <Card className="policy-card" variant="borderless" style={{backgroundColor:"white"}}>
                <div className="policy-card-content">
                  <h3 className="policy-name">{policy.name}</h3>
                  <div className="policy-details">
                    <p>
                      Status:{" "}
                      <Tag
                        color={
                          policy.status === "Active"
                            ? "green"
                            : policy.status === "Draft"
                            ? "blue"
                            : "default"
                        }
                      >
                        {policy.status}
                      </Tag>
                    </p>
                    <p>Version: {policy.version}</p>
                    <p>
                      Last Updated:{" "}
                      {policy.lastUpdated || policy.LastUpdatedAt}
                    </p>
                  </div>
                </div>

                <div className="policy-actions">
                  <Button icon={<EyeOutlined />} className="action-button">
                    View
                  </Button>
                  <Button
                    icon={<EditOutlined />}
                    className="action-button"
                    onClick={() => handleEditPolicy(policy._id || policy.id)}
                  >
                    Edit
                  </Button>
                </div>
              </Card>
            </Dropdown>
          ))
        )}
      </div>
    </div>
  );
}
