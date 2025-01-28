import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { auth, db } from "../../firebase";
import logo from "./imgsrc/logo.png";
import { FaEnvelope, FaBell, FaCaretDown } from "react-icons/fa";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, updateDoc, doc as firestoreDoc } from "firebase/firestore";

const Navbar = () => {
  // Original state
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [Pfp, setPfp] = useState("");
  
  // New state for notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);

  // Original useEffect for auth
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        setPfp(user.photoURL || "");
        
        // Add notification listener
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

  // Click outside handler for notifications
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

  // New notification functions
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

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/market">Market</Link>
        <Link to="/safety">Safety</Link>
        <Link to="/faq">Faq</Link>
        <Link to="/guide">Guide</Link>
      </div>

      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/contact">Contact</Link>
        <div className="user-status">
          {user ? (
            user.email === "abdennourbesselma19@gmail.com" ? (
              <Link to="/admin-dashboard">Admin Dashboard</Link>
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
                      Profile
                    </Link>
                    <Link to="/product-dashboard" onClick={() => setShowDropdown(false)}>
                      Dashboard
                    </Link>
                    <Link to="/add-product" onClick={() => setShowDropdown(false)}>
                      Go Sell
                    </Link>
                    <Link onClick={handleLogout} style={{ color: "red" }} to="/">
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            )
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
        <Link to="/messages">
          <FaEnvelope className="navbar-icon" />
        </Link>
        <div className="notifications-container" ref={notificationRef}>
          <button onClick={toggleNotifications} className="notification-btn">
            <FaBell className="navbar-icon" />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <span>Notifications</span>
                {notifications.some(n => !n.read) && (
                  <button 
                    className="mark-all-read"
                    onClick={() => notifications.forEach(n => !n.read && markAsRead(n.id))}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="notifications-list">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <p>{notification.message}</p>
                      <span className="notification-time">
                        {notification.createdAt?.toDate().toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="no-notifications">No notifications</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;