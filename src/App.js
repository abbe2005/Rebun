import React, { useEffect } from "react"; // Import useEffect
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Market from "./components/pages/Market";
import Safety from "./components/pages/Safety";
import Guide from "./components/pages/Guide";
import Faq from "./components/pages/Faq";
import Contact from "./components/pages/Contact";
import Login from "./components/pages/Login";
import Messages from "./components/pages/Messages";
import Register from "./components/pages/Register";
import ForgotPassword from "./components/pages/ForgotPassword";
import Profile from "./components/pages/Profile";
import ProductDetails from "./components/pages/ProductDetails";
import ProductDashboard from "./components/pages/ProductDashboard";
import AddProduct from "./components/pages/AddProduct";
import AdminDashboard from "./components/pages/AdminDashboard";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { LanguageProvider } from './components/LanguageContext';
import AdModal from "./components/AdModal/AdModal";
function App() {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        await addDoc(collection(db, "visitors"), {
          timestamp: new Date().toISOString(),
          anonymousId: Math.random().toString(36).substring(7), // Generate a unique ID
        });
      } catch (err) {
        console.error("Error tracking visitor:", err);
      }
    };

    // Call this function when a user visits the website
    trackVisitor();
  }, []);

  return (
    <Router>
       <AdModal /> {/* Add the AdModal here */}
      <Navbar />
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Market Pages */}
        <Route path="/market" element={<Market />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* Product Management Pages */}
        <Route path="/product-dashboard" element={<ProductDashboard />} />
        <Route path="/add-product" element={<AddProduct />} />

        {/* Additional Pages */}
        <Route path="/safety" element={<Safety />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

// Wrap the App component with LanguageProvider in index.js
export default App;