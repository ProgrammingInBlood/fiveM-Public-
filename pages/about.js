import styles from "../styles/Developers.module.scss";
import Navbar from "../components/Navbar";
import Image from "next/image";
import { useRouter } from "next/router";
import Head from "next/head";
function About() {
  const router = useRouter();
  return (
    <div
      className={styles.container}
      style={{ backgroundColor: "rgb(12, 12, 12.5)" }}
    >
      <Head>
        <title>Unreal Eye | About</title>
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
          content="Unreal Eye, Eklavya Singh , eklavyasingh, unrealeye"
        ></meta>
        <meta name="robots" content="index, follow"></meta>
        <meta
          http-equiv="Content-Type"
          content="text/html; charset=utf-8"
        ></meta>
        <meta name="language" content="English"></meta>
      </Head>
      <Navbar index={4} />
      <div className={styles.content}>
        <h1 className={styles.title}>Welocme to Unreal Eye</h1>
      </div>
      <video
        className={styles.video}
        autoPlay
        src="/videos/about.mp4"
        muted
        loop
      />
      <div className={styles.details}>
        <h1 className={styles.titlefull}>Unreal Eye by Eklavya Singh</h1>
        <p className={styles.text}>
          I develop websites for small business. I&apos;ve been involved with
          developing websites for 3 years. While I&apos;m based in Hyderbad,
          India. I build websites for people all over the world.. I&apos;m very
          much passionate about designing and developing website, also i have
          worked with lots of API&apos;s and having well understanding of most
          programming languages and Frameworks.
        </p>
        <h1 className={styles.title}>My Recent Projects</h1>
        <div className={styles.products}>
          <div className={styles.product}>
            <Image
              src="/images/bed.svg"
              alt="ml5"
              width={100}
              height={100}
              objectFit="contain"
            />
            <h3>Bedsdivans </h3>
            <button
              className={styles.button}
              onClick={() => router.push("https://staggingx.bedsdivans.co.uk/")}
            >
              Open Web
            </button>
          </div>
          <div className={styles.product}>
            <Image
              src="/images/crypto.svg"
              alt="ml5"
              width={100}
              height={100}
              objectFit="contain"
            />
            <h3>Hard Blue</h3>
            <button
              className={styles.button}
              onClick={() => router.push("https://www.hard.blue/")}
            >
              Open Web
            </button>
          </div>
          <div className={styles.product}>
            <Image
              src="/images/food.svg"
              alt="ml5"
              width={100}
              height={100}
              objectFit="contain"
            />
            <h3>Bhojan56</h3>

            <button
              className={styles.button}
              onClick={() => router.push("https://food2mood.vercel.app")}
            >
              Open Web
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
