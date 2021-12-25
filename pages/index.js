import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/Homepage.module.scss";

export default function Home() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [url, setUrl] = useState("");

  const handleModel = () => {
    if (showModal) {
      setShowModal(false);
      document.body.style.overflow = "visible";
    } else {
      setShowModal(true);
      document.body.style.overflow = "hidden";
    }
  };

  const handleModel2 = () => {
    if (showModal2) {
      setShowModal2(false);
      document.body.style.overflow = "visible";
    } else {
      setShowModal2(true);
      document.body.style.overflow = "hidden";
    }
  };

  const handleRoute = (path) => {
    setUrl(path);
    if (cameraPermission == true) {
      router.push(path);
    } else {
      handleModel2();
      setShowModal(true);
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) =>
        devices.forEach((device) =>
          device.label != "" ? setCameraPermission(true) : null
        )
      );
  }, []);

  console.log({ cameraPermission });

  return (
    <div className={styles.container}>
      <Head>
        <title>Unreal Eye - Argumented Reality</title>
        <meta property="og:site_name" content="UnReal Eye"></meta>
        <meta property="og:url" content="https://eklavyasingh.me/"></meta>
        <meta
          property="og:image"
          content="https://www.facebook.com/images/fb_icon_325x325.png"
        ></meta>
        <meta name="theme-color" content="#000"></meta>
      </Head>
      <Navbar />
      <div
        className={styles.modalContainer}
        style={{
          visibility: showModal2 ? "visible" : "hidden",
          opacity: showModal2 ? 1 : 0,
        }}
      >
        <div className={styles.modal}>
          <h1>Choose a Model</h1>
          <ul>
            <li>
              <div
                className={styles.modalItems}
                onClick={() => handleRoute("/object-detection")}
              >
                <Image src="/images/1.png" width={100} height={100} />
                <h3>Object Detection</h3>
              </div>

              <div className={styles.modalItems}>
                <Image src="/images/2.png" width={100} height={100} />
                <h3>Text Toxicity Detection</h3>
              </div>
            </li>
            <li>
              <div
                className={styles.modalItems}
                onClick={() => handleRoute("/hand-detection")}
              >
                <Image src="/images/3.png" width={100} height={100} />
                <h3>Hand Detection</h3>
              </div>

              <div className={styles.modalItems}>
                <Image src="/images/4.png" width={100} height={100} />
                <h3>Body Segmentation</h3>
              </div>
            </li>

            <li>
              <div className={styles.modalItems}>
                <Image src="/images/5.png" width={100} height={100} />
                <h3>Face Detection</h3>
              </div>

              <div className={styles.modalItems}>
                <Image src="/images/6.png" width={100} height={100} />
                <h3>KNN Classifier</h3>
              </div>
            </li>
          </ul>
          <div
            className={styles.buttons}
            style={{ justifyContent: "flex-end" }}
          >
            <button className={styles.button} onClick={handleModel2}>
              Close
            </button>
          </div>
        </div>
      </div>
      <div
        className={styles.modalContainer}
        style={{
          visibility: showModal ? "visible" : "hidden",
          opacity: showModal ? 1 : 0,
        }}
      >
        <div className={styles.modal} style={{ paddingTop: 30 }}>
          <div className={styles.close}></div>

          <h1>We Need Camera Access To Work</h1>
          <p style={{ color: "#73717e", paddingTop: 10 }}>
            Please Allow camera permission to continue{" "}
          </p>

          <div className={styles.modalImage}>
            <Image
              src="/images/allow.jpg"
              width={660}
              height={200}
              objectFit="contain"
            />
          </div>

          <p className={styles.modalNote}>
            We dont store any data accessed from the camera all the tasks will
            be running on client side only.{" "}
          </p>
          <div
            className={styles.buttons}
            style={{ justifyContent: "flex-end" }}
          >
            <button className={styles.button} onClick={() => router.push(url)}>
              Continue
            </button>
            <button className={styles.button} onClick={handleModel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.details}>
          <h1>Explore the world of Augmented reality</h1>
          <p>
            Explore an interactive experience of a real-world environment where
            the objects that reside in the real world are enhanced by
            computer-generated perceptual information.
          </p>
          <div className={styles.buttons}>
            <button className={styles.button} onClick={handleModel2}>
              Launch AR
            </button>
            <button className={styles.button}>Learn More</button>
          </div>
        </div>
        <div className={styles.videoContainer}>
          <video src="/videos/home2.mp4" muted autoPlay loop></video>
        </div>
      </div>
      <div className={styles.faqs}>
        <div className={styles.faq}>
          <h3>What is Unreal Eye</h3>
          <p>
            Unreal Eye helps to Create, compete, and interact with A.I. Agents
            across many gaming worlds, financial applications, and metaverses.
            Create new Agents, etc.
          </p>
          <button className={styles.button}>Learn More</button>
        </div>
        <div className={styles.faq}>
          <h3>How Detection Works</h3>
          <p>
            This model detects objects defined in the COCO dataset. The model is
            trained on a large dataset of images collected by the Internet
            Engineering Task Force.
          </p>
          <button className={styles.button}>Learn More</button>
        </div>
      </div>
      <div className={styles.projectContainer}>
        <h1>More Projets Coming Soon</h1>
        <div className={styles.projects}>
          <div className={styles.project}>
            <Image src="/images/1.png" width={100} height={100} />
            <h3>Object Detection</h3>
          </div>
          <div className={styles.project}>
            <Image src="/images/2.png" width={100} height={100} />
            <h3>Text Toxicity Detection</h3>
          </div>
          <div className={styles.project}>
            <Image src="/images/3.png" width={100} height={100} />
            <h3>Hand Detection</h3>
          </div>
          <div className={styles.project}>
            <Image src="/images/4.png" width={100} height={100} />
            <h3>Body Segmentation</h3>
          </div>
          <div className={styles.project}>
            <Image src="/images/5.png" width={100} height={100} />
            <h3>Face Detection</h3>
          </div>
          <div className={styles.project}>
            <Image src="/images/6.png" width={100} height={100} />
            <h3>KNN Classifier</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
