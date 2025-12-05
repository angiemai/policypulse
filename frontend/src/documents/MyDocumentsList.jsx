import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Input, Space, Tag, message, Spin, Checkbox, Upload } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import './MyDocumentsList.css';

const { Search } = Input;
const { Dragger } = Upload;

export function MyDocumentsList() {
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  const BACKEND_API_URL = 'http://localhost:8000';

  const newDocsDir = "/Users/aimac/Documents/Coding/policypulse/PolicyPulseWebApp/backend/raw_files/new_docs";
  const customCollectionName = "custom_docs";

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_API_URL}/documents?collection_name=${customCollectionName}`);

      if (!response.ok) {
        throw new Error("Failed to fetch custom documents.");
      }
      const customData = await response.json();
      console.log(response.json())
      setUploadedDocuments(customData);
      
      message.success('Custom documents loaded successfully!');
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      message.error(`Failed to load documents: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUploadAndProcess = async () => {
    if (fileList.length === 0) {
      message.warning('Please select files to upload.');
      return;
    }
    
    setUploading(true);
    
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`${BACKEND_API_URL}/upload-and-process`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      message.success(result.message);
      
      setFileList([]); // Clear file list on success
      setIsUploadModalVisible(false); // Close modal
      fetchDocuments(); // Refresh the document list
    } catch (error) {
      console.error("Upload and processing failed:", error);
      message.error(`Upload and processing failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (docName, collectionName) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete "${docName}"? This action cannot be undone.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        setLoading(true);
        try {
          // The document_name is the filename without path.
          const response = await fetch(`${BACKEND_API_URL}/documents/${docName}?collection_name=${collectionName}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
          }
          message.success(`"${docName}" deleted successfully!`);
          fetchDocuments();
        } catch (error) {
          console.error("Failed to delete document:", error);
          message.error(`Failed to delete document: ${error.message}`);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleViewDocument = (doc) => {
    Modal.info({
      title: `Document Details: ${doc.name}`,
      content: (
        <div>
          <p><strong>Collection:</strong> {doc.collectionName}</p>
          <p><strong>Type:</strong> {doc.type}</p>
          <p><strong>Date:</strong> {doc.date}</p>
          <p><strong>Status:</strong> <Tag color={doc.status === 'Uploaded' ? 'orange' : 'default'}>{doc.status}</Tag></p>
          <p className="document-preview-text">
            {doc.preview || <em>Full document content would be displayed here after fetching from backend/MongoDB.</em>}
          </p>
        </div>
      ),
      width: 600,
      onOk() {},
    });
  };

  const renderDocumentRow = (item, collectionName) => (
    <tr key={item.id}>
      <td className="checkbox-col">
        <Checkbox />
      </td>
      <td>
        <a href="#" className="document-name-link" onClick={(e) => { e.preventDefault(); handleViewDocument({...item, collectionName}); }}>
          {item.name}
        </a>
      </td>
      <td>{item.date}</td>
      <td>
        <span className="last-edited-date">{item.date}</span>
      </td>
      <td>
        <span className={`status-tag ${item.status === 'Uploaded' ? 'not-implemented' : 'not-implemented'}`}>
          {item.status}
        </span>
      </td>
      <td className="actions-col">
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleViewDocument({...item, collectionName})}>View</Button>
          <Button 
            icon={<DeleteOutlined />} 
            size="small" 
            danger 
            onClick={() => handleDeleteDocument(item.name, collectionName)}
          >
            Delete
          </Button>
        </Space>
      </td>
    </tr>
  );
  
  const draggerProps = {
    name: 'file',
    multiple: true,
    fileList,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false; // Prevent default upload behavior
    },
    disabled: uploading,
  };

  return (
    <div className="page-container">
      <h1 className="page-title">My Documents</h1>
      <p className="page-subtitle">Organise your Documents here</p>

      <div className="documents-header-controls">
        <Search
          placeholder="Search documents..."
          allowClear
          onSearch={(value) => message.info(`Searching for: ${value}`)}
          style={{ width: 300 }}
          className="document-search-bar"
        />
        <Button 
          icon={<PlusOutlined />} 
          type="primary" 
          onClick={() => setIsUploadModalVisible(true)}
        >
          Process New Documents
        </Button>
      </div>

      <Spin spinning={loading}>
        <div className="documents-list-area">
          <Card className="document-category-card">
            <div className="category-header">
              <div>
                <h2 className="category-title">Your Uploaded Documents</h2>
                <p className="category-subtitle">Manage your custom documents</p>
              </div>
              <a href="#" className="see-more-link" onClick={(e) => e.preventDefault()}>See More</a>
            </div>
            <table className="document-table">
              <thead>
                <tr>
                  <th className="checkbox-col"></th>
                  <th>Document Name</th>
                  <th>First Uploaded</th>
                  <th>Last Edited</th>
                  <th>Implementation Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploadedDocuments.length > 0 ? (
                  uploadedDocuments.map(doc => renderDocumentRow(doc, customCollectionName))
                ) : (
                  <tr><td colSpan="6" className="empty-table-message">No custom documents uploaded yet.</td></tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </Spin>

      {/* Upload Modal with Dragger */}
      <Modal
        title="Upload Documents"
        visible={isUploadModalVisible}
        onCancel={() => { setIsUploadModalVisible(false); setFileList([]); }}
        footer={[
          <Button key="back" onClick={() => { setIsUploadModalVisible(false); setFileList([]); }}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={uploading}
            onClick={handleUploadAndProcess}
            disabled={fileList.length === 0}
          >
            {uploading ? 'Uploading...' : `Upload All (${fileList.length})`}
          </Button>,
        ]}
      >
        <p>Drag and drop your documents here. They will be uploaded and automatically processed.</p>
        <p>All files will be saved to the **`{newDocsDir}`** directory before being processed into the **`{customCollectionName}`** collection.</p>
        <Dragger {...draggerProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
            band files.
          </p>
        </Dragger>
      </Modal>
    </div>
  );
}
