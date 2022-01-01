import styles from "../styles/Developers.module.scss";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Head from "next/head";

function Developers() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Unreal Eye | For Developers</title>
        <meta property="og:site_name" content="Unreal Eye"></meta>
        <meta property="og:url" content="https://eklavyasingh.me/"></meta>
        <meta
          property="og:image"
          content="https://eklavyasingh.me/images/favicon.png"
        ></meta>
        <meta name="theme-color" content="#000"></meta>
        <link
          rel="icon"
          type="image/png"
          href="https://eklavyasingh.me/images/favicon.png"
        ></link>
        <meta
          name="keywords"
          content="Unreal Eye, AR Hand Detection, Eklavya Singh , eklavyasingh, unrealeye, Hand Detection"
        ></meta>
        <meta name="robots" content="index, follow"></meta>
        <meta
          http-equiv="Content-Type"
          content="text/html; charset=utf-8"
        ></meta>
        <meta name="language" content="English"></meta>
      </Head>
      <Navbar index={2} />
      <div className={styles.content}>
        <h1 className={styles.title}>
          We use TensorFlow.js library for machine learning in JavaScript
        </h1>
      </div>
      <video
        className={styles.video}
        autoPlay
        src="/videos/developers.mp4"
        muted
        loop
      />
      <div className={styles.details}>
        <h1 className={styles.titlefull}>
          Develop ML models in JavaScript, and use ML directly in the browser or
          in Node.js.
        </h1>
        <p className={styles.text}>
          TensorFlow.js is a JavaScript Library for training and deploying
          machine learning models in the browser and in Node.js. See the
          sections below for different ways you can get started. Code ML
          programs without dealing directly with Tensors Want to get started
          with Machine Learning but not worry about any low level details like
          Tensors or Optimizers? Built on top of TensorFlow.js, the ml5.js
          library provides access to machine learning algorithms and models in
          the browser with a concise, approachable API.
        </p>
        <h1 className={styles.title}>How it Works</h1>
        <div className={styles.products}>
          <div className={styles.product}>
            <Image
              src="/images/js-run.svg"
              alt="ml5"
              width={100}
              height={100}
              objectFit="contain"
            />
            <h3>Run existing models</h3>
            <p>
              Use off-the-shelf JavaScript models or convert Python TensorFlow
              models to run in the browser or under Node.js.
            </p>
          </div>
          <div className={styles.product}>
            <Image
              src="/images/js-retrain.svg"
              alt="ml5"
              width={100}
              height={100}
              objectFit="contain"
            />
            <h3>Run existing models</h3>
            <p>
              Use off-the-shelf JavaScript models or convert Python TensorFlow
              models to run in the browser or under Node.js.
            </p>
          </div>
          <div className={styles.product}>
            <Image
              src="/images/js-develop.svg"
              alt="ml5"
              width={100}
              height={100}
              objectFit="contain"
            />
            <h3>Run existing models</h3>
            <p>
              Use off-the-shelf JavaScript models or convert Python TensorFlow
              models to run in the browser or under Node.js.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Developers;
