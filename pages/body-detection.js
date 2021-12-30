import { useEffect, useState, useRef } from "react";
import styles from "../styles/Home.module.scss";
import "@tensorflow/tfjs";
import * as handdetection from "@tensorflow-models/hand-pose-detection";
import * as bodyPix from "@tensorflow-models/body-pix";
import * as posenet from "@tensorflow-models/posenet";
import Loading from "../components/Loading";
import { useRouter } from "next/router";
import { fingerLookupIndices } from "../lib/camera";
import * as partColorScales from "../lib/body_color";

function HandPose() {
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
  const [minConfidence, setMinConfidence] = useState(0.5);
  const [net, setNet] = useState(null);

  //Video settings
  var constraints = {
    audio: false,
    video: {
      width: 640,
      height: 480,
      facingMode: mode,
    },
  };

  const COLOR = "aqua";
  const BOUNDING_BOX_COLOR = "red";
  const LINE_WIDTH = 2;

  /**
   * Draws a line on a canvas, i.e. a joint
   */
  function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
    ctx.beginPath();
    ctx.moveTo(ax * scale, ay * scale);
    ctx.lineTo(bx * scale, by * scale);
    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle = color;
    ctx.stroke();
  }
  /**
   * Draws a pose skeleton by looking up all adjacent keypoints/joints
   */

  function drawSkeleton(keypoints, minConfidence, ctx, scale) {
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
      keypoints,
      minConfidence
    );

    function toTuple({ y, x }) {
      return [y, x];
    }

    adjacentKeyPoints.forEach((keypoints) => {
      drawSegment(
        toTuple(keypoints[0].position),
        toTuple(keypoints[1].position),
        COLOR,
        scale,
        ctx
      );
    });
  }

  /**
   * Draw the bounding box of a pose. For example, for a whole person standing
   * in an image, the bounding box will begin at the nose and extend to one of
   * ankles
   */
  function drawBoundingBox(keypoints, ctx) {
    const boundingBox = posenet.getBoundingBox(keypoints);

    ctx.rect(
      boundingBox.minX,
      boundingBox.minY,
      boundingBox.maxX - boundingBox.minX,
      boundingBox.maxY - boundingBox.minY
    );

    ctx.strokeStyle = boundingBoxColor;
    ctx.stroke();
  }

  /**
   * Converts an array of pixel data into an ImageData object
   */
  async function renderToCanvas(a, ctx) {
    const [height, width] = a.shape;
    const imageData = new ImageData(width, height);

    const data = await a.data();

    for (let i = 0; i < height * width; ++i) {
      const j = i * 4;
      const k = i * 3;

      imageData.data[j + 0] = data[k + 0];
      imageData.data[j + 1] = data[k + 1];
      imageData.data[j + 2] = data[k + 2];
      imageData.data[j + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Draw an image on a canvas
   */
  function renderImageToCanvas(image, size, canvas) {
    canvas.width = size[0];
    canvas.height = size[1];
    const ctx = canvas.getContext("2d");

    ctx.drawImage(image, 0, 0);
  }

  const handleLogs = () => {
    setShow(!show);
  };
  const handleRealTimeLogs = () => {
    setShowRealTimeLogs(!showRealTimeLogs);
  };
  const handleRoute = async () => {
    router.push("/");
  };

  const getWebcam = async () => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (mediaStream) {
        navigator.mediaDevices.enumerateDevices().then(function (devices) {
          const camera = devices.filter(function (device) {
            return device.kind === "videoinput";
          });
          setCameras(camera);
        });
        window.stream = mediaStream;

        var video = videoRef.current;
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
  };

  const stopWebcam = async () => {
    const tracks = window.stream.getTracks();
    console.log(tracks);
    tracks.forEach(function (track) {
      track.stop();
    });
  };

  useEffect(() => {
    getWebcam();
    return () => {
      stopWebcam();
    };
  }, [mode, videoRef]);
  const streamCamVideo = async () => {
    const detector = await bodyPix.load({
      architecture: "MobileNetV1",
      outputStride: 16,
      internalResolution: "low",
      multiplier: 0.5,
      quantBytes: 2,
    });

    if (detector) {
      setNet(detector);
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
    await Promise.all([detector, webCamPromise])
      .then(async (values) => {
        if (values[1]) {
          detectFrame(videoRef.current, detector);
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

  const detectFrame = async (video, detector) => {
    await detector.segmentMultiPerson(video).then((predictions) => {
      renderPredictions(predictions);
      requestAnimationFrame(() => {
        detectFrame(video, detector);
      });
    });
  };

  const renderPredictions = async (predictions) => {
    console.log(predictions);
    const ctx = canvasRef?.current?.getContext("2d");
    const ctx2 = document?.getElementById("canvasContainer");
    const ctx3 = videoRef.current;
    ctx.canvas.width = ctx3?.videoWidth;
    ctx.canvas.height = ctx3?.videoHeight;
    ctx.clearRect(0, 0, ctx3?.videoWidth, ctx2?.videoHeight);
    function drawPoint(ctx, y, x, r, color) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }

    function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
      for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];
        // if (keypoint.score < minConfidence) {
        //   continue;
        // }
        const { y, x } = keypoint.position;
        drawPoint(ctx, y * scale, x * scale, 3, COLOR);
      }
    }
    function drawBoundingBox(keypoints, ctx) {
      const boundingBox = posenet.getBoundingBox(keypoints);

      ctx.rect(
        boundingBox.minX,
        boundingBox.minY,
        boundingBox.maxX - boundingBox.minX,
        boundingBox.maxY - boundingBox.minY
      );

      ctx.strokeStyle = "red";
      ctx.stroke();
    }

    function drawPoints(ctx, points, radius, color) {
      const data = points;

      for (let i = 0; i < data.length; i += 2) {
        const pointY = data[i];
        const pointX = data[i + 1];

        if (pointX !== 0 && pointY !== 0) {
          ctx.beginPath();
          ctx.arc(pointX, pointY, radius, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
    }

    predictions.forEach(async (prediction) => {
      const keypoints = prediction.pose.keypoints;
      const minConfidence = 0;
      const coloredPartImageData = bodyPix.toColoredPartMask(
        prediction,
        partColorScales.rainbow
      );
      console.log({ coloredPartImageData });
      bodyPix.drawMask(
        canvasRef?.current,
        videoRef.current,
        coloredPartImageData,
        0.9,
        0
      );
      drawKeypoints(keypoints, minConfidence, ctx);
      drawBoundingBox(keypoints, ctx);
      drawSkeleton(keypoints, minConfidence, ctx, 1);
      drawPoints(ctx, prediction.data, 1, "black");
    });
  };

  useEffect(() => {
    if (logs.length > 5) {
      setLogs(logs.slice(logs.length - 5));
    }
  }, [logs]);

  return (
    <div id="container" className={styles.container}>
      <Loading display={!loading} />
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
            style={{ fontFamily: "Gilroy-Regular, sans-serif", paddingTop: 10 }}
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
      <div className={styles.buttons} style={{ paddingTop: 20 }}>
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
                <p>Object:{log.handedness}</p>
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

export default HandPose;
