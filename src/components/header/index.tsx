import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, provider } from "../../service/firebase";
import styles from "./styles.module.scss";

interface UserObj {
  displayName: string;
  avatarURL: string;
}

const Header = () => {
  const [user, setUser] = useState<UserObj | null>(null);

  const signIn = () => {
    signInWithPopup(auth, provider).then((data: any) =>
      setUser({
        displayName: data.user.displayName,
        avatarURL: data.url.photoURL,
      })
    );
  };

  useEffect(() => {
    const observer = onAuthStateChanged(auth, (user) => {
      console.log(user)
      if (user) {
        setUser({
          displayName: user.displayName!,
          avatarURL: user.photoURL!,
        });
      } else {
        setUser(null);
      }
    });

    return () => observer();
  }, []);
  // console.log(user)
  return (
    <div className={styles.header}>
      {user && <div className={styles.user}>
          <img className={styles.userAvatar} src={user.avatarURL} referrerPolicy="no-referrer" alt="" />
          <span className={styles.userName}>{user.displayName}</span>
        </div>}
      <button
        onClick={user ? () => signOut(auth) : signIn}
        className={styles.loginBtn}
      >
        {!user ? (
          <>
            <span className={styles.loginBtnText}>Login</span>
            <img
              src="/images/ic_google.svg"
              alt="Google icon"
              className={styles.loginBtnLogo}
            />
          </>
        ) : (
          <>
            <img
              src="/images/ic_logout.svg"
              alt=""
              className={styles.loginBtnLogo}
            />
          </>
        )}
      </button>
    </div>
  );
};

export default Header;
