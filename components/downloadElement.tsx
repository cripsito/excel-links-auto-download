import React, { useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import fetchProgress from '../utils/fetch-progress';
import ProgressBar from './progressBar';

interface IProps {
  url: string;
  filename: string;
  numerics: string;
  done: any;
}

const DownloadElement: React.VFC<IProps> = ({
  url,
  filename,
  numerics,
  done,
}) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    fetch(url)
      .then(
        fetchProgress({
          onProgress(progress) {
            console.log({ progress });
            setProgress(progress.percentage);
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
          a.setAttribute('download', filename + numerics);
          a.click();
          setVisible(false);
          setTimeout(() => {
            URL.revokeObjectURL(a.href);
            a.parentNode && a.parentNode.removeChild(a);
          }, 0);
        });
      });
  }, []);
  const [container] = useState(document.createElement('div'));

  useEffect(() => {
    const current = document.getElementById('current');
    current?.appendChild(container);
    return () => {
      current?.removeChild(container);
    };
  }, []);

  return ReactDom.createPortal(
    <>{visible && <ProgressBar percentage={progress} name={filename} />}</>,
    container,
  );
};
export default DownloadElement;
