import React, { useState, useEffect } from "react";
import { FaWallet, FaShoppingBasket, FaChartLine, FaInfoCircle } from "react-icons/fa";
import "./Home.css";
import { useLanguage } from '../LanguageContext'; // Import the context

const Home = () => {
  const { t } = useLanguage(); // Use the context for translations
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slide data with icons
  const slides = [
    {
      text: t("buyWhatYouNeed"), // Use translation function
      content: t("rentWhatYouWant"),
      icon: <FaWallet className="floating-icon" />, // Wallet icon
    },
    {
      text: t("wantToBecomeSeller"),
      content: t("addYourProduct"),
      icon: <FaShoppingBasket className="floating-icon" />, // Shopping basket icon
    },
    {
      text: t("highPrices"),
      content: t("rentAndSave"),
      icon: <FaChartLine className="floating-icon" />, // Chart icon
    },
    {
      text: t("wannaKnowMore"),
      content: t("takeALookAtFAQ"),
      icon: <FaInfoCircle className="floating-icon" />, // Info icon
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