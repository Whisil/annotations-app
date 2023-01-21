export interface Annotations {
    id: number;
    author: string;
    comment?: string;
    onImage?: string;
    pos: {
      x: number;
      y: number;
    };
  }
  
  export const nameFormat = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };
  
  export const getAnnotations = async (
    callback: (data: Annotations[]) => void,
    image: string,
    setLastId: (id: number) => void,
  ) => {
    await fetch('http://localhost:3000/annotations')
      .then((res) => res.json())
      .then((data) => {
        callback(data.filter((item: Annotations) => item.onImage === image));
        setLastId(data.length);
      });
  };
  
  export const postAnnotation = async (data: Annotations) => {
    await fetch('http://localhost:3000/annotations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };
  
  export const deleteAnnotation = async (id: number) => {
    await fetch(`http://localhost:3000/annotations/${id}`, {
      method: 'DELETE',
    });
  };
  