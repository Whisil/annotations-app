import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import AnnotationsItem from '../annotationsItem';
import { Annotations, deleteAnnotation, getAnnotations } from '../../utils/annotationsUtils';

import styles from './styles.module.scss';
import { UserObj } from '../header';
import { useAuthCheck } from '../../hooks/useAuthCheck';

interface CanvasProps {
  imageSrc: string;
  imageName: string;
}

const Canvas = ({ imageSrc, imageName }: CanvasProps) => {
  const [annotations, setAnnotations] = useState<Annotations[]>([]);
  const [tempAnnotations, setTempAnnotations] = useState<Annotations[]>([]);
  const [showTemp, setShowTemp] = useState<boolean>(false);
  const [lastId, setLastId] = useState<number>(0);
  const [canvasOffset, setCanvasOffset] = useState<number>(0);
  const [user, setUser] = useState<UserObj | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleSubmitNew = (newAnnotation: Annotations) => {
    setAnnotations((prevState) => [...prevState, newAnnotation]);
    setTempAnnotations([]);
    setLastId((prev) => prev + 1);
  };

  const handleDelete = (id: number) => {
    deleteAnnotation(id);

    const newAnnotations = [];

    for (let i = 0; i < annotations.length; i++) {
      if (annotations[i].id !== id) {
        newAnnotations.push(annotations[i]);
      }
    }

    setAnnotations(newAnnotations);
  };

  const handleResize = useCallback(() => {
    if (imageRef.current && canvasRef.current) {
      setCanvasOffset(
        imageRef.current?.getBoundingClientRect().left -
          canvasRef.current?.getBoundingClientRect().left,
      );
    }
  }, []);

  const handleImgClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLImageElement;
    setTempAnnotations(() => []);

    setTempAnnotations([
      {
        id: lastId !== 0 ? lastId + 1 : 1,
        author: user ? user.displayName : 'Harry Potter',
        onImage: imageName,
        pos: {
          x: parseFloat((e.nativeEvent.offsetX / target.offsetWidth).toFixed(4)),
          y: parseFloat((e.nativeEvent.offsetY / target.offsetHeight).toFixed(4)),
        },
      },
    ]);

    setShowTemp(true);
  };

  const handleHideTemp = () => {
    setShowTemp(false);
    setTempAnnotations([]);
  };

  useClickOutside(canvasRef, () => tempAnnotations.length !== 0 && setTempAnnotations([]));

  useEffect(() => {
    getAnnotations(setAnnotations, imageName, setLastId);
  }, [imageName]);

  useAuthCheck(setUser);

  useEffect(() => {
    function handleResize() {
      if (imageRef.current && canvasRef.current) {
        setCanvasOffset(
          imageRef.current?.getBoundingClientRect().left -
            canvasRef.current?.getBoundingClientRect().left,
        );
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <div className={styles.canvas} ref={canvasRef}>
      <div className={styles.canvasContainer} ref={imageRef}>
        <img
          onClick={(e: React.MouseEvent) => handleImgClick(e)}
          className={styles.canvasImage}
          src={imageSrc}
          alt=""
          onLoad={() => {
            if (imageRef.current && canvasRef.current) {
              setCanvasOffset(
                imageRef.current?.getBoundingClientRect().left -
                  canvasRef.current?.getBoundingClientRect().left,
              );
            }
          }}
        />
        {annotations.map((item, index) => (
          <AnnotationsItem
            key={item.pos.x + item.pos.y}
            coordX={item.pos.x}
            coordY={item.pos.y}
            showingId={index + 1}
            id={item.id}
            author={item.author}
            comment={item.comment}
            handleDelete={handleDelete}
            canvasOffset={canvasOffset}
          />
        ))}
        {showTemp &&
          tempAnnotations.map((item) => (
            <AnnotationsItem
              key={item.pos.x + item.pos.y}
              coordX={item.pos.x}
              coordY={item.pos.y}
              showingId={annotations.length + 1}
              id={item.id}
              author={item.author}
              comment={item.comment}
              handleSubmitNew={handleSubmitNew}
              hideTemp={handleHideTemp}
              imageSrc={imageName}
              canvasOffset={canvasOffset}
            />
          ))}
      </div>
    </div>
  );
};

export default Canvas;
