import Image from "next/image";
import { useState, useEffect } from "react";

import styles from "./Loading.module.scss";

function Loading({ display }) {
  const strings = [
    "Loading Models",
    "Fetching Data",
    "initializing AI",
    "Loading Tensorflow",
  ];
  const [string, setString] = useState(strings[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextString = strings[Math.floor(Math.random() * strings.length)];
      setString(nextString);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={styles.container}
      style={{ display: display ? "none" : "flex" }}
    >
      <Image
        src="/images/Deep.gif"
        alt="loading"
        width={300}
        height={300}
        objectFit="contain"
        priority={true}
      />

      <p
        style={{
          textAlign: "center",
          fontFamily: "Adieu-Regular, sans-serif",
          padding: "20px 0",
        }}
      >
        {string}
      </p>
    </div>
  );
}

export default Loading;
