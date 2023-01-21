import { signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";
import { useAuthCheck } from "../../hooks/useAuthCheck";
import { auth, provider } from "../../service/firebase";
import styles from "./styles.module.scss";

export interface UserObj {
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

  useAuthCheck(setUser);

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
