import React, { useState } from 'react';
import AnnotationsHeader from '../annotationsHeader';
import Canvas from '../canvas';
import styles from './styles.module.scss';

export const Annotations = () => {
  const [imageName, setImageName] = useState<string>('annotations_default.jpg');
  const [imageSrc, setImageSrc] = useState<string>('/images/annotations_default.jpg');

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImageName(file.name);

      const fileUrl = URL.createObjectURL(file);
      setImageSrc(fileUrl);
    }
  };

  return (
    <div className={styles.annotations}>
      <div className={styles.container}>
        <AnnotationsHeader handleImageInput={handleImageInput} imageName={imageName} />
        <Canvas imageSrc={imageSrc} imageName={imageName} />
        <p className={styles.note}>
          To leave a comment, mouseover <img src="/images/ic_plus.svg" alt="cursor" /> on an image and click
          the left mouse button <img src="/images/ic_mouse.svg" alt="left mouse button click" />
        </p>
      </div>
    </div>
  );
};
