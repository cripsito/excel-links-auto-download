import React, { useState, useMemo, useCallback, CSSProperties } from 'react';
import fetchProgress from 'fetch-progress';
import { eachLimit } from 'async';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useDropzone, FileWithPath } from 'react-dropzone';
import XLSX from 'xlsx';

function downloadFile(file: string) {
  // Create a link and set the URL using `createObjectURL`
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = URL.createObjectURL(file);
  //link.download = file.name;

  // It needs to be added to the DOM so it can be clicked
  document.body.appendChild(link);
  link.click();

  // To make this work on Firefox we need to wait
  // a little while before removing it.
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.parentNode && link.parentNode.removeChild(link);
  }, 0);
}
function download(url: string, filename: string, done: any) {
  fetch(url)
    .then(
      fetchProgress({
        onProgress(progress) {
          console.log({ progress });
        },
        onError(err) {
          console.log(err);
        },
        onComplete() {
          done();
        },
      }),
    )
    .then(function (t) {
      return t.blob().then((b) => {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(b);
        a.setAttribute('download', filename);
        a.click();
      });
    });
}

const baseStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  textAling: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  maxHeight: '160px',
  width: '100%',
  marginTop: '20px',
  flexDirection: 'column' as 'column',
};
const activeStyle = { borderColor: '#2196f3' };
const acceptStyle = { borderColor: '#00e676' };
const rejectStyle = { borderColor: '#ff1744' };

export default function Home() {
  const [videoLinks, setVideoLinks] = useState([]);
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    acceptedFiles.map((file: File) => {
      console.log(file);
      var reader = new FileReader();
      reader.onload = function (e) {
        if (e && e.target && e.target.result) {
          var data = new Uint8Array(e.target.result as ArrayBuffer);
          var workbook = XLSX.read(data, { type: 'array' });
          var first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
          var dataJSON = [
            ...XLSX.utils.sheet_to_json(first_worksheet, {
              header: 1,
            }),
          ];
          console.log(dataJSON);
          setVideoLinks(dataJSON as any);

          /* DO SOMETHING WITH workbook HERE */
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({ accept: '.xlsx', onDrop, maxFiles: 1 });
  const style: CSSProperties = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept],
  );
  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      <span className="rounded-lg bg-gray-300 uppercase px-5 py-1 font-bold mr-5 text-white">
        {file.path} - {file.size} bytes
      </span>
      <span className="rounded-3xl bg-green-700 uppercase px-5 py-1 font-bold mr-5 text-green-50">
        {videoLinks.length} links
      </span>
    </li>
  ));
  const startDownload = useCallback(() => {
    if (videoLinks.length > 0) {
      let counter = 1;
      eachLimit(videoLinks, 3, (video, done) => {
        console.log(video[0]);
        download(video[0], counter + '_video.mp4', done);
        counter++;
      });
    }
  }, [videoLinks]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Rick Files</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <span className="rounded-3xl bg-green-700 uppercase px-5 py-1 font-bold mr-5 text-green-50">
            Excel
          </span>
          Links Auto Download
        </h1>

        <p className="mt-10 text-3xl">To start, drop your excel file</p>

        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <p>Drag and drop some files here, or click to select files</p>
        </div>
        <ul className="mt-10">{files}</ul>
        {videoLinks.length > 0 && (
          <button
            onClick={startDownload}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center mt-10"
          >
            <svg
              className="fill-current w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
            </svg>
            Start Downloading
          </button>
        )}
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
