import '@/styles/globals.css'
import { useState } from 'react';

import Layout from '@/components/layout'
import UploadModal from '@/components/uploadModal'
import axios from 'axios';

export default function App({ Component, pageProps }) {
  const [isModalOpen, setIsModalOpen] = useState(false); 
   const [uploadProgress, setUploadProgress] = useState(0);
   const [file, setFile] = useState(null);
   const [uploadComplete, setUploadComplete] = useState(false);


   const serverUrl = process.env.SERVER_URL;

  
  const handleUpload = (file) => {
    const data = new FormData();
    data.append('file', file);
    // Replace 'your-upload-url' with the URL you use to upload files
    axios.post( `${serverUrl}/upload`, data, {
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      }
    }).then(response => {
      // Handle the response from the server
     

    }).catch(error => {
      // Handle any errors
    });
  };
  
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (

    
    <>
    <Layout toggleModal={toggleModal}>
      <Component {...pageProps} />
    </Layout>
    <UploadModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        onUpload={handleUpload}
        uploadProgress={uploadProgress}
        />

        
    </>
  )
}
