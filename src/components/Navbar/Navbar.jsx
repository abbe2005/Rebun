import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useLanguage } from '../LanguageContext'; // Import the context
import logo from "./imgsrc/logo.png";
import { FaEnvelope, FaBell, FaCaretDown } from "react-icons/fa";
import { auth, db } from "../../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, updateDoc, doc as firestoreDoc } from "firebase/firestore";

const Navbar = () => {
const [currentLanguage, setCurrentLanguage] = useState('en'); // Default to English
const { t, language, setLanguage } = useLanguage(); // Use the context // Use the context
  const [user, setUser ] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [Pfp, setPfp] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);
  const [isLightTheme, setIsLightTheme] = useState(() => {
    const savedTheme = localStorage.getItem("isLightTheme");
    return savedTheme === "true";
  });

  useEffect(() => {
    document.body.classList.toggle('light-theme', isLightTheme);
    localStorage.setItem("isLightTheme", isLightTheme);
  }, [isLightTheme]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser (user);
      if (user) {
        setPfp(user.photoURL || "");
        const q = query(collection(db, "notifications"), where("userId", "==", user.uid));
        const unsubscribeNotifications = onSnapshot(q, (snapshot) => {
          const notificationsList = [];
          let unread = 0;
          snapshot.forEach((doc) => {
            notificationsList.push({ id: doc.id, ...doc.data() });
            if (!doc.data().read) unread++;
          });
          setNotifications(notificationsList.sort((a, b) => b.createdAt - a.createdAt));
          setUnreadCount(unread);
        });
        return () => unsubscribeNotifications();
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setShowNotifications(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const markAsRead = async (notificationId) => {
    try {
      await updateDoc(firestoreDoc(db, "notifications", notificationId), {
        read: true
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const toggleNotifications = (e) => {
    e.preventDefault();
    setShowNotifications(!showNotifications);
    setShowDropdown(false);
  };

  const toggleTheme = () => {
    setIsLightTheme((prevTheme) => !prevTheme);
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  


  return (
    <nav className="navbar">
        <div className={`navbar-left ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="theme-toggle-container">
  <label
    htmlFor="themeToggle"
    className={`themeToggle st-sunMoonThemeToggleBtn ${isLightTheme ? "light" : "dark"}`}
  >
    <input
      type="checkbox"
      id="themeToggle"
      className="themeToggleInput"
      checked={isLightTheme} // Invert the state for the checkbox
      onChange={toggleTheme} // Use the toggleTheme function
    />
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="currentColor"
      stroke="none"
    >
      <mask id="moon-mask">
        <rect x="0" y="0" width="20" height="20" fill="white"></rect>
        <circle cx="11" cy="3" r="8" fill="black"></circle>
      </mask>
      <circle
        className="sunMoon"
        cx="10"
        cy="10"
        r="8"
        mask="url(#moon-mask)"
      ></circle>
      <g>
        <circle className="sunRay sunRay1" cx="18" cy="10" r="1.5"></circle>
        <circle className="sunRay sunRay2" cx="14" cy="16.928" r="1.5"></circle>
        <circle className="sunRay sunRay3" cx="6" cy="16.928" r="1.5"></circle>
        <circle className="sunRay sunRay4" cx="2" cy="10" r="1.5"></circle>
        <circle className="sunRay sunRay5" cx="6" cy="3.1718" r="1.5"></circle>
        <circle className="sunRay sunRay6" cx="14" cy="3.1718" r="1.5"></circle>
      </g>
    </svg>
  </label>
</div>
      <Link to="/market">{t('market')}</Link>
      <Link to="/safety">{t('safety')}</Link>
      <Link to="/faq">{t('faq')}</Link>
      <Link to="/guide">{t('guide')}</Link>
    </div>
    <div className="navbar-logo">
      <Link to="/">
        <img src={logo} alt="Logo" />
      </Link>
    </div>

    {/* Mobile Menu Toggle Button */}
    <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
      ☰
    </button>

    <div className={`navbar-right ${isMobileMenuOpen ? "open" : ""}`}>
      <Link to="/contact">{t('contact')}</Link>
      <div className="user-status">
          {user ? (
            user.email === "abdennourbesselma19@gmail.com" ? (
              <Link to="/admin-dashboard">{t('adminDashboard')}</Link>
            ) : (
              <div className="navbar-dropdown">
                <button onClick={toggleDropdown} className="navbar-dropdown-button">
                  <div className="pfp">
                    {Pfp && <img src={Pfp} alt="Profile Picture" className="profile-picture" />}
                  </div>
                  <FaCaretDown />
                </button>
                {showDropdown && (
                  <div className="navbar-dropdown-menu">
                    <Link to="/profile" onClick={() => setShowDropdown(false)}>
                      {t('profile')}
                    </Link>
                    <Link to="/product-dashboard" onClick={() => setShowDropdown(false)}>
                      {t('dashboard')}
                    </Link>
                    <Link to="/add-product" onClick={() => setShowDropdown(false)}>
                      {t('goSell')}
                    </Link>
                    <Link onClick={handleLogout} style={{ color: "red" }} to="/">
                      {t('logout')}
                    </Link>
                  </div>
                )}
              </div>
            )
          ) : (
            <Link to="/login">{t('login')}</Link>
          )}
        </div>
        <div className="checkbox-wrapper-8">
        <input
    type="checkbox"
    id="languageToggle"
    className="tgl tgl-skewed"
    checked={language === 'ar'} // Checked if the language is Arabic
    onChange={() => {
      const newLanguage = language === 'en' ? 'ar' : 'en';
      console.log('Toggling language from', language, 'to', newLanguage); // Debugging
      setLanguage(newLanguage); // Update context and localStorage
    }}
  />
  <label
    htmlFor="languageToggle"
    className="tgl-btn"
    data-tg-on="العربية" // Arabic label
    data-tg-off="ُENGLISH" // English label
  ></label>
    </div>
                    
        <Link to="/messages">
          <FaEnvelope className="navbar-icon" />
        </Link>
        
    </div>
  </nav>


  );
};

export default Navbar;