import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../service/firebase";
import styles from './styles.module.scss';

const Header = () => {
  return (
    <div className={styles.header}>
      <button onClick={() => signInWithPopup(auth, provider)} className={styles.loginBtn}>
        <span className={styles.loginBtnText}>Login</span>
        <img src="/images/ic_google.svg" alt="Google icon" className={styles.loginBtnLogo} />
      </button>
    </div>
  );
};

export default Header;
