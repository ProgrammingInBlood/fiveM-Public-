import Image from "next/image";
import { useState } from "react";
import styles from "./Navbar.module.scss";

function Navbar() {
  const [show, setShow] = useState(false);

  console.log(show);
  return (
    <div className={styles.navbarContainer}>
      <div className={styles.mobilePop} style={{ top: show ? 0 : -1000 }}>
        <div className={styles.mobileTitle}>
          <Image
            src="/images/logo.png"
            width={50}
            height={20}
            objectFit="contain"
          />
          <p style={{ color: "white" }}>Menu</p>
          <span onClick={() => setShow(!show)}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.24352 7.95064L0.707097 14.4871L-9.18541e-06 13.78L6.53642 7.24354L-1.05213e-05 0.707112L0.707097 5.52148e-06L7.24352 6.53643L13.78 -3.09086e-08L14.4871 0.707107L7.95063 7.24354L14.4871 13.78L13.78 14.4871L7.24352 7.95064Z"
                fill="white"
              ></path>
            </svg>
          </span>
        </div>
        <div className={styles.mobileItems}>
          <a href="#">Home</a>
          <a href="#">For Developers</a>
          <a href="#">Github</a>
          <a href="#">About Us </a>
        </div>
      </div>
      <nav className={styles.navbar}>
        <div className={styles.mobilemenu}>
          <span onClick={() => setShow(!show)}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="2.5" cy="2.5" r="2.5" fill="white"></circle>
              <circle cx="2.5" cy="12.5" r="2.5" fill="white"></circle>
              <circle cx="12.5" cy="2.5" r="2.5" fill="white"></circle>
              <circle cx="12.5" cy="12.5" r="2.5" fill="white"></circle>
            </svg>
          </span>
        </div>
        <div className={styles.links}>
          <a
            href="#"
            style={{ borderBottom: "2px solid #7c6efb", color: "white" }}
          >
            Home
          </a>
          <a href="#">For Developers</a>
          <a href="#">Github</a>
        </div>
        <div className={styles.logo}>
          <Image
            className={styles.logoImage}
            src="/images/logo.png"
            alt="logo"
            width="150"
            height="60"
            objectFit="contain"
          />
        </div>
        <div className={styles.links}>
          <a href="#">About Us</a>
          <button>Get in touch</button>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
