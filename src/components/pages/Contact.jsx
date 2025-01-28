import React, { useRef, useState } from "react";
import emailjs from "emailjs-com";
import "./styles/Login.css";

const Contact = () => {
  const form = useRef();
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const sendEmail = (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true

    emailjs
      .sendForm(
        "service_am9k15d",
        "template_104likl",
        form.current,
        "mjaHGne8PHKuaUe0o"
      )
      .then(
        (result) => {
          console.log("Email sent successfully!", result.text);
          alert("Your message has been sent!");
          setIsLoading(false); // Set loading to false
        },
        (error) => {
          console.error("Failed to send email:", error.text);
          alert("Failed to send your message. Please try again.");
          setIsLoading(false); // Set loading to false
        }
      );

    e.target.reset();
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Contact Us</h1>
        <form ref={form} onSubmit={sendEmail} className="login-form">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="login-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="login-input"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            className="login-input"
            rows="4"
            required
          />
          <button
            type="submit"
            className="login-button"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;