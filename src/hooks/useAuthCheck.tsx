import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../service/firebase";

export function useAuthCheck(setState: Function) {
  useEffect(() => {
    const observer = onAuthStateChanged(auth, (user) => {
      if (user) {
        setState({
          displayName: user.displayName!,
          avatarURL: user.photoURL!,
        });
      } else {
        setState(null);
      }
    });

    return () => observer();
  }, [setState]);
}
