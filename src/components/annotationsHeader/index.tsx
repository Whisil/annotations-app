import React from 'react';
import styles from './styles.module.scss';

interface AnnotationsHeaderProps {
  handleImageInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageName: string;
}

const AnnotationsHeader = ({ handleImageInput, imageName }: AnnotationsHeaderProps) => {
  return (
    <div className={styles.header}>
      <h2 className={styles.heading}>{imageName}</h2>
      <label className={styles.btn} htmlFor="fileInput">
        <span>Upload image</span>
        <input
          id="fileInput"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className={styles.input}
          onChange={(e) => handleImageInput(e)}
        />
      </label>
    </div>
  );
};

export default AnnotationsHeader;
