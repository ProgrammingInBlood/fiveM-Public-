import { useEffect, useState, useRef } from "react";
import styles from "../styles/Home.module.scss";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import Loading from "../components/Loading";
import { useRouter } from "next/router";

function Object() {
  const router = useRouter();
  const videoRef = useRef();
  const canvasRef = useRef();
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cameras, setCameras] = useState([]);
  const [mode, setMode] = useState("environment");
  const [show, setShow] = useState(false);
  const [logs, setLogs] = useState([]);
  const [showRealTimeLogs, setShowRealTimeLogs] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(true);

  //Video settings
  var constraints = {
    audio: false,
    video: {
      width: 640,
      height: 480,
      facingMode: mode,
    },
  };

  const handleLogs = () => {
    setShow(!show);
  };
  const handleRealTimeLogs = () => {
    setShowRealTimeLogs(!showRealTimeLogs);
  };
  const handleRoute = async () => {};

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (mediaStream) {
        navigator.mediaDevices.enumerateDevices().then(function (devices) {
          const camera = devices.filter(function (device) {
            return device.kind === "videoinput";
          });
          setCameras(camera);
        });

        var video = document.querySelector("video");
        video.srcObject = mediaStream;
        video.onloadedmetadata = function (e) {
          video.play();
        };
        setCameraLoading(false);
      })
      .catch(function (err) {
        setCameraLoading(false);
        setLoading(false);
        setErr(true);
        console.log(err.name + ": " + err.message);
      }); // always check for errors at the end.
  }, [mode]);

  const streamCamVideo = async () => {
    const modelPromise = cocoSsd.load();
    const model = await modelPromise;
    if (model) {
      setLoading(false);
    }
    const webCamPromise = await navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const cameras = devices.filter(function (device) {
          return device.label !== "";
        });

        if (cameras.length === 0) {
          return false;
        } else {
          return true;
        }
      });

    await Promise.all([modelPromise, webCamPromise])
      .then((values) => {
        if (values[1]) {
          detectFrame(videoRef.current, values[0]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!err && !cameraLoading) {
      streamCamVideo(err);
    }
  }, [err, cameraLoading, mode]);

  const handleSwitch = () => {
    if (cameras.length > 1) {
      if (mode === "environment") {
        setMode("user");
      } else {
        setMode("environment");
      }
    }
  };

  //SETTING UP TENSORFLOW

  const detectFrame = async (video, model) => {
    await model.detect(video).then((predictions) => {
      renderPredictions(predictions);
      requestAnimationFrame(() => {
        detectFrame(video, model);
      });
    });
  };

  const renderPredictions = (predictions) => {
    const ctx = canvasRef?.current?.getContext("2d");
    const ctx2 = document?.getElementById("canvasContainer");
    const ctx3 = document?.getElementById("video");

    if (ctx) {
      ctx.canvas.width = ctx3?.videoWidth;
      ctx.canvas.height = ctx3?.videoHeight;

      ctx.clearRect(0, 0, ctx3?.videoWidth, ctx2?.videoHeight);

      //set position according to video size

      // Font options.
      const font = "12px sans-serif";
      ctx.font = font;
      ctx.textBaseline = "top";
      predictions.forEach((prediction) => {
        setLogs((logs) => [...logs, prediction]);

        const x = prediction.bbox[0];
        const y = prediction.bbox[1];
        const width = prediction.bbox[2];
        const height = prediction.bbox[3];
        // Draw the bounding box.
        ctx.strokeStyle = "#00FFFF";
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);
        // Draw the label background.
        ctx.fillStyle = "#00FFFF";
        const textWidth = ctx.measureText(prediction.class).width;
        const textHeight = parseInt(font, 10); // base 10
        ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
      });

      predictions.forEach((prediction) => {
        const x = prediction.bbox[0];
        const y = prediction.bbox[1];
        // Draw the text last to ensure it's on top.
        ctx.fillStyle = "#000000";
        ctx.fillText(prediction.class, x, y);
      });
    }
  };

  useEffect(() => {
    if (logs.length > 5) {
      setLogs(logs.slice(logs.length - 5));
    }
  }, [logs]);

  if (err) {
    return (
      <div
        className={styles.container}
        style={{
          position: "fixed",
          display: !cameras[0]?.deviceId ? "flex" : "none",
          width: "100%",
          height: "100%",
          zIndex: 998,
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontFamily: "Adieu-Regular, sans-serif",
            padding: "20px 0",
          }}
        >
          <h1>ERROR</h1>
          <p>No Camera Found</p>
        </div>
        <div style={{ padding: 10 }}>
          <h3 style={{ fontFamily: "Adieu-Regular, sans-serif" }}>
            Possible Reasons :
          </h3>
          <ul
            style={{
              fontFamily: "Gilroy-Regular, sans-serif",
              paddingTop: 10,
            }}
            className={styles.list}
          >
            <li>
              <p>
                You are not using a webcam. Please use a webcam to use this
                application.
              </p>
            </li>
            <li>
              <p>
                You have not allowed the application to access your camera.
                Please allow the application to access your camera.
              </p>
            </li>

            <li>
              <p>
                You are using a browser that does not support WebRTC. Please use
                a browser that supports WebRTC to use this application.
              </p>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div id="container" className={styles.container}>
      <Loading display={!loading} />

      <div style={{ padding: 20, display: "flex", justifyContent: "center" }}>
        <div className={styles.canvas} id="canvasContainer">
          <video ref={videoRef} autoPlay={true} id="video"></video>
          <canvas className="size" ref={canvasRef} />
        </div>
      </div>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={handleSwitch}>
          Switch Camera
        </button>
        <button className={styles.button} onClick={handleLogs}>
          {!show ? "Show Camera Details" : "Hide Camera Details"}
        </button>
        <button className={styles.button} onClick={handleRealTimeLogs}>
          {!showRealTimeLogs ? "Show Logs" : "Hide Logs"}
        </button>
      </div>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={handleRoute}>
          Go Back
        </button>
      </div>
      <div className={styles.details}>
        <div
          className={styles.realTimeLog}
          style={{ display: showRealTimeLogs ? "flex" : "none" }}
        >
          <h3>Real-Time Logs</h3>
          <div className={styles.data}>
            {logs.map((log) => (
              <div className={styles.realTimeData} key={Math.random()}>
                <p>Score:{log.score}</p>
                <p>Object:{log.class}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{ display: show ? "block" : "none" }}
          className={styles.logs}
        >
          <h3>Camera Details</h3>
          {cameras.map((camera) => (
            <div className={styles.log} key={camera.deviceId}>
              <p>{camera.label}</p>
              <p>{camera.deviceId}</p>
              <p>{camera.kind}</p>
              <p>{camera.groupId}</p>
              <p>{mode}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Object;
