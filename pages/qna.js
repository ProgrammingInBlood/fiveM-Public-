import * as qna from "@tensorflow-models/qna";
import "@tensorflow/tfjs";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import styles from "../styles/Qna.module.scss";
import { css } from "@emotion/react";
import Loader from "react-spinners/BarLoader";
function Qna() {
  const [passage, setPassage] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState([]);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [show, setShow] = useState(false);
  const override = css`
    display: block;
    margin: 0 auto;
  `;

  useEffect(() => {
    async function loadModel() {
      const model = await qna.load();
      setModel(model);
      setLoading(false);
    }
    loadModel();
  }, []);
  console.log(loading);
  console.log(model);
  const handleSearch = async () => {
    setShow(true);
    setAnswerLoading(true);
    await model.findAnswers(question, passage).then((ans) => {
      setAnswer(ans);
      setAnswerLoading(false);
    });
  };

  return (
    <div className={styles.container}>
      <Loading display={!loading} />
      <div className={styles.content}>
        <h1> AI Question and Answer </h1>
        <p>Context (you can paste your own content in the text area)</p>

        <textarea
          className={styles.textarea}
          placeholder="Paste your passage here"
          onChange={(e) => setPassage(e.target.value)}
          value={passage}
        />
        <h1 style={{ paddingTop: 20 }}> Question </h1>
        <div className={styles.multi}>
          <div className={styles.question}>
            <input
              className={styles.input}
              placeholder="Ask your Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button className={styles.button} onClick={handleSearch}>
              Search
            </button>
          </div>
          <div className={styles.controls}>
            <button className={styles.button} onClick={() => setPassage("")}>
              Clear passage
            </button>
            <button className={styles.button} onClick={() => setQuestion("")}>
              Clear question
            </button>
          </div>
        </div>
        <h1
          style={{
            paddingTop: 40,
            textAlign: "center",
            marginBottom: 30,
            display: show ? "block" : "none",
          }}
        >
          {" "}
          Answer{" "}
        </h1>
        <Loader
          color={"#7c6efb"}
          loading={answerLoading}
          css={override}
          size={150}
        />

        {answer.map((ans, index) => {
          return (
            <div
              className={`${styles.answer} ${
                index === 0 ? styles.bestAnswer : null
              }`}
            >
              <p>{ans.text}</p>
              <p>score: {ans.score}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Qna;
