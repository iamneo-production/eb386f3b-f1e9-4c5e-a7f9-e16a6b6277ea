import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadContainer = styled('div')({
  border: '2px dashed #ccc',
  padding: '30px',
  textAlign: 'center',
  cursor: 'pointer',
});

const CombinedFileUpload = ({ onFilesSelected }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files); console.log(files)
    onFilesSelected(files);
  };

  return (
    <UploadContainer
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-input"
        style={{ display: 'none' }}
        multiple
        onChange={handleFileInputChange}
      />
      <label htmlFor="file-input">
        <CloudUploadIcon style={{ cursor: 'pointer' }} fontSize="large" />
        <p>Drag and drop files here or click to select files</p>
        {isDragActive && <p>Release to drop files</p>}
      </label>
    </UploadContainer>
  );
};

export default CombinedFileUpload;
