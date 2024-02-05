import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { ChangeEvent, useState } from 'react';
import axios from 'axios';


export default function Home() {
  const [videoList, setVideoList] = useState<string>("");
  const [nextBtnPage, setNextBtnPage] = useState<number>(1)
  const [prevBtnPage, setPrevBtnPage] = useState<number>(1)
  const [nextBtnDisable, setNexBtnDisable] = useState<boolean>(true)
  const [prevBtnDisable, setPrevBtnDisable] = useState<boolean>(true)
  const [uploadBtnDisable, setUploadBtnDisable] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>("")
  const [file, setFile] = useState<File>();

  const serverUrl = 'https://hstvserver.azurewebsites.net'

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const findPaginationValues = (pagination: any) => {
    // this function is created in order to get the different JSON responses that are
    // generated by the backend, for example, from the Python backend the field of total pages
    // will come as total_pages, however in Node.js the field will be called totalPages 
    const paginationKeys = Object.keys(pagination);
    const pagesTotalKey = paginationKeys.find(value => /page(.*)total/i.test(value))
    const currentPageKey = paginationKeys.find(value => /current(.*)page/i.test(value))
    return {pagesTotalKey, currentPageKey}
  }

  const generateNextButton = (pagination: any, paginationKeyValues: any) => {
    if(pagination[paginationKeyValues.currentPageKey] < pagination[paginationKeyValues.pagesTotalKey]) {
      setNextBtnPage(pagination[paginationKeyValues.currentPageKey] +1)
    }
    if ( pagination[paginationKeyValues.currentPageKey] === pagination[paginationKeyValues.pagesTotalKey]) {
      setNexBtnDisable(true)
    } else {
      setNexBtnDisable(false)
    }
  }

  const generatePrevButton = (pagination: any, paginationKeyValues: any) => {
    if(pagination[paginationKeyValues.currentPageKey] <= pagination[paginationKeyValues.pagesTotalKey] && pagination[paginationKeyValues.currentPageKey] > 1 ) {
      setPrevBtnPage(pagination[paginationKeyValues.currentPageKey] -1)
    }
    if ( pagination[paginationKeyValues.currentPageKey] === 1) {
      setPrevBtnDisable(true)
    } else {
      setPrevBtnDisable(false)
    }
  }

  const checkUploadStatus = async (videoId: string) : Promise<any> => {
    return new Promise((resolve, reject) => {
      return axios.post(`${serverUrl}/uploadStatus`, {videoId: videoId}).then( res => {
        setTimeout(() => {resolve(res.data)}, 200)
      })
    })
  }

  const ListVideoPage = (page: number) => {
    axios.post(`${serverUrl}/videos`, {page: page}).then(res => {
      const videoListArray = res.data.data;
      const paginationKeys = findPaginationValues(res.data.pagination)
      generateNextButton(res.data.pagination, paginationKeys)
      generatePrevButton(res.data.pagination, paginationKeys)
      const StrigifiedVideoList = videoListArray.map( (element: any) => {
        return `<div style="width: 33%; float: left">
        <h5>${element.title}</h5><a href=${element.assets.player}><img height="100" width="100" src=${element.assets.thumbnail}></div>`})
      setVideoList(StrigifiedVideoList);
    })
  }

  const handleUploadClick = () => {
    if (!file) {
      return;
    }
    const data = new FormData();
    data.append('file', file)
    setUploadBtnDisable(true)
    setUploadStatus("Uploading...")
    axios.post(`${serverUrl}/upload`, data).then( async res => {
      let playableStatus;
      const uploadVideoId = res.data
      for(let failSafe = 0; failSafe < 30; failSafe++) {
        const uploadStatus = await checkUploadStatus(uploadVideoId)
        playableStatus = uploadStatus.encoding.playable
        if(playableStatus === true) {
          failSafe = 30
          setUploadStatus("Upload successful")
          setUploadBtnDisable(false)
        }
      }
    })
  }
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main >
      <div  className={styles.container}>
      <label className={styles.h1}>Select file to upload:</label>
      <div>Select a video file up to 200MB in size to upload</div>
      <br></br>
      <input  type="file" id="fileupload" onChange={handleFileChange} />
      <div  > {file && `${file.name} - ${file.type}`}</div>
      <button className={styles.block} disabled={uploadBtnDisable} onClick={handleUploadClick}>Upload</button>
      <div className={styles.blockStatic}>Upload Status: {uploadStatus}</div>
      </div>
      <div className={styles.rounded}></div>
      <div className={styles.container}>
        <label className={styles.h1}>Show the list of uploaded videos:</label>
        <div>Click on the button below to show all the videos in the workspace</div>
        <button  className={styles.block} onClick={() => ListVideoPage(1)}>Show Uploaded Videos</button>
        <div className={styles.container}>
        </div>
        <div  dangerouslySetInnerHTML={{ __html: videoList}}>
        </div>
        <button className={styles.blockStatic} disabled={prevBtnDisable} onClick={() => ListVideoPage(prevBtnPage)}>Previous Page</button>
        <button className={styles.blockStatic}  disabled={nextBtnDisable} onClick={() => ListVideoPage(nextBtnPage)}>Next Page</button>
      </div>
      </main>
    </>
  )
}
