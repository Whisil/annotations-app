import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../service/firebase";

export interface Annotations {
  id: number;
  author: string;
  authorImgURL: string;
  comment?: string;
  onImage?: string;
  pos: {
    x: number;
    y: number;
  };
}

export interface UserObj {
  displayName: string;
  avatarURL: string;
}

export const nameFormat = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};

export const getAnnotations = async (
  callback: (data: Annotations[]) => void,
  image: string,
  setLastId: (id: number) => void
) => {
  await getDocs(
    query(
      collection(db, "annotations") as CollectionReference<Annotations>,
      orderBy("id", "asc")
    )
  ).then((querySnapshot) => {
    const newData = querySnapshot.docs.map((doc) => doc.data());

    callback(
      [...newData].filter((item: Annotations) => item.onImage === image)
    );
    setLastId(newData.length);
  });
};

export const postAnnotation = async (data: Annotations) => {
  await addDoc(collection(db, "annotations"), data);
};

export const deleteAnnotation = async (id: number) => {
  const collectionQuery = query(
    collection(db, "annotations"),
    where("id", "==", id)
  );
  const docsRef = await getDocs(collectionQuery);

  await deleteDoc(doc(db, "annotations", docsRef.docs[0].id));
};
