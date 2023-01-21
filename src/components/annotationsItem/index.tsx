import clsx from 'clsx'; 
import React, { useRef, useState } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { Annotations, nameFormat, postAnnotation } from '../../utils/annotationsUtils';
import styles from './styles.module.scss';

interface ItemProps {
  coordX: number;
  coordY: number;
  id: number;
  showingId: number;
  author: string;
  comment?: string;
  handleSubmitNew?: (newAnnotation: Annotations) => void;
  handleDelete?: (id: number) => void;
  hideTemp?: () => void;
  imageSrc?: string;
  canvasOffset: number;
}

const AnnotationsItem = ({
  coordX,
  coordY,
  id,
  showingId,
  author,
  comment,
  handleSubmitNew,
  handleDelete,
  hideTemp,
  imageSrc,
  canvasOffset,
}: ItemProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const annotationRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newAnnotation: Annotations = {
      id: id,
      author: author,
      onImage: imageSrc,
      comment: inputValue,
      pos: {
        x: coordX,
        y: coordY,
      },
    };
    handleSubmitNew && handleSubmitNew(newAnnotation);

    postAnnotation(newAnnotation);
  };

  const handleDotClick = () => {
    comment && setVisible((prev) => !prev);
    !comment && hideTemp && hideTemp();
  };

  useClickOutside(annotationRef, () => {
    setVisible(false);
    !comment && hideTemp && hideTemp();
  });

  return (
    <div
      className={clsx(
        styles.annotationsItem,
        coordX >= 0.5 ? styles.alignLeft : styles.alignRight,
        coordX >= 0.8 && canvasOffset <= 200
          ? styles.alignLeftLarge
          : coordX <= 0.2 && canvasOffset <= 200
          ? styles.alignRightLarge
          : null,
        coordY >= 0.75 && styles.alignTop,
      )}
      style={{ top: coordY * 100 + `%`, left: coordX * 100 + `%`, zIndex: visible ? 100 : id }}
      ref={annotationRef}
    >
      <div className={styles.dot} onClick={handleDotClick}>
        <span className={styles.dotId}>{showingId}</span>
      </div>

      {!comment && (
        <div className={styles.commentContainer}>
          <form
            className={styles.commentForm}
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}
          >
            <input
              autoFocus
              type="text"
              className={styles.commentFormInput}
              placeholder="Leave a comment"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            />
            <button
              disabled={inputValue.length === 0}
              type="submit"
              className={styles.commentFormBtn}
            >
              <img src="/images/ic_send.svg" alt="send btn" />
            </button>
          </form>
        </div>
      )}

      {comment && visible && (
        <div className={clsx(styles.commentContainer, styles.newPadding)}>
          <div className={styles.annotation}>
            <div className={styles.annotationAvatar}>{nameFormat(author)}</div>
            <div>
              <h5 className={styles.annotationAuthor}>{author}</h5>
              <p className={styles.annotationText}>{comment}</p>
            </div>
          </div>
          <button className={styles.deleteBtn} onClick={() => handleDelete && handleDelete(id)}>
            <img src="/images/ic_delete.svg" alt="delete btn" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AnnotationsItem;
