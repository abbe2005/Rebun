import React, { useState, useEffect } from "react";
import { FaWallet, FaShoppingBasket, FaChartLine, FaInfoCircle } from "react-icons/fa";
import "./Home.css";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slide data with icons
  const slides = [
    {
      text: "BUY WHAT YOU NEED",
      content: "RENT WHAT YOU WANT",
      icon: <FaWallet className="floating-icon" />, // Shopping cart icon
    },
    {
      text: "WANT TO BECOME A SELLER?",
      content: "ADD YOUR PRODUCT TO THE MARKET!",
      icon: <FaShoppingBasket className="floating-icon" />, // Shopping cart icon
    },
    {
      text: "HIGH PRICES?",
      content: "RENT AND SAVE MONEY!",
      icon: <FaChartLine className="floating-icon" />, // Shopping cart icon
    },
    {
      text: "WANNA KNOW MORE ABOUT REBUN?",
      content: "TAKE A LOOK AT OUR FAQ!",
      icon: <FaInfoCircle className="floating-icon" />, // Shopping cart icon
    },
  ];

  // Automatically change slides every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="home">
      {/* Slide Content */}
      <div className="slide">
        <h1>{slides[currentSlide].text}</h1>
        <p>{slides[currentSlide].content}</p>
        <br></br><br></br><br></br>
        <div className="icon-container">
          {slides[currentSlide].icon} {/* Floating icon */}
        </div>
      </div>
    </div>
  );
};

export default Home;