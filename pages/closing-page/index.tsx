import React from 'react';
import Footer from '@/components/footer/footer';
import style from './closingPage.module.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const ClosingPage: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const goToSigninPage = (): void => {
    router.push("/");
}


  return (
    <div className={style.container}>
      <div className={style.centerDiv}>
        <div className={style.text}>
          <img className="icon" src="/icons/Icon-person-white.svg" alt="" />
          <p>
            Thank you for using this app.
            <br />
            See you again.
          </p>
        </div>
        <div className={style.loginButton} onClick={goToSigninPage}>
          <img src="/icons/Login.svg" alt=""  />
          <p>LOG IN</p>
        </div>
      </div>

      <div className={style.footer}>
        <Footer status={false} />
      </div>

    </div>
  );
};

export default ClosingPage;
