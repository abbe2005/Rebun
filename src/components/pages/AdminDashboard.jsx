import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./styles/AdminDashboard.css";
import getHostingInfo from "../../getHostingInfo";
import checkWebsiteStatus from "../../checkWebsiteStatus";
import { signOut } from "firebase/auth";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [visitors, setVisitors] = useState(0);
  const hostingInfo = getHostingInfo();
  const websiteStatus = checkWebsiteStatus();
  const [serverInfo, setServerInfo] = useState({
    host: hostingInfo,
    database: "Firestore",
    status: websiteStatus,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);

        // Fetch products
        const productsSnapshot = await getDocs(collection(db, "products"));
        const productsData = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);

        // Fetch visitors (example: count unique anonymous visitors)
        const visitorsSnapshot = await getDocs(collection(db, "visitors"));
        setVisitors(visitorsSnapshot.size);
      } catch (err) {
        setError("Error fetching data.");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const makeAdmin = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: "admin" });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: "admin" } : user
        )
      );
    } catch (err) {
      setError("Error making user admin.");
      console.error(err);
    }
  };
  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigate("/login"); // Redirect to login page
    } catch (err) {
      setError("Error logging out.");
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Offline":
        return "red";
      case "Local":
        return "grey";
      case "Online":
        return "green";
      default:
        return "black"; // Fallback color
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-box">
        <h1 className="admin-dashboard-title">Admin Dashboard</h1>
        {error && <p className="error">{error}</p>}

        {/* Server Info */}
        <div className="server-info">
          <h2>Server Information</h2>
          <p>Host: {serverInfo.host}</p>
          <p>Database: {serverInfo.database}</p>
          <p>Status: </p>
          <p style={{ color: getStatusColor(serverInfo.status) }}>
             {serverInfo.status}
          </p>
        </div>

        {/* Users */}
        <div className="users-section">
          <h2>Users</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.displayName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.role !== "admin" && (
                      <button onClick={() => makeAdmin(user.id)}>Make Admin</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Products */}
        <div className="products-section">
          <h2>Products</h2>
          <p>Total Products: {products.length}</p>
          <p>Total Sellers: {new Set(products.map((p) => p.sellerId)).size}</p>
        </div>

        {/* Visitors */}
        <div className="visitors-section">
          <h2>Visitors</h2>
          <p>Total Anonymous Visitors: {visitors}</p>
        </div>
        {/* Logout Button */}
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;