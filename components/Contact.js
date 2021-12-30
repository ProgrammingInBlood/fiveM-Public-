import styles from "./Contact.module.scss";
import { useForm, ValidationError } from "@formspree/react";

import Link from "next/link";
import Image from "next/image";
function Contact() {
  const [state, handleSubmit] = useForm("xnqlvyag");
  let msg = "";

  if (state.succeeded) {
    msg = "Email Sent Sucessfully";
  }

  return (
    <div className={styles.container}>
      <h1>Get in Touch</h1>
      <div className={styles.main}>
        <div className={styles.containerContact} id="contact">
          <div className={styles.image}>
            <Image
              src="/images/circle.png"
              alt="contact"
              width={400}
              height={400}
              objectFit="contain"
              priority={true}
            />
          </div>
          <div className={styles.contactUs}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                className={styles.input}
                id="name"
                type="text"
                name="name"
                placeholder="NAME"
              />
              <ValidationError
                prefix="Message"
                field="message"
                errors={state.errors}
              />

              <input
                className={styles.input}
                id="email"
                type="email"
                name="email"
                placeholder="EMAIL"
              />
              <ValidationError
                prefix="Email"
                field="email"
                errors={state.errors}
              />
              <input
                className={styles.input}
                id="number"
                type="number"
                name="number"
                placeholder="CONTACT NUMBER (OPTIONAL)"
              />
              <ValidationError
                prefix="Message"
                field="message"
                errors={state.errors}
              />
              <textarea
                className={styles.textarea}
                id="message"
                name="message"
                placeholder="MESSAGE"
              />
              <ValidationError
                prefix="Message"
                field="message"
                errors={state.errors}
              />
              <button
                className={styles.button}
                type="submit"
                disabled={state.submitting}
              >
                Submit
              </button>
              <p style={{ display: msg ? "block" : "none" }}> {msg} </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
