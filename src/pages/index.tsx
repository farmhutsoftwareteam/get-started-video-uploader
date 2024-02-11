import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { ChangeEvent, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Layout from '../components/layout'

export default function Home() {
  const [videoList, setVideoList] = useState<Array<{ title: string; player: string; thumbnail: string; }>>([]);

  const [nextBtnPage, setNextBtnPage] = useState<number>(1);
  const [prevBtnPage, setPrevBtnPage] = useState<number>(1);
  const [nextBtnDisable, setNexBtnDisable] = useState<boolean>(true);
  const [prevBtnDisable, setPrevBtnDisable] = useState<boolean>(true);
  const [uploadBtnDisable, setUploadBtnDisable] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0); // State to track upload progress
  const [file, setFile] = useState<File | null>(null); // Initialize with null for clarity
  

  const serverUrl = 'https://hstvserver.azurewebsites.net';

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const findPaginationValues = (pagination: any) => {
    const paginationKeys = Object.keys(pagination);
    const pagesTotalKey = paginationKeys.find(value => /page(.*)total/i.test(value));
    const currentPageKey = paginationKeys.find(value => /current(.*)page/i.test(value));
    return { pagesTotalKey, currentPageKey };
  };

  const generateNextButton = (pagination: any, paginationKeyValues: any) => {
    if (pagination[paginationKeyValues.currentPageKey] < pagination[paginationKeyValues.pagesTotalKey]) {
      setNextBtnPage(pagination[paginationKeyValues.currentPageKey] + 1);
    }
    setNexBtnDisable(!(pagination[paginationKeyValues.currentPageKey] < pagination[paginationKeyValues.pagesTotalKey]));
  };

  const generatePrevButton = (pagination: any, paginationKeyValues: any) => {
    if (pagination[paginationKeyValues.currentPageKey] > 1) {
      setPrevBtnPage(pagination[paginationKeyValues.currentPageKey] - 1);
    }
    setPrevBtnDisable(pagination[paginationKeyValues.currentPageKey] === 1);
  };

  const checkUploadStatus = async (videoId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      axios.post(`${serverUrl}/uploadStatus`, { videoId: videoId }).then(res => {
        setTimeout(() => { resolve(res.data); }, 200);
      });
    });
  };

  const ListVideoPage = (page: number) => {
    axios.post(`${serverUrl}/videos`, { page: page }).then(res => {
      const videoListArray = res.data.data;
      setVideoList(videoListArray); // Update this line to set videoList directly with the array
      const paginationKeys = findPaginationValues(res.data.pagination);
      generateNextButton(res.data.pagination, paginationKeys);
      generatePrevButton(res.data.pagination, paginationKeys);
    });
  };
  

  const handleUploadClick = () => {
    if (!file) {
      return;
    }
    const data = new FormData();
    data.append('file', file);
    setUploadBtnDisable(true);
    setUploadStatus("Uploading...");

    axios.post(`${serverUrl}/upload`, data, {
      onUploadProgress: progressEvent => {
        if (progressEvent.total !== undefined) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted); // Update upload progress
        }
      }
    }).then(async res => {
      let playableStatus;
      const uploadVideoId = res.data;
      for (let failSafe = 0; failSafe < 30; failSafe++) {
        const uploadStatus = await checkUploadStatus(uploadVideoId);
        playableStatus = uploadStatus.encoding.playable;
        if (playableStatus) {
          failSafe = 30;
          setUploadStatus("Upload successful");
          setUploadBtnDisable(false);
          setUploadProgress(0); // Reset progress after successful upload
        }
      }
    });
  };

  return (
    <>
      <Head>
        <title>HSTV Video Uploader</title>
        <meta name="description" content="Video Management Tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles.container}>
          <label className={styles.h1}>Select file to upload:</label>
          <br />
          <input type="file" id="fileupload" onChange={handleFileChange} />
          <div>{file && `${file.name} - ${file.type}`}</div>
          <button className={styles.block} disabled={uploadBtnDisable} onClick={handleUploadClick}>Upload</button>
          <div className={styles.blockStatic}>Upload Status: {uploadStatus}</div>
          {/* Progress Bar */}
          {uploadProgress > 0 && (
            <div style={{ width: '100%', backgroundColor: '#ddd' }}>
              <div style={{ height: '20px', width: `${uploadProgress}%`, backgroundColor: 'green' }}>
                {uploadProgress}%
              </div>
            </div>
          )}
        </div>
        <div className={styles.container}>
          <label className={styles.h1}>Show the list of uploaded videos:</label>
          <div>Click on the button below to show all the videos in the workspace</div>
          <button className={styles.block} onClick={() => ListVideoPage(1)}>Show Uploaded Videos</button>
          {/* Tabular view for video list */}
          <table className={styles.videoTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Thumbnail</th>
              </tr>
            </thead>
            <tbody>
              {videoList.map((video, index) => (
                <tr key={index}>
                  <td>{video.title}</td>
                  <td>
                    <a href={video.player}>
                      {/* Using Next.js Image component */}
                      <Image src={video.assets.thumbnail} alt={video.title} width={100} height={100} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className={styles.blockStatic} disabled={prevBtnDisable} onClick={() => ListVideoPage(prevBtnPage)}>Previous Page</button>
          <button className={styles.blockStatic} disabled={nextBtnDisable} onClick={() => ListVideoPage(nextBtnPage)}>Next Page</button>
        </div>
      </main>
    </>
  );
}
